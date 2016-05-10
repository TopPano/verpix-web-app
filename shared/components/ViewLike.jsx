'use strict';

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('styles/ViewLike.css');
}

export default class ViewLike extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = () => {
    const { isLiked, likePost, unlikePost } = this.props;
    if(isLiked) {
      unlikePost();
    } else {
      likePost();
    }
  }

  render() {
    const { count, isLiked } = this.props;
    return (
      <div className='view-like-component'>
        <div className='view-like-count'>{count}</div>
        <img
          onClick={this.handleClick}
          className='view-like-btn'
          src={isLiked ? '/static/images/view/likebtn-clicked.png' : '/static/images/view/likebtn.png'}
        />
      </div>
    );
  }
}

ViewLike.displayName = 'ViewLike';

ViewLike.propTypes = {
  count: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired
};
ViewLike.defaultProps = {
};

