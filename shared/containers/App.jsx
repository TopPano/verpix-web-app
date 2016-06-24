import React, { Component, PropTypes } from 'react';

import { initialize, navigate } from '../lib/utils/googleAnalytics';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.object
  };

  componentDidMount() {
    initialize();
    navigate({
      page: this.props.location.pathname,
      title: this.props.routes[this.props.routes.length - 1].path
    })
  }

  render() {
    return (
      <div id='app-view'>
        {this.props.children}
      </div>
    );
  }
}
