import React, { Component } from "react";
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Route, Redirect } from "react-router-dom";

// export default ({ component: C, props: cProps, ...rest }) =>
//   <Route
//     {...rest}
//     render={props =>
//       cProps.isAuthenticated
//         ? <C {...props} {...cProps} />
//         : <Redirect
//             to={`/login?redirect=${props.location.pathname}${props.location
//               .search}`}
//           />}
//   />;

@inject('store') @observer
export default class AuthenticatedRoute extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  render() {
      const { component: C, props: cProps, ...rest } = this.props;
      console.warn("redirecting!!!!!!");
      return (
        <Route
        {...rest}
        render={props =>
          !this.props.store.getIsAuthenticated()
            ? <C {...props} {...cProps} />
            : <Redirect to="/" />}
        />
      )
  }

}