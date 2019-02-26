import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuthUser } from '../session';
import io from 'socket.io-client';
import {
  Row,
  Col,
  Card,
  Button,
  Tabs,
  List,
  Comment,
  Form,
  Input,
  Layout,
  Avatar,
  Alert,
  message as antMessage,
  Tag,
} from 'antd';
import './chat.scss';
import Axios from 'axios';
import moment from 'moment';

const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea;
const { Header, Content, Footer } = Layout;
const url =
  process.env.NODE_ENV === 'production'
    ? 'https://karma-chat-jp.herokuapp.com/'
    : 'http://localhost:5000';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.socket = io(url);

    this.state = {
      messages: [],
      message: '',
      error: null,
      alertOpen: false,
      users: [],
      submitting: false,
    };
  }

  componentDidMount() {
    const { authUser } = this.props;

    Axios.get('/comments')
      .then(response => {
        this.setState({ messages: response.data.reverse() });
      })
      .catch(err => {
        this.setState({ error: err });
      });

    if (authUser) {
      this.socket.emit('join general', {
        display_name: authUser.displayName,
        photo_url: authUser.photoURL,
      });
    }

    this.socket.on('general chat entry', entry => {
      const messages = [];
      let slicedMessages = [];

      this.state.messages.forEach(entry => {
        messages.push({ ...entry });
      });

      messages.push(entry);
      if (messages.length > 6) {
        slicedMessages = messages.slice(messages.length - 6, messages.length);
      } else {
        slicedMessages = messages.slice(0, 5);
      }

      this.setState({ messages: slicedMessages });
    });

    this.socket.on('new user connected', users => {
      let onlineUsers = [];

      for (let user in users) {
        onlineUsers.push(users[user]);
      }
      this.setState({ users: onlineUsers });
    });

    this.socket.on('update online user list', users => {
      let onlineUsers = [];

      for (let user in users) {
        onlineUsers.push(users[user]);
      }
      this.setState({ users: onlineUsers });
    });

    this.socket.on('user disconnected', users => {
      let onlineUsers = [];

      for (let user in users) {
        onlineUsers.push(users[user]);
      }
      this.setState({ users: onlineUsers });
    });
  }

  componentDidUpdate(prevProps) {
    const { authUser } = this.props;

    if (authUser && authUser !== prevProps.authUser) {
      this.socket.emit('join general', {
        display_name: authUser.displayName,
        photo_url: authUser.photoURL,
      });
    }
  }

  componentWillUnmount() {
    this.socket.close();
  }

  handleChange = event => {
    if (this.state.message.length > 280) {
      return;
    }

    this.setState({ message: event.target.value });
  };

  submitMessage = event => {
    this.setState({ submitting: true });

    const { authUser } = this.props;

    if (!authUser) {
      this.setState({ alertOpen: true, submitting: false });
      return;
    }

    let newMessage = {
      message: this.state.message,
      created_date: moment().format(),
      total_karma: 0,
    };
    const messages = [];
    let slicedMessages = [];
    Axios.post('/comments', newMessage)
      .then(response => {
        this.state.messages.forEach(message => {
          messages.push(message);
        });

        newMessage = {
          id: response.data[0],
          ...newMessage,
          photo_url: authUser.photoURL,
          display_name: authUser.displayName,
        };

        messages.push(newMessage);
        if (messages.length > 6) {
          slicedMessages = messages.slice(messages.length - 6, messages.length);
        } else {
          slicedMessages = messages.slice(0, 5);
        }

        this.socket.emit('general chat', newMessage);
        this.setState({
          messages: slicedMessages,
          message: '',
          alertOpen: false,
          submitting: false,
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ submitting: false });
      });
  };

  addKarma = event => {
    if (!this.props.authUser) {
      antMessage.warning('You must be logged in!');
      return;
    }
    const id = event.currentTarget.getAttribute('data-id');
    const messages = [];
    let total_karma = 0;

    this.state.messages.forEach(message => {
      if (message.id === parseInt(id)) {
        total_karma = message.total_karma + 1;
        messages.push({ ...message, total_karma: total_karma });
      } else {
        messages.push({ ...message });
      }
    });

    Axios.put(`/comments/${id}/karma`)
      .then(response => {
        this.setState({ messages: messages });
      })
      .catch(err => console.log(err));
  };

  closeAlert = () => {
    this.setState({ alertOpen: false });
  };

  signOut = () => {
    this.props.signOut().then(data => {
      antMessage.info('Signed Out');
      this.socket.close();
    });
  };

  render() {
    const { messages, message, alertOpen, submitting, users } = this.state;
    const { authUser } = this.props;
    let UserAvatar = null;
    console.log(messages);

    if (authUser) {
      UserAvatar = (
        <Avatar src={authUser.photoURL} alt={authUser.displayName} />
      );
    } else {
      UserAvatar = <Avatar icon="user" />;
    }

    return (
      <Layout className="chat">
        <Header className="header">
          <Link to="/">
            <h2>Karma Chat</h2>
          </Link>
          <p>Welcome, {authUser ? authUser.displayName : 'Guest'}</p>
          {authUser ? (
            <div className="login">
              <Button onClick={this.signOut}>Sign Out</Button>
            </div>
          ) : (
            <Link className="login" to="/">
              <Button>Login</Button>
            </Link>
          )}
        </Header>
        <Content className="content">
          <Row type="flex" justify="center">
            <Col xs={24} md={20} xl={16} xxl={12}>
              <Card>
                <Tabs tabPosition="top" defaultActiveKey="2" size="large">
                  <TabPane className="tab-online" tab="Online Users" key="1">
                    {authUser
                      ? users.map((user, index) => (
                          <Row key={index}>
                            <Col xs={24} className="online-users">
                              <Avatar src={user.photo_url} />
                              <p>{user.display_name}</p>
                            </Col>
                          </Row>
                        ))
                      : 'Login to see online users'}
                  </TabPane>
                  <TabPane tab="General" key="2">
                    <Row className="tab-general">
                      <Col xs={24}>
                        <List
                          className="list"
                          dataSource={messages}
                          renderItem={message => (
                            <Comment
                              avatar={<Avatar src={message.photo_url} />}
                              author={message.display_name}
                              content={<p>{message.message}</p>}
                              datetime={moment(message.created_date).fromNow()}
                              actions={[
                                <Tag
                                  data-id={message.id}
                                  onClick={this.addKarma}
                                  color={
                                    message.total_karma < 100
                                      ? 'purple'
                                      : 'gold'
                                  }
                                >
                                  {message.total_karma} Karma
                                </Tag>,
                              ]}
                            />
                          )}
                        />
                      </Col>
                      <Col xs={24}>
                        <Comment
                          avatar={UserAvatar}
                          content={
                            <>
                              {alertOpen ? (
                                <Alert
                                  className="alert"
                                  message="You need to be logged in to comment"
                                  type="warning"
                                  onClose={this.closeAlert}
                                  showIcon
                                  closable
                                />
                              ) : null}
                              <Form.Item>
                                <TextArea
                                  onChange={this.handleChange}
                                  value={message}
                                  rows={3}
                                />
                              </Form.Item>
                              <Form.Item>
                                <Button
                                  htmlType="submit"
                                  loading={submitting}
                                  onClick={this.submitMessage}
                                >
                                  Add Comment
                                </Button>
                              </Form.Item>
                            </>
                          }
                        />
                      </Col>
                    </Row>
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </Content>
        <Footer />
      </Layout>
    );
  }
}

export default withAuthUser(Chat);
