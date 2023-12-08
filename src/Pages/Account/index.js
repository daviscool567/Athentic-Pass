import React, { Component } from 'react';
import './index.css'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as userIcon, faEnvelope as mailIcon } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, FormFeedback, Spinner } from 'reactstrap';
import { getAuthUserAll, setImage, setAuthToken, signOut } from '../../services/auth'
import { sendFetchAccountData, resetUserData } from '../../store/actions/user';
import Unverified from './Unverified'
import placeholder from '../../asset/placeholder.jpg'
import { withRouter } from 'react-router';

class Account extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imagePreviewUrl: placeholder,
      file: [],
      name: '',
      phone: '',
      status: "active",
      submitLoader: false,
      error: false,
      errorMessage: "",
      errorType: "",
      accountData: [],
      loader: false,
      modal: false,
      notification: '',
      oldPassword: '',
      newPassword: '',
    }
    this.close = this.close.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    this.fileRef = React.createRef();
    this.changeState = this.changeState.bind(this);
    this.commonState = this.commonState.bind(this);
    this.toggle = this.toggle.bind(this);
    this.checkObj = this.checkObj.bind(this);
    this.checkForUpdate = this.checkForUpdate.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal,
      oldPassword: '',
      newPassword: ''
    });
  }

  
  handlePasswordSubmit(e) {
    e.preventDefault();
    const { oldPassword, newPassword } = this.state;
    let data = JSON.stringify({ ...getAuthUserAll(), oldPassword, newPassword });
    let formData = new FormData();
    formData.append('request', 'edit_account_user');
    formData.append('data', encodeURIComponent(data));
    this.props.sendFetchData(formData);
  }

  close() {
    this.setState({
      notifDisplay: 'none',
      notification: '',
    });
  }

  commonState(data, auth) {
    const { error, errorType, errorMessage, account } = data;
    if (auth) setAuthToken(account.auth_token);
    if (error) {
      this.setState({
        submitLoader: false,
        error: error,
        errorMessage: errorMessage,
        errorType: errorType,
        loader: false
      })
    } else {
      this.setState({
        imagePreviewUrl: account.image,
        name: account.name,
        phone: account.phone,
        status: account.status,
        submitLoader: false,
        error: error,
        modal: false,
        errorMessage: errorMessage,
        errorType: errorType,
        accountData: account,
        loader: false,
        notification: errorMessage,
        oldPassword: '',
        newPassword: '',
      });
      setImage(account.image);
    }
  }

  changeState(object) {
    this.setState(object);
  }

  handleFileChange(e) {
    let file = e.target.files[0];
    let picReader = new FileReader();
    picReader.onloadend = () => {
      this.changeState({
        file: file,
        imagePreviewUrl: picReader.result
      });
    };
    picReader.readAsDataURL(file);
    let data = JSON.stringify(getAuthUserAll());
    let formData = new FormData();
    formData.append('request', 'edit_account_user');
    formData.append('file', file);
    formData.append('data', encodeURIComponent(data));
    this.props.sendFetchData(formData);
  }

  handleChange(e) {
    this.changeState(
      {
        [e.target.id]: e.target.value
      }
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    let { sendFetchData } = this.props;
    const { name, phone } = this.state;
    let data = JSON.stringify({ ...getAuthUserAll(), name, phone });
    let formData = new FormData();
    formData.append('request', 'edit_account_user');
    formData.append('data', encodeURIComponent(data));
    sendFetchData(formData);
  }


  checkObj(data) {
    try{
      if(Array.isArray(data)) {
        return data.length;
      } else if(data !== null && typeof data === 'object') {
        return true;
      } else {
        return false;
      }
    } catch (e){}
    return false;
  }

  checkForUpdate(data) {
    try{
      if(Array.isArray(data)) {
        return data.length ? false:true;
      } else if(data !== null && typeof data === 'object') {
        return Object.keys(data).length === 0;
      } else {
        return true;
      }
    } catch(e){}
    return false;
  }

  componentDidMount() {
    const data = JSON.stringify({ ...getAuthUserAll() });
    const { sendFetchData, userData } = this.props;
    if (this.checkForUpdate(userData.userData)) {
      let formData = new FormData();
      formData.append('request', 'get_account_details');
      formData.append('data', encodeURIComponent(data));
      sendFetchData(formData);
      this.setState({loader:true});
    } else {
      this.commonState(userData.userData, false);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.userData !== prevProps.userData) {
      const { userData } = this.props.userData;
      if (this.checkObj(userData)) {
        if (userData.logoutUser) {
          this.props.resetUserData();
          signOut();
          setTimeout(() => {
            this.props.history.push("/login");
          }, 300);
        } else {
          this.commonState(userData, true);
        }
      }
    }
  }


  render() {

    const { name, phone, status, submitLoader, error, errorMessage, loader, errorType, modal, imagePreviewUrl, notification, oldPassword, newPassword } = this.state;

    let displayData = '';
    if (loader) {
      displayData = <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }} className="spinnerClass"><Spinner style={{ width: '3rem', height: '3rem' }} /></div>
    } else if (error && errorType === 'account') {
      displayData = <Unverified data={errorMessage} />
    } else {
      displayData = <div className="">
        {error  ? <Unverified data={errorMessage} /> : ""}
        <form encType="multipart/form-data" method="post" onSubmit={this.handleSubmit} >
          <div style={{ position: 'relative', width: '250px', margin: '0em auto 2em auto' }} className="account">
            <label htmlFor="file" className="file_label">
              <img src={imagePreviewUrl} alt="" className="file_label_img" />
              <div className="bar_upload">
                <span className="upload_icon straight" style={{ width: '3em' }}></span>
                <span className="upload_icon slanting" style={{ width: '3em' }}></span>
                <span className="upload_icon round"></span>
              </div>
            </label>
            <input type="file" id="file" name="file" className="file" accept="image/*" onChange={this.handleFileChange} ref={this.fileRef} />
          </div>
          <span className="bag-head"></span>
          <div className="summary_inline">
            <div className="account_icon" >
              <span role="img" aria-label="name"><FontAwesomeIcon icon={userIcon} /> </span>
            </div>
            <div className="account_detail">
              <span className="h2">Name</span><br /><br />
              <Input pattern="[a-zA-Z\d_\-., ]{6,100}" disabled={submitLoader ? true : false} type="text" id="name" style={{ color: 'black' }} value={name} onChange={this.handleChange} placeholder="Obi Joshua" autoComplete="name" required />
            </div>
          </div>
          <span className="hr"></span>

          <div className="summary_inline">
            <div className="account_icon" >
              <span role="img" aria-label="name">&#9742;</span>
            </div>
            <div className="account_detail">
              <span className="h2">Phone</span><br /><br />
              <Input type="tel" pattern="[0-9\+]{11,15}" id="phone" style={{ color: 'black' }} value={phone} onChange={this.handleChange} placeholder="09012345678" autoComplete="phone" required />
            </div>
          </div>
          {/* <span className="hr"></span> */}
          {/* <div className="summary_inline">
            <div className="account_icon">
              <span role="img" aria-label="email"><FontAwesomeIcon icon={mailIcon} /></span>
            </div>
            <div className="account_detail">
              <span className="h2">Email</span>
              <span className="summary_text email">{"email"}</span>
              <span className="hr"></span>
              <Button color="dark" disabled={submitLoader ? true : false} onClick={this.toggle}>CHANGE PASSWORD</Button>
            </div>
          </div> */}
          <span className="hr"></span> <br />
          <Button disabled={submitLoader ? true : false} block color="dark" type="submit">SAVE</Button>
        </form>
      </div>

    }


    return (
      <div className="">
        {displayData}
        {/* <Modal isOpen={modal} toggle={this.toggle} className="modalPassword">
          <ModalHeader toggle={this.toggle}>Change Password</ModalHeader>
          <ModalBody>
            <Form id="passwordForm" onSubmit={this.handlePasswordSubmit} method="post">
              <FormGroup>
                <Label for="email">Old Password</Label>
                <Input onChange={this.handleChange} invalid={errorType === 'password' ? true : false} pattern="[a-zA-Z\d@_*#$]{8, 40}" value={oldPassword} type="password" placeholder="alphanumeric @_*#$" id="oldPassword" required />
                <FormFeedback invalid={errorType === 'password' ? true : false}>{errorMessage}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="address">New Password</Label>
                <Input value={newPassword} invalid={errorType === 'password' ? true : false} pattern="[a-zA-Z\d@_*#$]{8, 40}" onChange={this.handleChange} type="password" id="newPassword" placeholder="alphanumeric, @_*#$" required />
                <FormFeedback invalid={errorType === 'password' ? true : false}>{errorMessage}</FormFeedback>
              </FormGroup>
              <br />
            </Form>
            <div className="loginFormButtons">
              <Button block form="passwordForm" color="dark" type="submit">SAVE</Button>
            </div>
          </ModalBody>
        </Modal> */}
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
    sendFetchData: (data) => dispatch(sendFetchAccountData(data)),
    resetUserData: () => dispatch(resetUserData())
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Account);