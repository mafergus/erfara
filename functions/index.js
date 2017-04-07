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
// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
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

/**
 * Sends a welcome email to new user.
 */
exports.sendWelcomeEmail = functions.auth.user().onCreate(event => {
  const user = event.data;
  const email = user.email;
  const displayName = user.displayName;

  return sendWelcomeEmail(email, displayName);
});

exports.sendWelcomeMessage = functions.auth.user().onCreate(event => {
  const user = event.data;
  const email = user.email;
  const displayName = user.displayName;

  sendWelcomeEmail(email, displayName);

  console.log("Sending welcome message to ", user.email);

  return admin.database().ref("users").orderByChild("email").equalTo("matt@erfara.com").once("value")
  .then(snap => {
    const mattUser = snap.val();
    console.log("Got matt@erfara.com ", "JoEQsdvoWGaWUfIcnSPuS0iwY0g1");
    const messageData = {
      message: "Welcome to Erfara! Enjoy!",
      date: new Date(),
      from: "JoEQsdvoWGaWUfIcnSPuS0iwY0g1",
    };
    const url = `/conversations/users/${user.uid}/JoEQsdvoWGaWUfIcnSPuS0iwY0g1/messages/`;
    const newMessageKey = admin.database().ref().child(url).push().key;
    var updates = {};
    updates[`/conversations/users/${user.uid}/JoEQsdvoWGaWUfIcnSPuS0iwY0g1/messages/` + newMessageKey] = messageData;
    updates[`/conversations/users/JoEQsdvoWGaWUfIcnSPuS0iwY0g1/${user.uid}/messages/` + newMessageKey] = messageData;

    return admin.database().ref().update(updates);
  });
});

/**
 * Send an account deleted email confirmation to users who delete their accounts.
 */
exports.sendByeEmail = functions.auth.user().onDelete(event => {
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
  mailOptions.text = `Hey ${displayName}! Welcome to ${APP_NAME}, have fun! If you have any questions, problems or feedback don't hesitate to email me!\n\n-Matt, Founder of Erfara`;
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
  mailOptions.text = `Hey ${displayName}! We confirm that we have deleted your ${APP_NAME} account.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    console.log('Account deletion confirmation email sent to:', email);
  });
}

exports.sendEmailOnMessage = functions.database.ref('/conversations/users/{userId}/{conversationId}/messages/{messageId}').onWrite(event => {
  const snapshot = event.data;
  const message = event.data.val();
  console.log("Got new message: ", message.message, " from ", message.from);
  if (snapshot.previous.val()) {
    return;
  }

  const userId = event.params.userId;
  if (userId === message.from) { return; }
  const fromUserPromise = admin.database().ref("/users/" + message.from).once("value");
  const toUserPromise = admin.database().ref("/users/" + userId).once("value");
  Promise.all([fromUserPromise, toUserPromise]).then(values => {
    const fromUser = values[0].val();
    const toUser = values[1].val();
    const mailOptions = {
      from: '"Matt" <matt@erfara.com>',
      to: `"${toUser.name}" <${toUser.email}>`,
    };
    mailOptions.subject = `New Message from ${fromUser.name} on Erfara`;
    mailOptions.text = `${fromUser.name} says: "${message.message}"\n\n\nReply here: www.erfara.com/messages/${message.from}`;
    return mailTransport.sendMail(mailOptions).then(() => {
      console.log("Email for new message " + " sent to: ", toUser.email + " from: ", fromUser.name);
    });
  });
});
