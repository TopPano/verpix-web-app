'use strict';

import React, { Component, PropTypes } from 'react';

import { parseUsername, parseProfilePhotoUrl, genLikelist } from 'lib/utils';
import View from './View';
import PeopleList from '../PeopleList';
import { MEDIA_TYPE, ORIENTATION } from 'constants/common';

if (process.env.BROWSER) {
  require('./Gallery.css');
}

const propTypes = {
  posts: PropTypes.object.isRequired,
  postIds: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
  like: PropTypes.object.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  getLikelist: PropTypes.func.isRequired,
  hasMorePosts: PropTypes.func.isRequired,
  loadMorePosts: PropTypes.func.isRequired,
  showAuthor: PropTypes.bool
}

const defaultProps = {
  showAuthor: false
}

class Gallery extends Component{
  constructor(props) {
    super(props);
    this.state = {
      lastClickedPostId: '',
      shouldShowMoreBtn: true
    };
  }

  handleClickMoreBtn = () => {
    this.props.loadMorePosts();
    this.setState({
      shouldShowMoreBtn: false
    });
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

  render() {
    const { posts, postIds, like, showAuthor, likePost, unlikePost, followUser, unfollowUser, hasMorePosts } = this.props;
    let previews = [];

    postIds.map((id) => {
      const { sid, mediaType, thumbnail, dimension, likes, owner } = posts[id];
      const orientation =
          (mediaType === MEDIA_TYPE.LIVE_PHOTO && dimension.orientation === ORIENTATION.PORTRAIT) ?
          ORIENTATION.PORTRAIT :
          ORIENTATION.LANDSCAPE;
      const authorName = parseUsername(owner);
      const authorPhotoUrl = parseProfilePhotoUrl(owner);

      previews.push(
        <View
          key={sid}
          postId={sid}
          imgUrl={thumbnail.downloadUrl}
          orientation={orientation}
          count={likes.count}
          isLiked={likes.isLiked}
          showAuthor={showAuthor}
          authorPhotoUrl={authorPhotoUrl}
          authorName={authorName}
          authorId={owner.sid}
          likePost={likePost.bind(this, sid)}
          unlikePost={unlikePost.bind(this, sid)}
          showLikelist={this.showLikelist.bind(this, sid)}
        />
      );
    });

    const { userId } = this.props;
    const likelist = genLikelist(like.list);
    const showMoreBtn = this.state.shouldShowMoreBtn && hasMorePosts();
    return(
      <div className="gallery-component container-fluid">
        <div className="gallery-wrapper">
          { previews }
        </div>
        <PeopleList
          ref="peopleList"
          list={likelist}
          userId={userId}
          followUser={followUser}
          unfollowUser={unfollowUser}
        />
        {showMoreBtn &&
          <div className="gallery-more-btn" onClick={this.handleClickMoreBtn}>{'more'}</div>
        }
      </div>
    );
  }
}

Gallery.propTypes = propTypes;
Gallery.defaultProps = defaultProps;

export default Gallery;
