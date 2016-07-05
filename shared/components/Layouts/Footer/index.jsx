'use strict';

import React from 'react';
import { Link } from 'react-router';

import SITE_CONTENT from 'content/site/en-us.json';
import { EXTERNAL_LINKS } from 'constants/common';

if (process.env.BROWSER) {
  require('./Footer.css');
}

class Footer extends React.Component {
  render() {
    return (
      <div className="footer-component navbar-fixed-bottom">
        <Link to="/faq" className="footer-item" href={EXTERNAL_LINKS.FAQ} target="_blank">{SITE_CONTENT.FOOTER.FAQ}</Link>
        <a className="footer-item" href={EXTERNAL_LINKS.TERMS_OF_USE} target="_blank">{SITE_CONTENT.FOOTER.TERMS_OF_USE}</a>
        <a className="footer-item" href={EXTERNAL_LINKS.PRIVACY_POLICY} target="_blank">{SITE_CONTENT.FOOTER.PRIVACY_POLICY}</a>
        <a className="footer-item" href={EXTERNAL_LINKS.FACEBOOK} target="_blank">
          <img src="/static/images/footer/link-facebook.png" />
        </a>
        <a className="footer-item" href={EXTERNAL_LINKS.INSTAGRAM} target="_blank">
          <img src="/static/images/footer/link-instagram.png" />
        </a>
        <a className="footer-item twitter-follow-button" href={EXTERNAL_LINKS.TWITTER} data-show-count="false">{SITE_CONTENT.FOOTER.TWITTER}</a>
      </div>
    );
  }
}

export default Footer;
