'use strict';

import React from 'react';

if (process.env.BROWSER) {
  require('./Content.css');
}

class ContentComponent extends React.Component {
  render() {
    return (
      <div className="content-component">
        {this.props.children}
      </div>
    );
  }
}

ContentComponent.displayName = 'LayoutContentContentComponent';

// Uncomment properties you need
// ContentComponent.propTypes = {};
// ContentComponent.defaultProps = {};

export default ContentComponent;
