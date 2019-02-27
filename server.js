const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const admin = require('firebase-admin');
const db = require('./db/dbConfig');
const server = require('http').Server(app);
const io = require('socket.io')(server);

const onlineUsers = {};

app.use(express.json());
app.use(cors());

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
async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization;

  try {
    await admin
      .auth()
      .verifyIdToken(idToken)
      .then(decodedToken => {
        req.body.uid = decodedToken.uid;
        console.log('verified');
        return next();
      });
  } catch (e) {
    return res.status(401).send('You are not authorized!');
  }
}

app.use('/login', verifyToken);

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

// Login user
app.post('/login', (req, res) => {
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

app.get('/comments', (req, res) => {
  db('messages as m')
    .join('users as u', 'm.user_uid', 'u.uid')
    .select(
      'm.id',
      'm.created_date',
      'm.message',
      'u.display_name',
      'u.photo_url',
      'm.total_karma'
    )
    .orderBy('m.id', 'desc')
    .limit(6)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error retrieving comments');
    });
});

app.post('/comments', verifyToken, (req, res) => {
  const { uid, message, created_date, total_karma } = req.body;
  const comment = {
    user_uid: uid,
    message: message,
    created_date: created_date,
    total_karma: total_karma,
  };

  db('messages')
    .insert(comment, ['id'])
    .then(data => {
      res.status(201).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send('Error posting comment');
    });
});

app.put('/comments/:id/karma', verifyToken, (req, res) => {
  const { id } = req.params;

  db('messages')
    .where('id', id)
    .increment('total_karma', 1)
    .then(data => res.status(200).send('updated karma'))
    .catch(err => {
      console.log(err);
      res.status(500).send('Error updating comment');
    });
});
/***************************** Socket IO events *****************************/

io.on('connection', socket => {
  console.log('a user onnected');

  socket.on('join general', user => {
    socket.join('general', () => {
      socket.user_uid = user.uid;

      if (onlineUsers[user.uid]) {
        onlineUsers[user.uid].instances += 1;
        console.log(onlineUsers[user.uid]);
      } else {
        onlineUsers[user.uid] = {
          photo_url: user.photo_url,
          display_name: user.display_name,
          instances: 1,
        };
      }

      socket.to('general').emit('new user connected', onlineUsers);

      io.to(`${socket.id}`).emit('update online user list', onlineUsers);
    });
  });

  socket.on('general chat', entry => {
    socket.to('general').emit('general chat entry', entry);
  });

  socket.on('disconnect', () => {
    if (
      onlineUsers[socket.user_uid] &&
      onlineUsers[socket.user_uid].instances > 1
    ) {
      onlineUsers[socket.user_uid].instances -= 1;
      console.log(onlineUsers[socket.user_uid]);
    } else {
      delete onlineUsers[socket.user_uid];
    }

    socket.to('general').emit('user disconnected', onlineUsers);

    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
