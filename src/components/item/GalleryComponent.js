'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import View from './ViewComponent';

require('styles/item/Gallery.css');

class GalleryComponent extends React.Component{
  constructor() {
    super();
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
    return Math.floor(el.clientWidth - parseInt(style.getPropertyValue('padding-left')) - parseInt(style.getPropertyValue('padding-right')));
  }
  render(){
    let numPerRow = Math.ceil(this.state.containerWidth / this.props.maxWidth);
    let paddingLeft = 5, paddingRight = 5;
    let postWidth =
      this.props.posts.length >= numPerRow ?
      Math.floor(this.state.containerWidth / numPerRow) - paddingLeft - paddingRight :
      this.props.maxWidth - paddingLeft - paddingRight;
    let postHeight = Math.floor(postWidth / this.props.ratio);
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
        { previews }
      </div>
    );
  }
}

GalleryComponent.displayName = 'Gallery';

GalleryComponent.propTypes = {
  posts: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      linkUrl: React.PropTypes.string.isRequired,
      imgUrl: React.PropTypes.string.isRequired,
      count: React.PropTypes.number.isRequired,
      isLiked: React.PropTypes.bool.isRequired
    })
  ).isRequired,
  maxWidth: React.PropTypes.number.isRequired,
  ratio: React.PropTypes.number.isRequired
};
GalleryComponent.defaultProps = {
}

export default GalleryComponent;
