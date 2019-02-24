import React, { Component } from 'react';
import { Row, Col, Card, Button, Tabs, List, Comment, Form, Input } from 'antd';
import './chat.scss';

const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea;
const messages = [{ comment: 'Hello World' }];

class Chat extends Component {
  state = {
    messages: messages,
  };

  render() {
    const { messages } = this.state;

    return (
      <div className="chat">
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
      </div>
    );
  }
}

export default Chat;
