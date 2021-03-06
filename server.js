require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const admin = require('./firebase-admin/admin');
const db = require('./db/db-helpers');
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 5000;

const onlineUsers = {};

app.use(express.json());
app.use(cors());

// Middleware to verify the Firebase token
async function verifyToken(req, res, next) {
  const idToken = req.headers.authorization;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.body.uid = decodedToken.uid;

    return next();
  } catch (e) {
    return res.status(401).send('You are not authorized!');
  }
}

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

// Login user
app.post('/login', verifyToken, async (req, res) => {
  const { uid, displayName, photoURL } = req.body;
  const user = {
    uid: uid,
    display_name: displayName,
    photo_url: photoURL,
  };

  try {
    const userResult = await db.getUserByUID(uid);

    // If the user doesn't exist then register the user
    if (userResult.length === 0) {
      const newUser = await db.insertNewUser(user);
      res.status(201).json(newUser);
    }
    // Update the user's details if info has changed
    else if (
      userResult[0].display_name !== displayName ||
      userResult[0].photo_url !== photoURL
    ) {
      const updatedUser = await db.updateUser(uid, user);

      res.status(200).json(updatedUser);
    } else {
      res.status(200).send('Logged in');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Get all the comments
app.get('/comments', async (req, res) => {
  try {
    const data = await db.getAllComments();

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Insert a new comment into the DB
app.post('/comments', verifyToken, async (req, res) => {
  const { uid, message, created_date, total_karma } = req.body;
  const comment = {
    user_uid: uid,
    message: message,
    created_date: created_date,
    total_karma: total_karma,
  };

  try {
    const data = await db.insertNewComment(comment);
    res.status(201).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error posting comment' });
  }
});

// Update a comment's karma count
app.put('/comments/:id/karma', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const data = await db.incrementCommentKarma(id);

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating comment' });
  }
});

/***************************** Socket IO events *****************************/

io.on('connection', socket => {
  console.log('a user connected');

  socket.on('join general', user => {
    socket.join('general', () => {
      socket.user_uid = user.uid;

      if (onlineUsers[user.uid]) {
        onlineUsers[user.uid].instances += 1;
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
