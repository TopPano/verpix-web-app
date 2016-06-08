'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

import { DEFAULT_PROFILE_PHOTO_URL } from 'constants/common';
import ViewAuthor from './ViewAuthor';
import ViewLike from './ViewLike';

if (process.env.BROWSER) {
  require('./View.css');
}

export default class View extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { postId, imgUrl, width, height, showAuthor, authorPhotoUrl, authorName, authorId, count, isLiked } = this.props;
    const { likePost, unlikePost, showLikelist } = this.props;

    return (
      <div className='view-component'>
        <Link to={'/viewer/@' + postId}>
          <img className='view-preview' src={imgUrl} width={width} height={height} alt='preview' />
        </Link>
        {showAuthor &&
          <ViewAuthor
            authorPhotoUrl={authorPhotoUrl}
            authorName={authorName}
            authorId={authorId}
          />
        }
        <ViewLike
          count={count}
          isLiked={isLiked}
          likePost={likePost}
          unlikePost={unlikePost}
          showLikelist={showLikelist}
        />
      </div>
    );
  }
}

View.displayName = 'ItemView';

View.propTypes = {
  postId: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  showLikelist: PropTypes.func.isRequired,
  showAuthor: PropTypes.bool,
  authorPhotoUrl: PropTypes.string,
  authorName: PropTypes.string,
  authorId: PropTypes.string
};
View.defaultProps = {
  showAuthor: false,
  authorPhotoUrl: DEFAULT_PROFILE_PHOTO_URL,
  authorName: 'Verpixer',
  authorId: ''
};

