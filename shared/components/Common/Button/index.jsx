'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('./Button.css');
}

export default class Button extends Component {
  constructor(props) {
    super(props);
  }

  handleBtnClick = () => {
    const { isClicked, handleWhenIsUnclicked, handleWhenIsClicked } = this.props;
    if(isClicked) {
      handleWhenIsClicked();
    } else {
      handleWhenIsUnclicked();
    }
  }

  render() {
    const { isClicked, textIsUnclicked, textIsClicked } = this.props;
    return (
      <span
        className={'button-component' + (isClicked ? ' button-component-clicked' : '')}
        onClick={this.handleBtnClick}
      >
        {isClicked ? textIsClicked : textIsUnclicked}
      </span>
    );
  }
}

Button.displayName = 'Button';

Button.propTypes = {
  isClicked: PropTypes.bool.isRequired,
  textIsClicked: PropTypes.string.isRequired,
  textIsUnclicked: PropTypes.string.isRequired,
  // Handle click when isClicked is false.
  handleWhenIsUnclicked: PropTypes.func,
  // Handle click when isClicked is true.
  handleWhenIsClicked: PropTypes.func
};

Button.defaultProps = {
  handleWhenIsUnclicked: () => {},
  handleWhenIsClicked: () => {}
};
