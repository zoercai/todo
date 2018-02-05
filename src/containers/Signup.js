import React, { Component } from "react";
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types'
import { Button, Form, Message } from 'semantic-ui-react'
import {
    AuthenticationDetails,
    CognitoUserPool
} from "amazon-cognito-identity-js";
import config from "../config";

@inject('store') @observer
export default class Signup extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            email: "",
            password: "",
            newUser: null,
            confirmationCode: "",
        };
    }

    validateForm() {
        return (
            this.state.email.length > 0 &&
            this.state.password.length > 0
        );
    }

    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            const newUser = await this.signup(this.state.email, this.state.password);
            this.setState({
                newUser: newUser
            });
        } catch (e) {
            alert(e);
        }

        this.setState({ isLoading: false });
    }

    handleConfirmationSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            await this.confirm(this.state.newUser, this.state.confirmationCode);
            await this.authenticate(
                this.state.newUser,
                this.state.email,
                this.state.password
            );

            this.props.store.userHasAuthenticated(true);
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    signup(email, password) {
        const userPool = new CognitoUserPool({
            UserPoolId: config.cognito.USER_POOL_ID,
            ClientId: config.cognito.APP_CLIENT_ID
        });

        return new Promise((resolve, reject) =>
            userPool.signUp(email, password, [], null, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(result.user);
            })
        );
    }

    confirm(user, confirmationCode) {
        return new Promise((resolve, reject) =>
            user.confirmRegistration(confirmationCode, true, function (err, result) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result);
            })
        );
    }

    authenticate(user, email, password) {
        const authenticationData = {
            Username: email,
            Password: password
        };
        const authenticationDetails = new AuthenticationDetails(authenticationData);

        return new Promise((resolve, reject) =>
            user.authenticateUser(authenticationDetails, {
                onSuccess: result => resolve(),
                onFailure: err => reject(err)
            })
        );
    }


    renderForm() {
        return (
            <Form className="ui form" onSubmit={this.handleSubmit} loading={this.state.isLoading}>
                <Form.Field>
                    <label>Email</label>
                    <input key='id' id='email' type='email' placeholder='Email' onChange={this.handleChange} />
                </Form.Field>
                <Form.Field>
                    <label>Password</label>
                    <input key='pass' id='password' type='password' onChange={this.handleChange} />
                </Form.Field>

                <Button className="ui submit button" type='submit' disabled={!this.validateForm()}> Signup </Button>
            </Form>
        );
    }

    renderConfirmationForm() {
        return (
            <Form className="ui form" onSubmit={this.handleConfirmationSubmit} loading={this.state.isLoading}>
                <Message>
                    <Message.Header>Confirmation Code</Message.Header>
                    <p>Please check your email for the code.</p>
                </Message>
                <Form.Field>
                    <label> Confirmation Code </label>
                    <input key='conf' autoFocus id='confirmationCode' type='tel' placeholder='' onChange={this.handleChange} />
                </Form.Field>
                <Button className="ui submit button" type='verify' disabled={!this.validateConfirmationForm()}> Verify </Button>
            </Form>
        );
    }

    render() {
        return (
            <div className="Signup">
                {this.state.newUser === null
                    ? this.renderForm()
                    : this.renderConfirmationForm()}
            </div>
        );
    }
}