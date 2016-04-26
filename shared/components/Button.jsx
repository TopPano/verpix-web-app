'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('styles/item/Button.css');
}

export default class Button extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: props.initialIsClicked
    };
  }
  handleBtnClick = () => {
    if(!this.state.isClicked) {
      this.props.callbackToClicked();
    } else {
      this.props.callbackToUnclicked();
    }
    this.setState({
      isClicked: !this.state.isClicked
    });
  }
  render() {
    return (
      <div className='button-component'>
        <div className={ 'button-text ' + (this.state.isClicked ? 'button-text-clicked' : '') } onClick={ this.handleBtnClick }>
          { this.state.isClicked ? this.props.textClicked : this.props.text }
        </div>
      </div>
    );
  }
}

Button.displayName = 'Button';

Button.propTypes = {
  initialIsClicked: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  textClicked: PropTypes.string.isRequired,
  // Callback for buuton state from unclicked to clicked.
  callbackToClicked: PropTypes.func,
  // Callback for buuton state from clicked to unclicked.
  callbackToUnclicked: PropTypes.func
};
Button.defaultProps = {
  initialIsClicked: false,
  text: '',
  textClicked: '',
  callbackToClicked: () => {},
  callbackToUnclicked: () => {}
};

