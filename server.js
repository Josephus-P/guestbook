const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const server = express();
const port = process.env.PORT || 5000;
const admin = require('firebase-admin');
const db = require('./db/dbConfig');

server.use(express.json());
server.use(cors());

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  }),
});

// Middleware to verify the Firebase token
server.use('/login', async (req, res) => {
  const idToken = req.headers.authorization;

  try {
    await admin
      .auth()
      .verifyIdToken(idToken)
      .then(decodedToken => {
        req.body.uid = decodedToken.uid;
        return req.next();
      });
  } catch (e) {
    return res.status(401).send('You are not authorized!');
  }
});

server.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

// Login user
server.post('/login', (req, res) => {
  const { uid, displayName, photoURL } = req.body;
  const user = {
    uid: uid,
    display_name: displayName,
    photo_url: photoURL,
  };

  db('users')
    .where('uid', uid)
    .then(data => {
      // If the user doesn't exist then register the user
      if (data.length === 0) {
        db('users')
          .insert(user)
          .then(response => {
            res.status(201).send('Registered user');
          })
          .catch(err => {
            console.log(err);
            res.status(500).send('Error creating user');
          });
      }
      // Update the user's details in info has changed
      else if (
        data[0].display_name !== displayName ||
        data[0].photo_url !== photoURL
      ) {
        db('users')
          .where('uid', uid)
          .update(user)
          .then(data => res.status(200).json(data))
          .catch(err => {
            console.log(err);
            res.status(500).send('Error updating user');
          });
      } else {
        res.status(200).send('Logged in');
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error looking for user');
    });
});

server.get('/comments', (req, res) => {
  db('messages')
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error retrieving comments');
    });
});

server.post('/comments', (req, res) => {
  const { uid, message } = req.body;
  const comment = {
    user_uid: uid,
    message: message,
  };

  db('messages')
    .insert(comment)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error posting comment');
    });
});

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
