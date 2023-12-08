import { Provider } from 'react-redux';
import './App.css';
import { BrowserRouter as Router, Route as DefaultRoute, Switch, Redirect } from 'react-router-dom';
import history from './history';
import store from './store';
import ForgotPassword from './Pages/ForgotPassword'
import Register from './Pages/Register'
import Login from './Pages/Login'
import Home from './Pages/Home'
import DashBoard from "./Dashboard"
import {getAuthUserType } from './services/auth';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <DefaultRoute
    {...rest}
    render={(props) => (getAuthUserType() ? (
      <Component {...props} />
    ) : (
      <Redirect
        to={{
          pathname: '/home'
        }}
      />
    ))
    }
  />
);

const Route = ({ component: Component, ensureNonAuth, ...rest }) => (
  <DefaultRoute {...rest} render={(props) => <Component {...props} />} />
);

function App() {
  return (
    <Provider store={store} >
      <Router history={history}>
        <Switch>
          <Route ensureNonAuth exact path="/register" component={Register} />
          <Route ensureNonAuth exact path="/login" component={Login} />
          <Route ensureNonAuth exact path="/home" component={Home} />
          {/* <Route ensureNonAuth exact path="/forgotpassword" component={ForgotPassword} /> */}
          <PrivateRoute path="/" name="Home" component={DashBoard} />
        </Switch>
      </Router>
    </Provider>
  )
}
export default App;