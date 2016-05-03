'use strict';

import React, { Component, PropTypes } from 'react';
import Nav from './Nav.jsx';

if (process.env.BROWSER) {
  require('styles/NavBar.css');
}

export default class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: props.initSelectedItem
    };
  }

  selectItem(item) {
    this.setState({
      selectedItem: item
    });
  }

  render() {
    let navs = [];

    this.props.texts.map((text, k) => {
      navs.push(
        <Nav
          key={k}
          handleClick={this.selectItem.bind(this, k)}
          text={text}
          isSelected={this.state.selectedItem == k ? true : false}
        />
      );
    });
    return (
      <div className='navbar-component'>
        {navs}
      </div>
    );
  }
}

NavBar.displayName = 'NavBar';

NavBar.propTypes = {
  texts: PropTypes.arrayOf(PropTypes.string).isRequired,
  initSelectedItem: PropTypes.number.isRequired
};
NavBar.defaultProps = {
  texts: [],
  initSelectedItem: 0
};

