'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loginUser } from '../../actions/user';

class LoginPageContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { email: '' };
  }

  handleSubmit(event) {
    event.preventDefault();
    const email = this.refs.email.value.trim();
    const password = this.refs.pass.value.trim();
    this.props.dispatch(loginUser({email, password}));
  }

  handleChange(event) {
    this.setState({email: event.target.value});
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit.bind(this)} style={{ color: 'black' }}>
        <label>
          <input type="email" ref="email" placeholder="email" value={this.state.email} defaultValue="joe@example.com"
            onChange={this.handleChange.bind(this)} />
        </label>
        <label>
          <input type="password" ref="pass" placeholder="password" />
        </label> (hint: password1)<br />
        <button type="submit">login</button>
      </form>
    );
  }
}

export default connect()(LoginPageContainer);
