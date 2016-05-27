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
    const { count, isLiked, showLikelist } = this.props;
    return (
      <div className='view-like-component'>
        {count > 0 ?
          <div onClick={showLikelist} className='view-like-count view-like-count-clickable'>{count}</div> :
          <div className='view-like-count'>{'0'}</div>
        }
        <img
          onClick={this.handleClick}
          className='view-like-btn'
          src={`/static/images/view/likebtn${isLiked ? '-clicked' : ''}.png`}
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
  unlikePost: PropTypes.func.isRequired,
  showLikelist: PropTypes.func.isRequired
};
ViewLike.defaultProps = {
};

