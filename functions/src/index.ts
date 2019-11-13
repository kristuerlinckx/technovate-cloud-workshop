import * as functions from 'firebase-functions';

// Import the necessary libraries
const {Translate} = require('@google-cloud/translate');
const language = require('@google-cloud/language');

// Configure your project
const projectId = 'tafun-maessageboard-solution';

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
  console.log(message);
  if (message !== undefined && message.en === undefined) {
    console.log(`Document translation:`);
    console.log(`Original   : ${message.descr}`);
    const translate = new Translate({
      projectId: projectId,
    });
    return translate.translate(message.descr, {to: 'en'})
      .then((results: Array<string>) => {
        const translation = results[0];
        console.log(results);
        console.log(`Translation: ${translation}`);
        message.en = translation;
        console.log(message);
        snapshot.ref.set(message)
          .catch((err: string) => {
            console.error('ERROR:', err);
          }
        );
      })
      .catch((err: string) => {
        console.error('ERROR:', err);
      });
  }
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

  if (message !== undefined && message.en !== undefined && message.score === undefined) {
    const client = new language.LanguageServiceClient();
    const document = {
      content: message.en,
      type: 'PLAIN_TEXT',
    };

    return client
      .analyzeSentiment({document: document})
      .then((results: Array<any>) => {
        message.score = results[0].documentSentiment.score;
        console.log(`Document sentiment:`);
        console.log(`  Text   : ${message.descr}`);
        console.log(`  English: ${message.en}`);
        console.log(`  Score  : ${message.score}`);

        snapshot.after.ref.set(message)  
          .catch((err: string) => {
            console.error('ERROR:', err);
          }
        );
      })
      .catch((err: string) => {
        console.error('ERROR:', err);
      });
  }
  return false;
});
