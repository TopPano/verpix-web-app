'use strict';

import React, { Component, PropTypes } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import Brand from './BrandComponent.js';
import List from './ListComponent.js';

if (process.env.BROWSER) {
  require('styles/layout/header/Header.css');
}

class HeaderComponent extends Component {
  render() {
    const { username, userId } = this.props;
    return (
      <div className="header-component navbar-fixed-top">
        <Grid fluid>
          <Row>
            <Col xs={4} xsOffset={4}>
              <Brand />
            </Col>
            <Col xs={4}>
              <List
                username={username}
                userId={userId}
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

HeaderComponent.displayName = 'LayoutHeaderHeaderComponent';

HeaderComponent.propTypes = {
  username: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired
};
HeaderComponent.defaultProps = {
  username: '',
  userId: ''
};

export default HeaderComponent;
