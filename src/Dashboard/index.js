import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft as back } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { NavLink, Route, Switch, withRouter } from 'react-router-dom';
import Scan from '../Pages/Scan'
import Scan2 from '../Pages/Scan/index2'
import Account from '../Pages/Account'
import History from '../Pages/History'
import profile from "../asset/profile.jpg";
import logo from "../asset/logo.png";
import UserNav from './userNav';
import Page404 from './page404';
import { removeAuthState, getImage } from '../services/auth';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    }
    this.toggle = this.toggle.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  toggle() { this.setState(prevState => { return { dropdownOpen: !prevState.dropdownOpen } }) }

  signOut = (e) => {
    e.preventDefault();
    removeAuthState();
    setTimeout(this.props.history.push('/login'), 200)
  }

  backHandle = () => {
    return this.props.history.goBack();
  }

  render() {

    return (
      <div className="dashboard">
        <header>
          <span>
            <span onClick={this.backHandle} style={{ marginRight: "0.7em", padding: "0.4em" }} className="backButton"><FontAwesomeIcon icon={back} /></span>
            <NavLink to="/home" className="userStuff" style={{ marginLeft: "0" }}>
              <img src={logo} />
              <span className="compName">Authentic Pass</span>
            </NavLink>
          </span>
          <UserNav className="userLinks" activeStyle={{ color: "black", borderWidth: "0 0 3px 0", borderStyle: "solid" }} />
          <div className="userHeader">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} >
              <DropdownToggle className="dropDown">
                <img src={getImage()} alt="" />
              </DropdownToggle>
              <DropdownMenu right style={{ marginTop: "0.3em" }}>
                <NavLink to="/settings"><DropdownItem>Setting</DropdownItem></NavLink>
                <DropdownItem divider />
                <DropdownItem onClick={this.signOut}>Logout</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </header>
        <div className="content" style={{ padding: "80px 1em" }}>
          <Switch>
            <Route exact path="/scan">
              <Scan />
            </Route>
            <Route exact path="/history">
              <History />
            </Route>
            <Route exact path="/settings">
              <Account />
            </Route>
            <Route path="/">
              <Page404 />
            </Route>
          </Switch>
        </div>
        <UserNav className="userBottomLink" activeStyle={{ color: "black" }} />
      </div>
    );
  }
}

export default withRouter(Dashboard);