'use strict';

import React from 'react';

if (process.env.BROWSER) {
  require('styles/layout/header/List.css');
}

class ListComponent extends React.Component {
  render() {
    return (
      <div className="header-list-component">
        <div className="header-list-username">{this.props.username}</div>
      </div>
    );
  }
}

ListComponent.displayName = 'LayoutHeaderListComponent';

// Uncomment properties you need
// ListComponent.propTypes = {};
// ListComponent.defaultProps = {};

export default ListComponent;
