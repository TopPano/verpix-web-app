'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

if (process.env.BROWSER) {
  require('styles/layout/header/List.css');
}

class ListComponent extends Component {
  render() {
    const { username, userId } = this.props;
    return (
      <div className="header-list-component">
        {(username !== '') &&
          <Link className="header-list-username" to={'@' + userId}>{username}</Link>
        }
      </div>
    );
  }
}

ListComponent.displayName = 'LayoutHeaderListComponent';

ListComponent.propTypes = {
  username: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
};
ListComponent.defaultProps = {
  username: '',
  userId: ''
};

export default ListComponent;
