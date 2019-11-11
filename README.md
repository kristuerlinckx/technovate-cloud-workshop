# MessageBoard

As a part of the TA Fundamentals Cloud training, we will go through an exercise in which we deploy a message board on Firebase. Functionality of this board is then further extended using Cloud Functions, Google Cloud Pub/Sub, ...

**Attendees of this course will start their own project and copy parts of this repo in theirs or use it in case of trouble to get the solution.**

## Step 0 - Setting up your environment
In order to start, make sure the following is setup:
* You have a working Google Cloud subscription (use the $300 free allowance to get started without any costs).
  [Click here](https://console.cloud.google.com) to get to the Google Cloud Platform (GCP).
* You have a project with a billing account linked to it. In a billing account you have to provide **credit card information**. If you used the €300 free allowance, you won't be billed. **IMPORTANT: DON'T FORGET TO REMOVE THE GCP PROJECT AFTER THIS SESSION!** If you don't, costs will build up and you will get a bill eventually.
* Make sure [npm](https://www.npmjs.com/get-npm) is setup. The exact way you install npm, depends on the OS you're using.
* Download the Angular CLI to create your own project that we will deploy to Firebase.
  ```bash
  npm install -g @angular/cli
  ```
* Download Firebase tools to interact with Firebase, the main product we will be working with today.
  ```bash
  npm install -g firebase-tools
  ```

## Step 1a - Deploying the project
This is not a course on Angular, but we need a project to deploy to Firebase. Follow these steps to do your first deploy.
* Create a new Angular project with the name "message-board".
  ```bash
  ng new
  ```
  * Use `SCSS` for styling.
  * After this command is finished, change line 20 of `angular.json` to setup `dist` as the output directory of the build process, instead of `dist/message-board`.
* Initialize firebase in your Angular project
  ```bash
  firebase init
  ```
  * Initialize `Database`, `Functions` and `Hosting`.
  * Use the defaults for all choices, except:
    * Use `TypeScript` for functions.
    * Use `dist` as the public directory.
* Build the Angular project.
  ```bash
  ng build
  ```
* Uncomment the hello world function in `functions/src/index.ts` to prevent firebase deploy from failing on TSLint.
  ```js
    export const helloWorld = functions.https.onRequest((request, response) => {
        response.send("Hello from Firebase!");
    });
  ```
* Deploy your application to Firebase!
  ```bash
  firebase deploy
  ```

When you go to your application url (See the deploy output), you should see the following UI:

![Clean Angular on Firebase][step1a-finished]

## Step 1b - Add the Message board to the application
Now we're going to add the Message board front-end to our application. Since this is not a course on Angular, we don't go into detail and you can just copy the right files from this project to your project.

* Copy the following files/directories from this git repo to your own project:
  * `package.json`
  * `src/`
* Download the dependencies using `npm`.
  ```bash
  npm install
  ```

Now all files are in place, we still need to configure one thing: the connection between the Front End we're creating and the Firebase Back End. Take a look at `src/environments/environment.ts`. You see we need to configure some properties so your angular application knows how it can connect to Firebase. 
* Find out where you can find these variables on Firebase and configure them in `src/environments/enviornment.ts`.
* Build and deploy your application to Firebase.
  ```bash
  ng build
  firebase deploy
  ```
If all went well, when you now go to your application url, you should see the Message board.
![Message Board on Firebase][step1b-finished]

Try adding messages on the board. You'll see them appear, but the sentiment will remain blue, since we haven't configured anything yet. Let's get down to business and get to the real work in the next steps.

## Step 2 - Sentiment analysis
Now, let's add sentiment analysis to our application.
* Checkout the `v2-message-sentiment-rating` branch from this repo.
* Copy the functions directory to your own project. This will be the starter template for this exercise.

In this exercise, you'll add 2 cloud functions:
* `translateMessageToEnglish`:
  Translate messages from all languages to English using a Google managed service.
  The web app creates messages in the Firestore on the path 'messages/{messageId}'.
  Make a function that:
  * is triggered by this creation event, 
  * translates the message using Google Cloud Translation library,
  * update the Firestore message with the translation in the field "en"
  * and returns false (Convention for Google Cloud Functions) 
* `checkMessageSentiment`:
  Check the sentiment of an English message using a Google managed service.
  The first function updated the message with an English translation on field "en".
  Make a function that:
  * is triggered by this update event, 
  * retrieves a sentiment score between -1 and 1 from a Google Cloud Language service,  
  * update the Firestore message with the sentiment in the field "score"
  * and returns false (Convention for Google Cloud Functions)


Messages are stored in the following way in FireStore:
```js
export interface Message {
  descr: string;
  date: string;
  en?: string; // English translation
  score?: number; // Sentiment score
}
```
When you write to the FireStore, do it following this interface in order for everything to work properly.

A couple of hints:
* You'll need to enable the APIs for both the translation service and the language service in the Google Cloud console.
* In the template, we already added npm packages for both APIs that serve as a proxy to the google services. Use those instead of calling the APIs directly.
* Something JavaScript specify. Promises in JavaScript need to handle unlucky patchs (exceptions). TSLint will fail if you don't handle them. Just catch the error and log it to the console. **Don't do this in a real production environment! Always properly handle your exceptions.** Example:
  ```js
  snapshot.ref.set(message)
    .catch((err: string) => {
      console.error('ERROR:', err);
    }
  );
  ```
* The [Firebase Console](https://console.firebase.google.com) provides a UI to see the logs of your cloud functions. Your cloud function obsiously needs to be deployed on Firebase.
* You can also only deploy functions using the following command. This will be much faster than deploying the entire project.
  ```bash
  firebase deploy --only function 
  ```

If all went well, when you now go to your application url and enter text, you should see emojis on the Message board.
![Sentiment analysis][step2-finished]

If you really are stuck and want to try out the extra steps, checkout the solution brench `v2-message-sentiment-rating-solution` and check what's going wrong.

## Angular Documentation
### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.



[step1a-finished]: https://github.com/AE-nv/tafun-cloud-messageboard/raw/master/doc/images/step1a-finished.png "Clean Angular on Firebase"
[step1b-finished]: https://github.com/AE-nv/tafun-cloud-messageboard/raw/master/doc/images/step1b-finished.png "Message Board on Firebase"
[step2-finished]: https://github.com/AE-nv/tafun-cloud-messageboard/raw/master/doc/images/step2-finished.png "Sentiment analysis"
