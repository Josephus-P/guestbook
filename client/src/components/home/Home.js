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

  loginFacebook = event => {
    event.preventDefault();

    this.props
      .signInFacebook()
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
            <p style={{ padding: '2rem', fontSize: '24px' }}>
              Post positive messages, quotes and stories in real-time and get
              Karma points!
            </p>
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
                  <Button
                    className="button-google"
                    icon="google"
                    onClick={this.loginGoogle}
                    size="large"
                    block
                  >
                    Login with Google
                  </Button>
                </Col>
              </Row>
              <Row type="flex" justify="center">
                <Col xs={24} xl={16} xxl={12}>
                  <Button
                    className="button-fb"
                    icon="facebook"
                    onClick={this.loginFacebook}
                    size="large"
                    block
                  >
                    Login with Facebook
                  </Button>
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
                    <Button size="large" block>
                      Browse as Guest
                    </Button>
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
