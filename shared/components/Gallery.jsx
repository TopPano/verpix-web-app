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
    const { posts, postIds, maxWidth, ratio, showAuthor, likePost, unlikePost } = this.props;
    let numPerRow = Math.ceil(this.state.containerWidth / maxWidth);
    let paddingLeft = 5, paddingRight = 5;
    let postWidth =
        postIds.length >= numPerRow ?
        Math.floor(this.state.containerWidth / numPerRow) - paddingLeft - paddingRight :
        maxWidth - paddingLeft - paddingRight;
    let postHeight = Math.floor(postWidth / ratio);
    let wrapperWidth = (postWidth + paddingLeft + paddingRight) * numPerRow;
    let previews = [];

    postIds.map((id, k) => {
      const { sid, thumbnailUrl, likes, ownerInfo } = posts[id];
      let linkUrl = 'http://dev.verpix.net/?post=' + sid;
      let authorName = ownerInfo.identities.length > 0 ? ownerInfo.identities[0].profile.displayName : ownerInfo.username;

      previews.push(
        <View
          key={ k }
          linkUrl={ linkUrl }
          imgUrl={ thumbnailUrl }
          count={ likes.count }
          isLiked={ likes.isLiked }
          width={ postWidth }
          height={ postHeight }
          showAuthor={ showAuthor }
          authorPhotoUrl={ ownerInfo.profilePhotoUrl }
          authorName={ authorName }
          authorId={ ownerInfo.sid }
          likePost={ likePost.bind(this, sid) }
          unlikePost={ unlikePost.bind(this, sid) }
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
  posts: PropTypes.object.isRequired,
  postIds: PropTypes.array.isRequired,
  maxWidth: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  showAuthor: PropTypes.bool
};
Gallery.defaultProps = {
  showAuthor: false
}

