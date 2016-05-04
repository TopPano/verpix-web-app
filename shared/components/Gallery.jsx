'use strict';

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import View from './View';

if (process.env.BROWSER) {
  require('styles/item/Gallery.css');
}

export default class Gallery extends Component{
  constructor(props) {
    super(props);
    this.state = {
      containerWidth: 0
    };
  }
  componentDidMount() {
    this.setState({
      containerWidth: this.getContainerWidth()
    });
    window.addEventListener('resize', this.handleWindowResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize, false);
  }
  handleWindowResize = () => {
    this.setState({
      containerWidth: this.getContainerWidth()
    });
  }
  getContainerWidth = () => {
    var el = ReactDOM.findDOMNode(this);
    var style = window.getComputedStyle(el, null);
    return Math.floor(el.clientWidth) - parseInt(style.getPropertyValue('padding-left')) - parseInt(style.getPropertyValue('padding-right'));
  }
  render(){
    const { posts, maxWidth, ratio, showProfilePhoto } = this.props;
    let numPerRow = Math.ceil(this.state.containerWidth / maxWidth);
    let paddingLeft = 5, paddingRight = 5;
    let postWidth =
        posts.length >= numPerRow ?
        Math.floor(this.state.containerWidth / numPerRow) - paddingLeft - paddingRight :
        maxWidth - paddingLeft - paddingRight;
    let postHeight = Math.floor(postWidth / ratio);
    let wrapperWidth = (postWidth + paddingLeft + paddingRight) * numPerRow;
    let previews = [];

    posts.map((post, k) => {
      const { sid, thumbnailUrl, likes, ownerInfo } = post;
      let linkUrl = 'http://dev.verpix.net/?post=' + sid;
      previews.push(
        <View
          key={ k }
          linkUrl={ linkUrl }
          imgUrl={ thumbnailUrl }
          initialCount={ likes.count }
          initialIsLiked={ likes.isLiked }
          width={ postWidth }
          height={ postHeight }
          showProfilePhoto={ showProfilePhoto }
          profilePhotoUrl={ ownerInfo.profilePhotoUrl }
        />
      );
    });
    return(
      <div className='gallery-component container-fluid'>
        <div style={{ width: wrapperWidth }} className='gallery-wrapper'>
          { previews }
        </div>
      </div>
    );
  }
}

Gallery.displayName = 'Gallery';

Gallery.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  maxWidth: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  showProfilePhoto: PropTypes.bool
};
Gallery.defaultProps = {
  showProfilePhoto: false
}

