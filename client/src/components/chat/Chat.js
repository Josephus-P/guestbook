import React, { Component } from 'react';
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
} from 'antd';
import './chat.scss';

const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea;
const messages = [{ comment: 'Hello World' }];
const { Header, Content } = Layout;

class Chat extends Component {
  state = {
    messages: messages,
  };

  render() {
    const { messages } = this.state;
    const { signOut } = this.props;

    return (
      <Layout className="chat">
        <Header className="header">
          <h2>Karma Chat</h2>
          <p>Welcome, Guest</p>
          <Button onClick={signOut}>Sign Out</Button>
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
                            <Comment content={<p>{message.comment}</p>} />
                          )}
                        />
                      </Col>
                      <Col xs={24}>
                        <Form.Item>
                          <TextArea rows={2} />
                        </Form.Item>
                        <Form.Item>
                          <Button htmlType="submit">Add Comment</Button>
                        </Form.Item>
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

export default Chat;
