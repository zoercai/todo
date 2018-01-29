import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Login from "./containers/Login";
import Todo from "./Todo";
import AppliedRoute from "./components/AppliedRoute";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";

export default () =>
  <Switch>
    <UnauthenticatedRoute path="/" exact component={Todo} />
    <AppliedRoute path="/login" exact component={Login} />
    {/* <AuthenticatedRoute path="/signup" exact component={Signup} /> */}

    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;