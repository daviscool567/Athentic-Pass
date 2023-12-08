import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome as home, faHistory as history, faCog as setting } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from 'react-router-dom';

function UserNav({className, activeStyle}) {
  return (
    <div className={className}>
      <NavLink to="/scan" activeStyle={activeStyle} ><FontAwesomeIcon icon={home} /></NavLink>
      <NavLink to="/history" activeStyle={activeStyle} ><FontAwesomeIcon icon={history} /></NavLink>
      <NavLink to="/settings" activeStyle={activeStyle} ><FontAwesomeIcon icon={setting} /></NavLink>
    </div>
  )
}

export default UserNav
