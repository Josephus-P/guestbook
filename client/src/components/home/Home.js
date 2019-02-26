import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { withAuthUser } from '../session';
import { Row, Col, Card, Button } from 'antd';
import './home.scss';

class Home extends Component {
  state = {
    error: null,
  };

  loginGoogle = event => {
    event.preventDefault();

    this.props
      .signInGoogle()
      .then(socialAuthUser => {
        this.setState({ error: null });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  render() {
    const { authUser } = this.props;

    if (authUser) {
      return <Redirect to="/chat" />;
    }

    return (
      <div className="home">
        <Row type="flex" justify="center">
          <Col xs={24} xl={16} xxl={12}>
            <h1>Karma Chat</h1>
            <p>Post positive instant messages and get Karma points!</p>
          </Col>
        </Row>
        <Row type="flex" justify="center">
          <Col xs={20} sm={16} md={12}>
            <Card>
              <Row type="flex" justify="center">
                <Col xs={24} xl={16} xxl={12}>
                  <h2>Get Started</h2>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col xs={24} xl={16} xxl={12}>
                  <Button onClick={this.loginGoogle} block>
                    Login with Google
                  </Button>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col xs={24} xl={16} xxl={12}>
                  <Button block>Login with Facebook</Button>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col xs={24} xl={16} xxl={12}>
                  <p>OR</p>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col xs={24} xl={16} xxl={12}>
                  <Link to="/chat">
                    <Button block>Browse as Guest</Button>
                  </Link>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withAuthUser(Home);
