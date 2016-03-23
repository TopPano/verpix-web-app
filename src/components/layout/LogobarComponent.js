'use strict';

import React from 'react';
import { Nav } from 'react-bootstrap';
import { Navbar } from 'react-bootstrap';
import { NavItem } from 'react-bootstrap';

require('styles/layout/Logobar.css');

class LogobarComponent extends React.Component {
  render() {
    return (
      <div className="logobar-component">
        <Navbar fixedTop={true} fluid>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#"><img src="../../images/layout/logo.png" alt="Verpix" /></a>
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight>
              <NavItem>GGGG AAAA</NavItem>
              <NavItem><img src="../../images/layout/help.png" alt="help"/></NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>

    );
  }
}

LogobarComponent.displayName = 'LayoutLogobarComponent';

// Uncomment properties you need
// LogobarComponent.propTypes = {};
// LogobarComponent.defaultProps = {};

export default LogobarComponent;
