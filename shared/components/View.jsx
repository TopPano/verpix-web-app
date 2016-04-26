'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('styles/item/View.css');
}

export default class View extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      count: props.initialCount,
      isLiked: props.initialIsLiked
    };
  }
  handleLikebtnClick = () => {
    this.setState({
      count: !this.state.isLiked ?
        this.state.count + 1 :
        this.state.count - 1,
      isLiked: !this.state.isLiked
    });
  }
  render() {
    return (
      <div className='view-component'>
        <a href={ this.props.linkUrl }>
          <img className='view-preview' src={ this.props.imgUrl } width={ this.props.width } height={ this.props.height } alt='preview' />
        </a>
        <div className='view-like'>
          <div className='view-count'>{ this.state.count }</div>
          <img
            className='view-likebtn'
            onClick={ this.handleLikebtnClick }
            src={ this.state.isLiked ? '/static/images/view/likebtn-clicked.png' : '/static/images/view/likebtn.png' }
          />
        </div>
      </div>
    );
  }
}

View.displayName = 'ItemView';

View.propTypes = {
  linkUrl: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  initialCount: PropTypes.number.isRequired,
  initialIsLiked: PropTypes.bool.isRequired
};
View.defaultProps = {
  linkUrl: '',
  imgUrl: '',
  initialCount: 0,
  initialIsLiked: false,
  initialWidth: 500,
  initialHeight: 250
};

