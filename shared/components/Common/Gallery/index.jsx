'use strict';

import React, { Component, PropTypes } from 'react';
import clone from 'lodash/clone';

import { createFixedArray, parseUsername, parseProfilePhotoUrl, genLikelist } from 'lib/utils';
import View from './View';
import PeopleList from '../PeopleList';
import { MEDIA_TYPE, ORIENTATION } from 'constants/common';
import { GALLERY_BOUNDARY } from 'constants/gallery';

if (process.env.BROWSER) {
  require('./Gallery.css');
}

const propTypes = {
  posts: PropTypes.object.isRequired,
  postIds: PropTypes.array.isRequired,
  hasNext: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired,
  like: PropTypes.object.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  getLikelist: PropTypes.func.isRequired,
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
      numOfDivs: 0
    };
  }

  // Divide post IDs into multiple sub divisions which have almost equal heights.
  dividePostIds(postIds, numDivs) {
    const { posts, hasNext } = this.props;
    let oldPostIds = clone(postIds);
    let portraitPostIds = [];
    let dividedPostIds = createFixedArray([], numDivs);
    let heights = createFixedArray(0, numDivs);
    let needPush = createFixedArray(true, numDivs);
    let curIndex = 0;
    let heightest = 0;

    // Find all portrait posts.
    oldPostIds.forEach((id) => {
      if(this.isPortrait(posts[id])) {
        portraitPostIds.push(id);
      }
    });
    // Handling for there is a "single" portrait post.
    if(portraitPostIds.length % 2 === 1) {
      // If there are still posts to load, do not show it as this time;
      // otherwise, place it at the last position.
      const lastPortraitPostId = portraitPostIds.pop();
      oldPostIds.splice(oldPostIds.indexOf(lastPortraitPostId), 1);
      if(!hasNext) {
        oldPostIds.push(lastPortraitPostId);
        portraitPostIds.push(lastPortraitPostId);
      }
    }

    // Start to divide post IDs.
    while(oldPostIds.length > 0) {
      if(needPush[curIndex]) {
        const postId = oldPostIds.shift();
        if(!this.isPortrait(posts[postId])) {
          // For landscape post, just push it to current division.
          dividedPostIds[curIndex].push(postId);
          heights[curIndex] += 1;
        } else {
          portraitPostIds.shift();
          if(portraitPostIds.length > 0) {
            // For portrait post, push it and next portrait post (if existed) as peer to current division.
            const peerPostId = portraitPostIds.shift();
            oldPostIds.splice(oldPostIds.indexOf(peerPostId), 1);
            dividedPostIds[curIndex].push(postId);
            dividedPostIds[curIndex].push(peerPostId);
            heights[curIndex] += 2;
          } else {
            if(!hasNext) {
              // If no peer portrait post and no next posts to load,
              // the single portrait post will be at last position,
              // just push it.
              dividedPostIds[curIndex].push(postId);
            } else if(oldPostIds.length > 0) {
              // Otherwise, push next landscape.
              dividedPostIds[curIndex].push(oldPostIds.shift());
            }
          }
        }
        // Update heightest.
        heightest = (heightest < heights[curIndex]) ? heights[curIndex] : heightest;
      }

      if(curIndex < numDivs - 1) {
        // Not the end of a loop, just increase index.
        curIndex++;
      } else {
        // The end of a loop, update "needPush" array and reset index, heightest.
        let allHeightsEqual = true;
        for(let i = 0; i < numDivs - 1;i++) {
          if(heights[i] != heights[i + 1]) {
            allHeightsEqual = false;
            break;
          }
        }
        if(allHeightsEqual) {
          needPush = createFixedArray(true, numDivs);
        } else {
          needPush = heights.map((height) => {
            return (height === heightest) ? false : true;
          });
        }
        curIndex = 0;
        heightest = 0;
      }
    }

    return dividedPostIds;
  }

  getOrientation(post) {
    const { mediaType, dimension } = post;
    return (
      (mediaType === MEDIA_TYPE.LIVE_PHOTO && dimension.orientation === ORIENTATION.PORTRAIT) ?
      ORIENTATION.PORTRAIT :
      ORIENTATION.LANDSCAPE
    );
  }

  isPortrait(post) {
    return this.getOrientation(post) === ORIENTATION.PORTRAIT;
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

  calculateNumOfDivs() {
    return window.innerWidth > GALLERY_BOUNDARY ? 2 : 1;
  }

  componentDidMount() {
    this.setState({
      numOfDivs: this.calculateNumOfDivs()
    });
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
     window.removeEventListener('resize', this.handleWindowResize, false);
  }

  handleWindowResize = () => {
    const numOfDivs = this.calculateNumOfDivs();
    if(numOfDivs != this.state.numOfDivs) {
      this.setState({ numOfDivs });
    }
  }

  handleClickMoreBtn = () => {
    this.props.loadMorePosts();
  }

  render() {
    const { posts, postIds, hasNext, like, showAuthor, likePost, unlikePost, followUser, unfollowUser } = this.props;
    const { numOfDivs } = this.state;
    let dividedPreviews = [];

    if(numOfDivs > 0) {
      const dividedPostIds = this.dividePostIds(postIds, numOfDivs);
      dividedPostIds.forEach((postIds) => {
        let previews = [];

        postIds.map((id) => {
          const { sid, thumbnail, likes, owner, mediaType } = posts[id];
          const orientation = this.getOrientation(posts[id]);
          const authorName = parseUsername(owner);
          const authorPhotoUrl = parseProfilePhotoUrl(owner);

          previews.push(
            <View
              key={sid}
              postId={sid}
              type={mediaType}
              orientation={orientation}
              imgUrl={thumbnail.downloadUrl}
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

        dividedPreviews.push(
          <div className="gallery-sub" >
            {previews}
          </div>
        );
      });
    }

    const { userId } = this.props;
    const likelist = genLikelist(like.list);
    return(
      <div className="gallery-component container-fluid">
        <div className="gallery-wrapper">
          {dividedPreviews}
        </div>
        <PeopleList
          ref="peopleList"
          list={likelist}
          userId={userId}
          followUser={followUser}
          unfollowUser={unfollowUser}
        />
        {hasNext &&
          <div className="gallery-more-btn" onClick={this.handleClickMoreBtn}>{'more'}</div>
        }
      </div>
    );
  }
}

Gallery.propTypes = propTypes;
Gallery.defaultProps = defaultProps;

export default Gallery;
