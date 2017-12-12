import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import "./App.css";
import Routes from "./Routes";
import RouteNavItem from "./components/RouteNavItem";
import { authUser, signOutUser } from "./libs/awsLib";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };
  }

  async componentDidMount() {
    try {
      if (await authUser()) {
        this.userHasAuthenticated(true);
      }
    }
    catch(e) {
      alert(e);
    }

    this.setState({ isAuthenticating: false });
  }

  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  handleLogout = event => {
    signOutUser();
    this.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated
    };

    return (
      !this.state.isAuthenticating &&
      <div className="App container">
        <div className="ui menu">
        <div className="header item">
          todo
        </div>
        {this.state.isAuthenticated
          ? <a className="item" onClick={this.handleLogout}>Logout</a>
          : [
              <RouteNavItem key={1} href="/signup">
                Signup
              </RouteNavItem>,
              <RouteNavItem key={2} href="/login">
                Login
              </RouteNavItem>
            ]}
        </div>
        <Routes childProps={childProps} />
      </div>
    );
  }
}

export default withRouter(App);