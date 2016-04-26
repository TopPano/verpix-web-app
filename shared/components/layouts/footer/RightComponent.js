'use strict';

import React from 'react';

if (process.env.BROWSER) {
  require('styles/layout/footer/Right.css');
}

class RightComponent extends React.Component {
  render() {
    return (
      <div className="footer-right-component">
        {this.props.right}
      </div>
    );
  }
}

RightComponent.displayName = 'LayoutFooterRightComponent';

// Uncomment properties you need
// RightComponent.propTypes = {};
// RightComponent.defaultProps = {};

export default RightComponent;
