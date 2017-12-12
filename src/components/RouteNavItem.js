import React from "react";
import { Route } from "react-router-dom";

export default props =>
  <Route
    path={props.href}
    exact
    children={({ match, history }) =>
      <a
        onClick={e => history.push(e.currentTarget.getAttribute("href"))}
        {...props}
        className={match ? "active item" : "item"}
      >
        {props.children}
      </a>}
  />;