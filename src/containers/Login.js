import React, { Component } from "react";
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import config from "../config";
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser
} from "amazon-cognito-identity-js";

@inject('store') @observer
class Login extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = async event => {
    event.preventDefault();

    try {
      await this.login(this.state.email, this.state.password);
      this.props.store.userHasAuthenticated(true);
      this.props.history.push("/");
    } catch (e) {
      alert(e);
    }
  }

  login(email, password) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
    const user = new CognitoUser({ Username: email, Pool: userPool });
    const authenticationData = { Username: email, Password: password };
    const authenticationDetails = new AuthenticationDetails(authenticationData);

    return new Promise((resolve, reject) =>
      user.authenticateUser(authenticationDetails, {
        onSuccess: result => resolve(),
        onFailure: err => reject(err)
      })
      );
  }

  render() {
    return (
      <div className="Login">
        <form className="ui form" onSubmit={this.handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input type="text" name="email" placeholder="email" value={this.state.email} onChange={this.handleChange} />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
          </div>
          <button className="ui submit button" type="submit">
            Login
          </button>
        </form>
      </div>
    );
  }
}

export default Login;