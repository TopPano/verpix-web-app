'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('styles/Nav.css');
}

export default class Nav extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { text, isSelected, handleClick } = this.props;

    return (
      <div
        onClick={handleClick}
        className={'nav-component' + (isSelected ? ' nav-component-selected' : '')}>
        {text}
      </div>
    );
  }
}

Nav.displayName = 'Nav';

Nav.propTypes = {
  text: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  handleClick: PropTypes.func.isRequired
};
Nav.defaultProps = {
  text: '',
  isSelected: false,
  handleClick: () => {}
};

