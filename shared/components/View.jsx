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
    const { linkUrl, imgUrl, width, height, showProfilePhoto, profilePhotoUrl } = this.props;
    const { count, isLiked } = this.state;
    let profilePhoto;

    if(showProfilePhoto) {
      profilePhoto = <img className='view-profile' src={profilePhotoUrl}/>;
    }

    return (
      <div className='view-component'>
        <a href={linkUrl}>
          <img className='view-preview' src={imgUrl} width={width} height={height} alt='preview' />
        </a>
        {profilePhoto}
        <div className='view-like'>
          <div className='view-count'>{count}</div>
          <img
            className='view-likebtn'
            onClick={this.handleLikebtnClick}
            src={isLiked ? '/static/images/view/likebtn-clicked.png' : '/static/images/view/likebtn.png'}
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
  initialIsLiked: PropTypes.bool.isRequired,
  showProfilePhoto: PropTypes.bool,
  profilePhotoUrl: PropTypes.string
};
View.defaultProps = {
  linkUrl: '',
  imgUrl: '',
  initialCount: 0,
  initialIsLiked: false,
  initialWidth: 500,
  initialHeight: 250,
  showProfilePhoto: false,
  profilePhotoUrl: '/static/images/profile-photo-default.png'
};

