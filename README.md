# BillShare
This is personal expense sharing app between friends which runs only on html and js. It can be run in your local machine or hosted in public sites, such as github.io.  This doesn't require any server setup.
## Setup
```
npm install
```

> **Note:** Create constants.js file similar to constant.js.orig. (Refer Creating constants below)
Replace firebaseConfig value from your firebase web project . 
Replace adminUid with your admin user's id in firebase auth system. 

## Firebase setup
This app uses Firebase as a storage and authentication system.
To add Firebase to your app, you'll need a Firebase project and a short snippet of initialization code that has a few details about your project.
- Create a Firebase project in the [Firebase console][1].
    - If you don't have an existing Firebase project, click Add project, then enter either an existing Google Cloud Platform project name or a new project name.
    - If you have an existing Firebase project that you'd like to use, select that project from the console.
- From the project overview page in the Firebase console, click Add Firebase to your web app. If your project already has an app, select Add App from the project overview page.

## Firebase database setup
Open the [Firebase console][1].
1. In the Database section, click the Get Started button for Cloud Firestore.

2. Select a Locked mode for your Cloud Firestore Security Rules:

3. Click Enable.


## Firebase Authentication setup
- In the [Firebase console][1], open the Authentication section and enable email and password authentication.
- Start the app ```(npm run serve)```
- Go to ```protocol://host:port/billshare/#/signup``` (ex: http://localhost:8080/billshare/#/signup). Sign up an account.



## Creating constants.js
1. Open [Firebase console][1]
2. Copy firebase config keys from  overview page and replace firebaseConfig value in your constants file.
3. Open the Authentication section in firebase , choose the user who you want to be admin,copy his **User UID** and add as adminUid in constants.js

## Securing Read & Write privileges in firebase
>**Note**: Following this step ensures  only Admin has write privilege & only authenticated user views data.

In the Firebase console, Go to Database, Select Rules and add the below line where ADMIN_UID is **User UID** value from above step
~~~
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
    	allow read: if request.auth.uid != null;
      allow write: if request.auth.uid == "<ADMIN_UID>";
    }
  }
}
~~~
### Disclaimer
- **This is a fully client side app and has no server backend. Configuration keys will be exposed in the network. Anyone with configuration key can modify your data if you dont secure the r/w privileges. Only way to avoid unauthorized access is to secure read & write privileges in firebase by following above steps. Take your own precautions when publicly hosting this app.**

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Using  the app
- ```npm run build``` This will create a production build in docs folder. You can run it from any http server. If you want you can host this in any public html,js hosting services

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```
[1]: https://console.firebase.google.com "Firebase Console"