import React from "react";
import { List } from "./List";
import { MyFancyComponent } from "./Map";
import { observer } from "mobx-react";
import { Button } from 'semantic-ui-react';

@observer
export class Form extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      current: "",
      count: 0
    };

    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.getCount = this.getCount.bind(this);
  }

  onChange(event) {
    this.setState({ current: event.target.value });
  }

  onClick(event) {
    this.refs.list.add(this.state.current);
  }
  
  getCount(result) {
    this.setState({count: result});
  }

  render() {
    return (
      <div className="ui segment" id="root">
        <h1 className="ui header"> To-Do List </h1>
        <div className="ui fluid action input focus">
          <input type="text" value={this.state.curent} placeholder="Add a TODO" onChange={this.onChange} />
          <Button onClick={this.onClick} className="positive ui button"> Add </Button> 
        </div>
        
        <MyFancyComponent />

        <List ref="list" sendCount={this.getCount} />

        <div className="ui horizontal statistic" id="counter">
          <div className="value">
            {this.state.count}
          </div>
          <div className="label">
            Tasks
          </div>
        </div>
      </div>
    );
  }
}
