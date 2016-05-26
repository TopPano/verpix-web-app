'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

if (process.env.BROWSER) {
  require('styles/layout/header/Brand.css');
}

export default class Brand extends Component {
  render() {
    return (
      <Link to={'/'} className='brand-component'>
        <img
          className={'brand' + (this.props.alwaysShow ? ' brand-always-show' : '')}
          src='/static/images/header/logo.png'
          alt='Verpix'
        />
      </Link>
    );
  }
}

Brand.displayName = 'Brand';

Brand.propTypes = {
  alwaysShow: PropTypes.bool.isRequired
};
