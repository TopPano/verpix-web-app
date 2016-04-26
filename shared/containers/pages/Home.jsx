'use strict';

import React, { Component, PropTypes } from 'react';

export default class Home extends Component {
  static propTyes = {
    user: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div>
        <h1>Welcome to Verpix world!</h1>
        <p>This is the Home page</p>
      </div>
    );
  }
}

Home.displayName = 'Home';
