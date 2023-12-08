import React, { Component } from 'react';
import {
  Button, Card, CardBody, Col, Container, Form, Input, InputGroup
  , InputGroupAddon, InputGroupText, Label, Row, Spinner
} from 'reactstrap';
import { faIndustry, faSignInAlt as loginIcon } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from 'react-router-dom';
// import { getAuthEmail } from '../../services/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faEnvelope, faGlobe, faLink, faMapMarkerAlt, faPhone, faThumbtack, faUser } from '@fortawesome/free-solid-svg-icons';
import './index.css'
import axios from 'axios';

class ForgotPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      notification: '',
      registration_view: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeState = this.changeState.bind(this);
  }


  handleChange(e) {
    this.setState(
      {
        [e.target.id]: e.target.value
      }
    );
  };
  changeState(obj) {
    this.setState(obj)
  }

  handleSubmit(e) {
    e.preventDefault();
    let change = this.changeState;
    let json = JSON.stringify({ email: this.state.email });
    let formData = new FormData();
    formData.append('request', 'reset_password_customer');
    formData.append('data', encodeURIComponent(json));
    axios.post(`https://mobile.authenticpass.com/api/account`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
      .then(res => {
        // const response = res.data;
        change({ registration_view: false })
      });
  };

  componentDidMount() {
    // if (getAuthEmail()) {
    //   this.props.history.push('/dashboard');
    // }
  }

  render() {
    let register = '';
    const { email, registration_view, notification, handle } = this.state;

    if (registration_view) {
      register = <>
        <Container style={{ marginTop: "10em", padding: "1em" }}>
          <Row className="justify-content-center">
            <Col xs="12" sm="12" md="10" lg="8" xl="7">
              <h1>Fogot Password</h1>
              <Form className="register_form" onSubmit={this.handleSubmit} method="post" id="customer">
                <InputGroup className="mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText><FontAwesomeIcon icon={faEnvelope} /> </InputGroupText>
                  </InputGroupAddon>
                  <Input disabled={handle ? true : false} type="email" id="email" value={email} onChange={this.handleChange} placeholder="Your Email Address" autoComplete="email" required />
                </InputGroup>
                <span className="error">{notification}</span> <br /><br />
                <Button disabled={handle ? true : false} type="submit" color="success" block>Reset</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </>
    } else {
      register = <>
        <div className="registerSuccessCover">
          <div className="registerSuccess">
            <h1>Hello,</h1>
            <p style={{ fontSize: "1.1em" }}>An <b>email</b> containg your new password has been sent to you.</p>
            <NavLink to="/login" className="getStarted">Login &nbsp; <FontAwesomeIcon icon={loginIcon} /></NavLink>
          </div>
        </div>
      </>
    }

    return (
      <>
        <div className="container">
          {register}
        </div>
      </>
    );
  };
}

export default ForgotPassword