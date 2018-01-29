import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { observer, Provider } from 'mobx-react';
import "./App.css";
import Routes from "./Routes";
import RouteNavItem from "./components/RouteNavItem";
import { authUser, signOutUser } from "./libs/awsLib";
import Store from "./Store";

const store = new Store();

@observer
class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    try {
      if (await authUser()) {
        store.userHasAuthenticated(true);
      }
    }
    catch(e) {
      alert(e);
    }

    store.setIsAuthenticating(false);
  }

  handleLogout = event => {
    signOutUser();
    store.userHasAuthenticated(false);
    this.props.history.push("/login");
  }

  render() {
    const childProps = {
      isAuthenticated: store.getIsAuthenticated(),
      userHasAuthenticated: store.getIsAuthenticated,
    };

    return (
      <Provider store={store}>
        <div>
        {!store.getIsAuthenticating() &&
        <div className="App container">
          <div className="ui menu">
          <div className="header item">
            todo
          </div>
          {store.getIsAuthenticated()
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
          <Routes />
        </div>}
        </div>
      </Provider>
    );
  }
}

export default withRouter(App);