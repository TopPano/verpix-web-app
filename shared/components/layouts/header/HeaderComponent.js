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
    return (
      <div className="header-component navbar-fixed-top">
        <Grid fluid>
          <Row>
            <Col xs={4} xsOffset={4}>
              <Brand />
            </Col>
            <Col xs={4}>
              {this.props.username &&
                <List {...this.props} />
              }
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

HeaderComponent.displayName = 'LayoutHeaderHeaderComponent';

HeaderComponent.propTypes = {
  username: PropTypes.string,
  profilePhotoUrl: PropTypes.string,
  userId: PropTypes.string,
  logoutUser: PropTypes.func
};
HeaderComponent.defaultProps = {
};

export default HeaderComponent;
