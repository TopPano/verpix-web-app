'use strict';

import React from 'react';
import { Link } from 'react-router';

if (process.env.BROWSER) {
  require('styles/layout/header/Brand.css');
}

class BrandComponent extends React.Component {
  render() {
    return (
      <div className="header-brand-component">
        <Link to={'/'}><img src="/static/images/logo.png" alt="Verpix"></img></Link>
      </div>
    );
  }
}

BrandComponent.displayName = 'LayoutHeaderBrandComponent';

// Uncomment properties you need
// BrandComponent.propTypes = {};
// BrandComponent.defaultProps = {};

export default BrandComponent;
