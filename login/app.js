/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * FirebaseUI initialization to be used in a Single Page application context.
 */

/**
 * @return {!Object} The FirebaseUI config.
 */
var response_type, state, redirect_uri, client_id;

function getUiConfig() {
  return {
    'callbacks': {
      // Called when the user has been successfully signed in.
      'signInSuccessWithAuthResult': function (authResult, redirectUrl) {
        if (authResult.user) {
          handleSignedInUser(authResult.user);
        }
        // Do not redirect.
        return false;
      }
    },
    // Opens IDP Providers sign-in flow in a popup.
    'signInFlow': 'popup',
    'signInOptions': [
      // TODO(developer): Remove the providers you don't need for your app.
      {
        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,

        // Required to enable this provider in One-Tap Sign-up.
        authMethod: 'https://accounts.google.com',
        // Required to enable ID token credentials for this provider.
        clientId: CLIENT_ID
      },
      // firebase.auth.EmailAuthProvider.PROVIDER_ID

    ],
    // Terms of service url.
    'tosUrl': 'https://www.google.com',
    'credentialHelper': firebaseui.auth.CredentialHelper.GOOGLE_YOLO
  };
}

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

// Disable auto-sign in.
// ui.disableAutoSignIn();

function redirectToGoogle() {
  if (state) {
    if (firebase.auth().currentUser) {

      
        window.location = "https://oauth-redirect.googleusercontent.com/r/login-477f3" + "#access_token=" + firebase.auth().currentUser.uid + "&token_type=bearer&state=" + state;
    

    } else {
      alert("You need to be signed in!");
    }
  } else {
    window.location = "https://assistant.google.com/services/a/uid/000000d30c7816af";
  }
}


/**
 * Displays the UI for a signed in user.
 * @param {!firebase.User} user
 */
var handleSignedInUser = function (user) {
  document.getElementById('user-signed-in').style.display = 'block';
  document.getElementById('sign-out').style.display = 'block';
  document.getElementById('user-signed-out').style.display = 'none';
  // document.getElementById('name').textContent = user.displayName;
  // document.getElementById('email').textContent = user.email;
  // document.getElementById('phone').textContent = user.phoneNumber;
  if (user.photoURL) {
    var photoURL = user.photoURL;
    // Append size to the photo URL for Google hosted images to avoid requesting
    // the image with its original resolution (using more bandwidth than needed)
    // when it is going to be presented in smaller size.
    if ((photoURL.indexOf('googleusercontent.com') != -1) ||
      (photoURL.indexOf('ggpht.com') != -1)) {
      photoURL = photoURL + '?sz=' +
        document.getElementById('photo').clientHeight;
    }
    document.getElementById('photo').src = photoURL;
    document.getElementById('photo').style.display = 'block';
  } else {
    document.getElementById('photo').style.display = 'none';
  }
};

function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    window.alert("Error : " + errorMessage);

    // ...
  });

}

function logout(){
  firebase.auth().signOut();
}


/**
 * Displays the UI for a signed out user.
 */
var handleSignedOutUser = function () {
  document.getElementById('user-signed-in').style.display = 'none';
  document.getElementById('sign-out').style.display = 'none';
  document.getElementById('user-signed-out').style.display = 'block';
  ui.start('#firebaseui-container', getUiConfig());
};

// Listen to change in auth state so it displays the correct UI for when
// the user is signed in or not.
firebase.auth().onAuthStateChanged(function (user) {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('loaded').style.display = 'block';
  user ? handleSignedInUser(user) : handleSignedOutUser();
});

/**
 * Deletes the user's account.
 */
var deleteAccount = function () {
  firebase.auth().currentUser.delete().catch(function (error) {
    if (error.code == 'auth/requires-recent-login') {
      // The user's credential is too old. She needs to sign in again.
      firebase.auth().signOut().then(function () {
        // The timeout allows the message to be displayed after the UI has
        // changed to the signed out state.
        setTimeout(function () {
          alert('Please sign in again to delete your account.');
        }, 1);
      });
    }
  });
};




/**
 * Initializes the app.
 */
var initApp = function () {
  let params = (new URL(document.location)).searchParams;
  client_id = params.get("client_id");
  redirect_uri = params.get("redirect_uri");
  state = params.get("state");
  response_type = params.get("response_type");

  document.getElementById('sign-out').addEventListener('click', function () {
    firebase.auth().signOut();
  });
  // document.getElementById('delete-account').addEventListener(
  //     'click', function() {
  //       deleteAccount();
  //     });
  document.getElementById("redirectToGoogle").addEventListener(
    'click',
    function () {
      redirectToGoogle();
    }
  );



};

window.addEventListener('load', initApp);

var batches = {
  "scse": {
    1: {
      "1": "tt1",
      "2": "tt1",
      "3": "tt1",
      "4": "tt1"
    },
    2: {
      "1": "tt1",
      "2": "tt1"
    },
    3: {
      "1": "tt1"
    },
    4: {
      "1A": "tt1"
    }
  },
  "sca": {
    1: {
      "1": "tt1"
    }
  }
}


