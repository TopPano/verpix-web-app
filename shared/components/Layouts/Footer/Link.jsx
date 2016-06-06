'use strict';

import React from 'react';

if (process.env.BROWSER) {
  require('./Link.css');
}

class LinkComponent extends React.Component {
  render() {
    return (
      <div className="footer-link-component">
        <a href={this.props.url}>{this.props.label}</a>
      </div>
    );
  }
}

LinkComponent.displayName = 'LayoutFooterLinkComponent';

// Uncomment properties you need
// LinkComponent.propTypes = {};
// LinkComponent.defaultProps = {};

export default LinkComponent;
