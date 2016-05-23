'use strict';

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import { parseUsername, parseProfilePhotoUrl } from '../lib/profileParser.js';
import View from './View';
import PeopleList from './PeopleList';

if (process.env.BROWSER) {
  require('styles/item/Gallery.css');
}

export default class Gallery extends Component{
  constructor(props) {
    super(props);
    this.state = {
      containerWidth: 0,
      lastClickedPostId: ''
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

  handleClickMoreBtn = () => {
    this.props.loadMorePosts();
  }

  showLikelist = (postId) => {
    this.props.getLikelist(postId);
    this.waitUpdateLikelist(postId);
  }

  waitUpdateLikelist = (postId) => {
    setTimeout(() => {
      if(this.props.like.isFetching) {
        this.waitUpdateLikelist(postId);
      } else {
        this.setState({
          lastClickedPostId: postId
        });
        this.refs.peopleList.showList();
      }
    }, 50);
  }

  genLikelist = () => {
    const { users, userIds } = this.props.like.list;
    let list = [];
    userIds.map((id) => {
      const user = users[id].user;
      const username = parseUsername(user);
      const profilePhotoUrl = parseProfilePhotoUrl(user);
      list.push({
        username,
        profilePhotoUrl,
        id: user.sid,
        isFriend: user.followers.length > 0
      })
    });
    return list;
  }

  render() {
    const { posts, postIds, maxWidth, ratio, showAuthor, likePost, unlikePost, followUser, unfollowUser } = this.props;
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
      const { sid, thumbnail, likes, ownerInfo } = posts[id];
      const authorName = parseUsername(ownerInfo);
      const authorPhotoUrl = parseProfilePhotoUrl(ownerInfo);

      previews.push(
        <View
          key={k}
          postId={sid}
          imgUrl={thumbnail.downloadUrl}
          count={likes.count}
          isLiked={likes.isLiked}
          width={postWidth}
          height={postHeight}
          showAuthor={showAuthor}
          authorPhotoUrl={authorPhotoUrl}
          authorName={authorName}
          authorId={ownerInfo.sid}
          likePost={likePost.bind(this, sid)}
          unlikePost={unlikePost.bind(this, sid)}
          showLikelist={this.showLikelist.bind(this, sid)}
        />
      );
    });

    const { userId } = this.props;
    const likelist = this.genLikelist();
    return(
      <div className='gallery-component container-fluid'>
        <div style={{ width: wrapperWidth }} className='gallery-wrapper'>
          { previews }
        </div>
        <PeopleList
          ref='peopleList'
          list={likelist}
          userId={userId}
          followUser={followUser}
          unfollowUser={unfollowUser}
        />
        <div className='gallery-more-btn' onClick={this.handleClickMoreBtn}/>
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
  userId: PropTypes.string.isRequired,
  like: PropTypes.object.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  getLikelist: PropTypes.func.isRequired,
  loadMorePosts: PropTypes.func.isRequired,
  showAuthor: PropTypes.bool
};
Gallery.defaultProps = {
  showAuthor: false
}

