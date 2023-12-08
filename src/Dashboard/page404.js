import React, {useEffect} from 'react'
import { withRouter } from 'react-router';

function Page404(props) {
  useEffect(() => {
    if(props.location.pathname === '/') props.history.push('/scan');
  })
  return (
    <div>
      page404
    </div>
  )
}

export default withRouter(Page404)
