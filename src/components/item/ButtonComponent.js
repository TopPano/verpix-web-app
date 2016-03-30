'use strict';

import React from 'react';

require('styles/item/Button.css');

class ButtonComponent extends React.Component {
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

ButtonComponent.displayName = 'ItemButtonComponent';

ButtonComponent.propTypes = {
  initialIsClicked: React.PropTypes.bool.isRequired,
  text: React.PropTypes.string.isRequired,
  textClicked: React.PropTypes.string.isRequired,
  // Callback for buuton state from unclicked to clicked.
  callbackToClicked: React.PropTypes.func,
  // Callback for buuton state from clicked to unclicked.
  callbackToUnclicked: React.PropTypes.func
};
ButtonComponent.defaultProps = {
  initialIsClicked: false,
  text: '',
  textClicked: '',
  callbackToClicked: () => {},
  callbackToUnclicked: () => {}
};

export default ButtonComponent;
