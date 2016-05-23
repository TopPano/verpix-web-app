'use strict';

import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import List from './ListComponent';
import Right from './RightComponent';

if (process.env.BROWSER) {
  require('styles/layout/footer/Footer.css');
}

class FooterComponent extends React.Component {
  render() {
    return (
      <div className="footer-component navbar-fixed-bottom">
        <Grid fluid>
          <Row>
            <Col xs={12} sm={8}>
              <List />
            </Col>
            <Col xs={0} sm={4}>
              <Right right={'Toppano.In All rights reserved.'} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

FooterComponent.displayName = 'LayoutFooterFooterComponent';

// Uncomment properties you need
// FooterComponent.propTypes = {};
// FooterComponent.defaultProps = {};

export default FooterComponent;
