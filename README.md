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

## Step 1 - Deploying the project
This is not a course on Angular, but we need a project to deploy to Firebase. Follow these steps to do your first deploy.
* Create a new Angular project with the name "message-board".
  ```bash
    ng new
  ```
  * Use `SCSS` for styling.
  * After this command is finished, change line 20 of `angular.json` to setup `dist` as the output directory of the build process, instead of `dist/message-board`.
* Initialize firebase in your Angular project
  ```bash
    firebase init.
  ```
  * Initialize `Database`, `Functions` and `Hosting`.
  * Use the defaults for all choices, except:
    * Use `TypeScript` for functions.
    * Use `dist` as the public directory.
* Build the Angular project.
  ```bash
    ng build --prod
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

![Clean Angular on Firebase][step1-finished]

[step1-finished]: https://github.com/AE-nv/tafun-cloud-messageboard/raw/master/doc/images/step1-finished.png "Clean Angular on Firebase"

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.