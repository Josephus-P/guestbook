import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
//import Firebase, { FirebaseContext } from './components/firebase';
import App from './App';
import axios from 'axios';
import './index.scss';

axios.defaults.baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://karma-chat-jp.herokuapp.com/'
    : 'http://localhost:5000';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
