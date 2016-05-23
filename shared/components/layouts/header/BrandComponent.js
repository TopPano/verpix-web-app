'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

if (process.env.BROWSER) {
  require('styles/layout/header/Brand.css');
}

class BrandComponent extends Component {
  render() {
    return (
      <Link to={'/'} className='brand-component'>
        <img
          className={'brand' + (this.props.alwaysShow ? ' brand-always-show' : '')}
          src='/static/images/header/home-big.png'
          alt='Verpix'
        />
      </Link>
    );
  }
}

BrandComponent.displayName = 'LayoutHeaderBrandComponent';

BrandComponent.propTypes = {
  alwaysShow: PropTypes.bool.isRequired
};
// BrandComponent.defaultProps = {};

export default BrandComponent;
