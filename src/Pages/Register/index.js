import React, { Component } from 'react'
import { compose } from 'redux';
import { authenticateUser, getAuthUserType } from '../../services/auth';
import { sendFetchAccountData, resetUserData } from '../../store/actions/user';
import { connect } from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'
import { Button, Form, FormGroup, Input, Label, Spinner } from 'reactstrap'
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone: "",
      notification: "",
      registration_view: true
    }
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

  handleSubmit(e) {
    e.preventDefault();
    const { phone, name } = this.state;
    let json = JSON.stringify({ name, phone });
    let formData = new FormData();
    formData.append('request', 'register_customer');
    formData.append('data', encodeURIComponent(json));
    let { sendFetchData } = this.props;
    sendFetchData(formData);
  };

  changeState(obj) {
    this.setState(obj);
  }

  componentDidMount() {
    if (getAuthUserType()) {
      this.props.history.push('/scan');
    }
  }

  componentDidUpdate(prevProps) {
    let { error, errorMessage, userData } = this.props.userData;
    if (this.props !== prevProps) {
      if (error === true) {
        this.setState({ notification: errorMessage });
      } else {
        if (userData.length !== 0) {
          if (userData.error) {
            this.setState({ notification: userData.errorMessage });
          } else {
            if (userData.data.register === true) {
              let { id, name, user_type, auth_token, image } = userData.account;
              authenticateUser(id, name, user_type, auth_token, image, "session");
              this.props.history.push('/scan');
            }
          }
        }
      }
    }
  }

  render() {

    let register = '';
    const {  notification, phone, name, registration_view } = this.state;
    let spinnerText = this.props.userData.userLoading === 'true' ? 'border' : "none";


    if (registration_view) {
      register = <>
        <div className="login">
          <h3 className="welcomeBack">Registration</h3>
          <div>
            <Form className="formLogin" onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input disabled={spinnerText === 'border' ? true : false} type="text" id="name" value={name} onChange={this.handleChange} placeholder="John Daniel" autoComplete="name" required />
              </FormGroup>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input disabled={spinnerText === 'border' ? true : false} type="tel" id="phone" pattern="[+]*[0-9]{11,14}" value={phone} onChange={this.handleChange} placeholder="09012345678" autoComplete="phone" required />
              </FormGroup>
              <span style={{color:"red",fontSize:"0.8em"}}>{notification}</span> <br /><br />
              <Button disabled={spinnerText === 'border' ? true : false} type="submit" color="success" block><Spinner type={spinnerText} size="sm" color="light" />&nbsp; &nbsp; Sign Up</Button>
            </Form>
          </div>
          <NavLink style={{ textDecoration: "none" }} className="joinAuthentic" to="/login">Log in</NavLink>
        </div>

      </>
    } else {

      register = <>
        <div className="registerSuccessCover">
          <div className="registerSuccess">
            <h1>Hi, {name}</h1><br />
            <p>An <b>email</b> containg your login credential has been sent to you.</p>
            <NavLink style={{ textDecoration: "none", color: "inherit" }} to="/login" className="getStarted">Login &nbsp; <FontAwesomeIcon icon={faSignInAlt} /></NavLink>
          </div>
        </div>
      </>

    }
    return (
      <>
        {register}
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    userData: state.userData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetUserData: () => dispatch(resetUserData()),
    sendFetchData: (data) => dispatch(sendFetchAccountData(data))
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Register);