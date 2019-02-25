import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withAuthUser } from '../session';
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
} from 'antd';
import './chat.scss';
import Axios from 'axios';

const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea;
const { Header, Content } = Layout;

class Chat extends Component {
  state = {
    messages: [],
    message: '',
    error: null,
    alertOpen: false,
  };

  componentDidMount() {
    Axios.get('/comments')
      .then(response => {
        console.log(response.data);
        this.setState({ messages: response.data });
      })
      .catch(err => {
        this.setState({ error: err });
      });
  }

  handleChange = event => {
    if (this.state.message.length > 280) {
      return;
    }

    this.setState({ message: event.target.value });
  };

  submitMessage = event => {
    if (!this.props.authUser) {
      this.setState({ alertOpen: true });
      return;
    }

    const newMessage = { message: this.state.message };
    const messages = [];

    Axios.post('/comments', newMessage)
      .then(response => {
        this.state.messages.forEach(message => {
          messages.push(message);
        });
        messages.push({
          ...newMessage,
          photo_url: this.props.authUser.photoURL,
          display_name: this.props.authUser.displayName,
        });

        this.setState({ messages: messages, message: '', alertOpen: false });
      })
      .catch(err => console.log(err));
  };

  closeAlert = () => {
    this.setState({ alertOpen: false });
  };

  signOut = () => {
    this.props.signOut().then(data => {
      antMessage.info('Signed Out');
    });
  };

  render() {
    const { messages, message, alertOpen } = this.state;
    const { authUser } = this.props;
    let UserAvatar = null;

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
                  <TabPane tab="Online Users" key="1">
                    Online
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
      </Layout>
    );
  }
}

export default withAuthUser(Chat);
