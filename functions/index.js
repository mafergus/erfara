/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
require('@google-cloud/debug-agent').start({ allowExpressions: true });
// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const pass = encodeURIComponent("tempgmailpassword");
const mailTransport = nodemailer.createTransport(
    `smtps://${gmailEmail}:${pass}@smtp.gmail.com`);

// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'Erfara';

// [START sendWelcomeEmail]
/**
 * Sends a welcome email to new user.
 */
// [START onCreateTrigger]
exports.sendWelcomeEmail = functions.auth.user().onCreate(event => {
// [END onCreateTrigger]
  // [START eventAttributes]
  const user = event.data; // The Firebase user.

  const email = user.email; // The email of the user.
  const displayName = user.displayName; // The display name of the user.
  // [END eventAttributes]

  return sendWelcomeEmail(email, displayName);
});
// [END sendWelcomeEmail]

// [START sendByeEmail]
/**
 * Send an account deleted email confirmation to users who delete their accounts.
 */
// [START onDeleteTrigger]
exports.sendByeEmail = functions.auth.user().onDelete(event => {
// [END onDeleteTrigger]
  const user = event.data;

  const email = user.email;
  const displayName = user.displayName;

  return sendGoodbyEmail(email, displayName);
});
// [END sendByeEmail]

// Sends a welcome email to the given user.
function sendWelcomeEmail(email, displayName) {
  const mailOptions = {
    from: '"Matt" <matt@erfara.com>',
    to: email
  };

  // The user unsubscribed to the newsletter.
  mailOptions.subject = `Welcome to Erfara!`;
  mailOptions.text = `Hey ${displayName}! Welcome to ${APP_NAME}, have fun! If you have any questions, problems or feedback don't hesitate to email me!`;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('New welcome email sent to:', email);
  });
}

// Sends a goodbye email to the given user.
function sendGoodbyEmail(email, displayName) {
  const mailOptions = {
    from: '"Matt" <matt@erfara.com>',
    to: email
  };

  // The user unsubscribed to the newsletter.
  mailOptions.subject = `Bye!`;
  mailOptions.text = `Hey ${displayName}!, We confirm that we have deleted your ${APP_NAME} account.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('Account deletion confirmation email sent to:', email);
  });
}

exports.sendEmailOnMessage = functions.database.ref('/conversations/users/{userId}/{conversationId}/messages').onWrite(event => {
  const snapshot = event.data;
  console.log("Got new message!!! Event data: ", event);
  console.log("SNAPSHOT VAL: ", event.data.val());
  // Only send a notification when a message has been created.
  if (snapshot.previous.val()) {
    return;
  }

  // Notification details.
  const text = snapshot.val().text;
  const payload = {
    notification: {
      title: `${snapshot.val().name} posted ${text ? 'a message' : 'an image'}`,
      body: text ? (text.length <= 100 ? text : text.substring(0, 97) + '...') : '',
      icon: snapshot.val().photoUrl || '/images/profile_placeholder.png',
      click_action: `https://${functions.config().firebase.authDomain}`
    }
  };

  // Get the list of device tokens.
  // return admin.database().ref('fcmTokens').once('value').then(allTokens => {
  //   if (allTokens.val()) {
  //     // Listing all tokens.
  //     const tokens = Object.keys(allTokens.val());

  //     // Send notifications to all tokens.
  //     return admin.messaging().sendToDevice(tokens, payload).then(response => {
  //       // For each message check if there was an error.
  //       const tokensToRemove = [];
  //       response.results.forEach((result, index) => {
  //         const error = result.error;
  //         if (error) {
  //           console.error('Failure sending notification to', tokens[index], error);
  //           // Cleanup the tokens who are not registered anymore.
  //           if (error.code === 'messaging/invalid-registration-token' ||
  //               error.code === 'messaging/registration-token-not-registered') {
  //             tokensToRemove.push(allTokens.ref.child(tokens[index]).remove());
  //           }
  //         }
  //       });
  //       return Promise.all(tokensToRemove);
  //     });
  //   }
  // });
});
