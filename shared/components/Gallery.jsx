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
    let numPerRow = Math.ceil(this.state.containerWidth / this.props.maxWidth);
    let paddingLeft = 5, paddingRight = 5;
    let postWidth =
      this.props.posts.length >= numPerRow ?
      Math.floor(this.state.containerWidth / numPerRow) - paddingLeft - paddingRight :
      this.props.maxWidth - paddingLeft - paddingRight;
    let postHeight = Math.floor(postWidth / this.props.ratio);
    let wrapperWidth = (postWidth + paddingLeft + paddingRight) * numPerRow;
    let previews = [];

    this.props.posts.map((post, k) => {
      previews.push(
        <View
          key={ k }
          linkUrl={ post.linkUrl }
          imgUrl={ post.imgUrl }
          initialCount={ post.count }
          initialIsLiked={ post.isLiked }
          width={ postWidth }
          height={ postHeight }
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
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      postId: PropTypes.string.isRequired,
      linkUrl: PropTypes.string.isRequired,
      thumbnailUrl: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired,
      isLiked: PropTypes.bool.isRequired
    })
  ).isRequired,
  maxWidth: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired
};
Gallery.defaultProps = {
}

