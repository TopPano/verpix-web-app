'use strict';

import React from 'react';
import Brand from './BrandComponent.js';
import List from './ListComponent.js';

require('styles/layout/header/Header.css');

class HeaderComponent extends React.Component {
  render() {
    return (
      <div className="header-component">
        <Brand />
        <List />
      </div>
    );
  }
}

HeaderComponent.displayName = 'LayoutHeaderHeaderComponent';

// Uncomment properties you need
// HeaderComponent.propTypes = {};
// HeaderComponent.defaultProps = {};

export default HeaderComponent;
