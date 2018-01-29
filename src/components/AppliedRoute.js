import React from "react";
import { Route } from "react-router-dom";

// This is really confusing!
export default ({ component: C, props: cProps, ...rest }) =>
  <Route {...rest} render={props => <C {...props} {...cProps} />} />;