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
const cors = require('cors')
const express = require('express');
admin.initializeApp(functions.config().firebase);
const nodemailer = require('nodemailer');
require('@google-cloud/debug-agent').start({ allowExpressions: true });

const app = express();
app.use(cors({ origin: true }));
app.post('/deleteUser/', (req, res) => { doDeleteUser(req, res) });
// app.put('/:id', (req, res) => {//...});
// app.delete('/:id', (req, res) => {//...});

exports.api = functions.https.onRequest(app);

// Configure the email transport using the default SMTP transport and a GMail account.
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const testPass = encodeURIComponent("m8n15f86!!??");
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${testPass}@smtp.gmail.com`);
const urlBase = 'https://erfara.com';

// Your company name to include in the emails
// TODO: Change this to your app or company name to customize the email sent.
const APP_NAME = 'Erfara';
const MATT_UID = "sm8aILIhkJh46OPnzM3ilLGU3mA2";

function doDeleteUser(req, res) {
  res.send({ status: "placeholder response" });
}

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  admin.database().ref('/messages').push({original: original}).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref);
  });
});

/**
 * Sends a welcome email to new user.
 */
// exports.sendWelcomeEmail = functions.auth.user().onCreate(event => {
//   console.log("Event: ", event);

//   functions.auth.user().equalTo

//   const user = event.data;
//   const email = user.email;
//   const displayName = user.displayName;

//   return sendWelcomeEmail(email, displayName);
// });

exports.sendWelcomeMessage = functions.auth.user().onCreate(event => {
  const user = event.data;
  console.log("Sending welcome message to user: ", user);

  const messageData = {
    message: "Welcome to Erfara! Enjoy!",
    date: new Date(),
    from: MATT_UID,
  };
  const url = `/conversations/users/${user.uid}/${MATT_UID}/messages/`;
  const newMessageKey = admin.database().ref().child(url).push().key;
  var updates = {};
  updates[`/conversations/users/${user.uid}/${MATT_UID}/messages/` + newMessageKey] = messageData;
  updates[`/conversations/users/${MATT_UID}/${user.uid}/messages/` + newMessageKey] = messageData;

  return admin.database().ref().update(updates);

  // return admin.database().ref("users").orderByChild("email").equalTo("matt@erfara.com").once("value")
  // .then(snap => {
  //   const mattUser = snap.val();
    
  // });
});

exports.sendEventJoinMessage = functions.database.ref('/events/{eventId}/attendees/{userId}').onWrite(event => {
  const user = event.data.val();
  var eventObj = {};

  if (event.data.previous.val()) { 
    return;
  }

  return admin.database().ref("events/" + event.params.eventId).once("value")
  .then(snap => {
    eventObj = snap.val();
    const eventOwner = eventObj.userId;
    const ownerPromise = admin.database().ref("users/" + eventOwner).once("value");
    const joinerPromise = admin.database().ref("users/" + event.params.userId).once("value");
    return Promise.all([ownerPromise, joinerPromise]);
  })
  .then(values => {
    const owner = values[0].val();
    const joiner = values[1].val();

    if (joiner.uid === owner.uid) { return; }

    const mailOptions = {
      from: '"Matt" <matt@erfara.com>',
      to: owner.email
    };
    mailOptions.subject = `New Member Joined your Event ${eventObj.title}!`;
    mailOptions.text = `Hey ${owner.name}! ${joiner.name} just RVSPd for ${eventObj.title}! Reach out to them and say hi.`;
    return mailTransport.sendMail(mailOptions).then(() => {
      console.log('Email for event joiner sent to:', owner.email);
    });
  });
});

/**
 * It goes without saying, but this should be optimized
 */
exports.sendEventCreatedEmail = functions.database.ref('/events/{eventId}').onWrite(createdEvent => {
  const event = createdEvent.data.val();
  const creatorId = event.userId;
  const allUsersPromise = admin.database().ref("users").once("value");

  if (createdEvent.data.previous.val()) { 
    return;
  }
  
  return allUsersPromise.then(snap => {
    if (snap) {
      snap.forEach(user => {
        sendEventEmail(user.val(), event, createdEvent.params.eventId);
      });
    }
  });
});

function sendEventEmail(recipient, event, eventId) {
  const mailOptions = {
    from: '"Matt" <matt@erfara.com>',
    to: recipient.email
  };
  const firstName = recipient.name.split(" ")[0] || recipient.name;

  console.log("Sending event created notification email to ", recipient.email, ` for ${event.title}`);

  mailOptions.subject = `New Event - ${event.title} - on Erfara!`;
  mailOptions.text = `Hey ${firstName}! There's a new event near you, check it out here: ${urlBase}/event/${eventId}`;
  return mailTransport.sendMail(mailOptions);
}

/**
 * Send an account deleted email confirmation to users who delete their accounts.
 */
exports.sendByeEmail = functions.auth.user().onDelete(event => {
  const user = event.data;

  const email = user.email;
  const displayName = user.displayName;

  return sendGoodbyEmail(email, displayName);
});

// // Sends a welcome email to the given user.
// function sendWelcomeEmail(email, displayName) {
//   const mailOptions = {
//     from: '"Matt" <matt@erfara.com>',
//     to: email
//   };

//   console.log("Should send welcome email to ", email);

//   // The user unsubscribed to the newsletter.
//   mailOptions.subject = "Welcome to Erfara!";
//   mailOptions.text = `Hey ${displayName}! Welcome to ${APP_NAME}, have fun! If you have any questions, problems or feedback don't hesitate to email me!\n\n-Matt, Founder of Erfara`;
//   return mailTransport.sendMail(mailOptions).then(() => {
//     console.log('New welcome email sent to:', email);
//   });
// }

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
    return new Error("Oops!");
  }

  const userId = event.params.userId;
  if (userId === message.from) {
    return new Error("Oops!");
  }
  const fromUserPromise = admin.database().ref("/users/" + message.from).once("value");
  const toUserPromise = admin.database().ref("/users/" + userId).once("value");

  return Promise.all([fromUserPromise, toUserPromise]).then(values => {
    const fromUser = values[0].val();
    const toUser = values[1].val();
    const mailOptions = {
      from: '"Matt" <matt@erfara.com>',
      to: `"${toUser.name}" <${toUser.email}>`,
    };
    mailOptions.subject = `New Message from ${fromUser.name} on Erfara`;
    mailOptions.text = `${fromUser.name} says: "${message.message}"\n\n\nReply here: ${urlBase}/messages/${message.from}`;
    return mailTransport.sendMail(mailOptions).then(() => {
      console.log("Email for new message " + " sent to: ", toUser.email + " from: ", fromUser.name);
    });
  });
});
