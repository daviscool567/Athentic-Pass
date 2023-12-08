import React, { Component } from 'react'
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom'
import { Button, CustomInput, Form, FormFeedback, FormGroup, Input, Label, Spinner } from 'reactstrap'
import { authenticateUser, getAuthUserType } from '../../services/auth';
import { sendFetchAccountData, resetUserData } from '../../store/actions/user';
import { compose } from 'redux';
import './index.css'

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      keep_signin: false,
      buttonText: "",
      invalid: false,
      notification: "",
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeState = this.changeState.bind(this);
  }

  handleChange(e) {
    this.setState(prevState => {
      return { ...prevState, [e.target.id]: (() => (e.target.id === 'keep_signin' ? (e.target.checked) : (e.target.value)))() }
    });
  };

  handleSubmit(e) {
    e.preventDefault();
    const { phone } = this.state;
    let data = JSON.stringify({ phone });
    let formData = new FormData();
    formData.append('request', 'login_customer');
    formData.append('data', encodeURIComponent(data));
    this.props.sendFetchAccountData(formData);
  };

  componentDidMount() {
    resetUserData();
    if (getAuthUserType()) {
      this.props.history.push('/scan');
    }
  }

  changeState(obj) {
    this.setState(obj);
  }

  componentDidUpdate(prevProp) {
    if (prevProp.userData !== this.props.userData) {
      let stayingDuration = 'local';
      const { userLoading, error, errorMessage, userData } = this.props.userData;
      console.log(userData)
      const { keep_signin } = this.state;
      if (error === true) {
        this.changeState({ notification: errorMessage, invalid: true });
      } else {
        if (userData.length !== 0) {
          if (userData.error === false && userLoading === 'done') {
            if (keep_signin === true) stayingDuration = 'session';
            let { id, name, user_type, auth_token, image } = userData.account;
            authenticateUser(id, name, user_type, auth_token, image, stayingDuration);
            this.props.history.push('/scan');
          } else {
            this.changeState({ notification: userData.errorMessage, invalid: true });
          }
        }
      }
    }
  }


  render() {
    let { phone, notification, invalid } = this.state;
    const { userData } = this.props;
    let spinnerText = userData.userLoading === 'true' ? 'border' : "none";

    return (
      <div className="login">
        <h3 className="welcomeBack">Welcome back</h3>
        <div>
          <form className="formLogin" onSubmit={this.handleSubmit} method="post">
            <FormGroup>
              <Label for="exampleEmail">Phone number</Label>
              <Input disabled={spinnerText === 'border' ? true : false} onChange={this.handleChange} value={phone} type="tel" placeholder="09012345678" id="phone" invalid={invalid} required />
              <FormFeedback invalid={invalid} >{notification}</FormFeedback>
            </FormGroup>
            <br />
            <Button block disabled={spinnerText === 'border' ? true : false} color="success" type="submit"><Spinner type={spinnerText} size="sm" color="light" />&nbsp; &nbsp; Sign In</Button>
          </form>
        </div>
        <NavLink style={{ textDecoration: "none" }} className="joinAuthentic" to="/register">Join Authentic Pass</NavLink>
      </div>
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
    sendFetchAccountData: (data) => dispatch(sendFetchAccountData(data)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Login);
