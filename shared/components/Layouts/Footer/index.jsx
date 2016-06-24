'use strict';

import React from 'react';
import { Link } from 'react-router';

import { EXTERNAL_LINKS } from 'constants/common';

if (process.env.BROWSER) {
  require('./Footer.css');
}

class FooterComponent extends React.Component {
  render() {
    return (
      <div className='footer-component navbar-fixed-bottom'>
        <Link to='/faq' className='footer-item' href={EXTERNAL_LINKS.FAQ} target='_blank'>{'FAQ'}</Link>
        <a className='footer-item' href={EXTERNAL_LINKS.TERMS_OF_USE} target='_blank'>{'Terms of Use'}</a>
        <a className='footer-item' href={EXTERNAL_LINKS.PRIVACY_POLICY} target='_blank'>{'Privacy Policy'}</a>
        <a className='footer-item' href={EXTERNAL_LINKS.FACEBOOK} target='_blank'>
          <img src='/static/images/footer/link-facebook.png' />
        </a>
        <a className='footer-item' href={EXTERNAL_LINKS.TWITTER} target='_blank'>
          <img src='/static/images/footer/link-twitter.png' />
        </a>
        <a className='footer-item' href={EXTERNAL_LINKS.INSTAGRAM} target='_blank'>
          <img src='/static/images/footer/link-instagram.png' />
        </a>
      </div>
    );
  }
}

FooterComponent.displayName = 'LayoutFooterFooterComponent';

// Uncomment properties you need
// FooterComponent.propTypes = {};
// FooterComponent.defaultProps = {};

export default FooterComponent;