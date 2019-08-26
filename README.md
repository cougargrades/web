# @cougargrades/web
React app that powers cougargrades.io

## About
See https://cougargrades.io/about

## Dependencies
- Node.js

- Documentation is written presuming the webserver will run in a Linux-like environment. For Windows, make inferences about certain steps (such as the use of `curl`).

## Running locally

##### Step 1: Get files

- Clone the repository:

    `git clone https://github.com/cougargrades/web.git`

##### Step 2: Configuring Firebase access
- Before the project can function, you'll need to provide the Firebase API key. Getting the production API key is simple:
    ```bash
    # console output will be javascript code
    curl https://cougargrades.io/__/firebase/init.js
    ```

    The JS file that gets printed will look something like this (with some parts omitted):
    ```javascript
    // ...
    firebase.initializeApp({
      "apiKey": "abcdefghijklmnopqrstuvwxyz123456789",
      // ..
    });
    ```

- Now, you'll need to update the `.env.development` file to include the API key you retrieved:
    ```env
    REACT_APP_FIREBASE_API_KEY=abcdefghijklmnopqrstuvwxyz123456789
    ```
- This is the API key that is given to browsers when they visit https://cougargrades.io and it is the same one the local webserver will use for development purposes.
- If you're interested in using your own Firebase project instance instead, make changes to the other lines:

    ```env
    REACT_APP_FIREBASE_AUTH_DOMAIN=myproject-erf88.firebaseapp.com
    REACT_APP_FIREBASE_PROJECT_ID=myproject-erf88
    ```

##### Step 3: Running
- Install dependencies: 
    
    `npm install`
- Starts the development server (via [react-scripts](https://github.com/facebook/create-react-app)):
    
    `npm start`

- The development server will watch the project files for changes, automatically recompile the source code, and refresh the browser. Compile-time errors are printed to the console. [React DevTools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html) is also enabled in this mode.
