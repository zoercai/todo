import React from "react";
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

@inject('store') @observer
export class Form extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    
    this.state = {
      current: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onChange(event) {
    this.setState({ current: event.target.value });
  }

  onClick(event) {
    this.props.store.addTodo(this.state.current);
  }

  render() {
    return (
      <div className="ui fluid action input focus">
      <input type="text" value={this.state.curent} placeholder="Add a TODO" onChange={this.onChange} />
      <Button onClick={this.onClick} className="positive ui button"> Add </Button> 
      </div>
    );
  }
}
