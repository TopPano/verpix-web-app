'use strict';

import React from 'react';

if (process.env.BROWSER) {
  require('styles/layout/header/Brand.css');
}

class BrandComponent extends React.Component {
  render() {
    return (
      <div className="header-brand-component">
        <a href="#"><img src="/static/images/layout/header/logo.png" alt="Verpix"></img></a>
      </div>
    );
  }
}

BrandComponent.displayName = 'LayoutHeaderBrandComponent';

// Uncomment properties you need
// BrandComponent.propTypes = {};
// BrandComponent.defaultProps = {};

export default BrandComponent;
