import React, { Component } from 'react';

import {
  Route,
  Link,
  Switch,
  Redirect
} from 'react-router-dom'

import Top from '../../components/top/index.jsx';
import RegisterForm from '../../components/registerForm/index.jsx';

import LoginUser from "../../scenes/loginUser/index.jsx";
import LoginDriver from "../../scenes/loginDriver/index.jsx";
import Home from "../../scenes/home/index.jsx";


class App extends Component {
  render() {
    return (
      <div>

          <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/login" component={LoginUser}/>
          <Route exact path="/loginDriver" component={LoginDriver}/>
      </Switch>

       </div>
    )
  }
}

export default App;
