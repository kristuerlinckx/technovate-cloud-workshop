import * as functions from 'firebase-functions';

// Import the necessary libraries
const {Translate} = require('@google-cloud/translate');
const language = require('@google-cloud/language');

// Configure your project
// TODO: Replace this with your own project ID
const projectId = 'REPLACE THIS';

/**
 * Message Sentiment Analysis
 * Step 1: Translate messages from all languages to English using a Google managed service.
 * The web app creates messages in the Firestore on the path 'messages/{messageId}'.
 * Make a function that:
 *   - is triggered by this creation event,
 *   - translates the message using Google Cloud Translation library,
 *   - update the Firestore message with the translation in the field "en"
 *   - and returns false (Convention for Google Cloud Functions)
 * Message {
 *   descr: string;
 *   date: string;
 *   score?: number;
 * }
 */
exports.translateMessageToEnglish = functions.firestore.document('messages/{messageId}').onCreate((snapshot) => {
  const message = snapshot.data();

  // TODO: Implement this

  return false;
});

/**
 * Message Sentiment Analysis
 * Step 2: Check the sentiment of an English message using a Google managed service.
 * In step 1, our function updated the message with an English translation on field "en".
 * Make a function that:
 *   - is triggered by this update event,
 *   - retrieves a sentiment score between -1 and 1 from a Google Cloud Language service,
 *   - update the Firestore message with the sentiment in the field "score"
 *   - and returns false (Convention for Google Cloud Functions)
 * Message {
 *   descr: string;
 *   date: string;
 *   score?: number;
 * }
 */
exports.checkMessageSentiment = functions.firestore.document('messages/{messageId}').onUpdate((snapshot) => {
  const message = snapshot.after.data();

  // TODO: Implement this

  return false;
});
