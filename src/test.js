import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { NavLink } from 'react-router-dom';

function test(navConfig) {
  let navConfig = [];



  navConfig.map((item, idx) => {
    return (
      <li key={idx + 10}>
        <NavLink to={item.url}>
          <span className="icon" title={item.title}>
            <FontAwesomeIcon icon={item.icon} />
          </span>
          {item.name}
          {item.notification ? (
            <div className="tag">{item.notifNumber}</div>
          ) : ""}
        </NavLink>
        {item.children ? (
          <ul className="secnav">
            {item.children.map((item, idx) => {
              return (
                <li key={idx + 101} title={item.title}>
                  <NavLink to={item.url} >
                    {item.name}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        ) : ""}
      </li>
    );
  })
}

export default test
