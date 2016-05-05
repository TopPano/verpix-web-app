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
      selectedItem: props.initialSelectedItem
    };
  }

  selectItem(item) {
    this.setState({
      selectedItem: item
    });
    this.props.clickCallback(item);
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
  initialSelectedItem: PropTypes.number.isRequired,
  clickCallback: PropTypes.func
};
NavBar.defaultProps = {
  texts: [],
  initialSelectedItem: 0,
  clickCallBack: () => {}
};

