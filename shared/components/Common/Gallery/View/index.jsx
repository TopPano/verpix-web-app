'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import { DEFAULT_PROFILE_PHOTO_URL } from 'constants/common';
import ViewAuthor from './ViewAuthor';
import ViewLike from './ViewLike';
import { ORIENTATION } from 'constants/common';

if (process.env.BROWSER) {
  require('./View.css');
}

const propTypes = {
  postId: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  orientation: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  showLikelist: PropTypes.func.isRequired,
  showAuthor: PropTypes.bool,
  authorPhotoUrl: PropTypes.string,
  authorName: PropTypes.string,
  authorId: PropTypes.string
}

const defaultProps = {
  showAuthor: false,
  authorPhotoUrl: DEFAULT_PROFILE_PHOTO_URL,
  authorName: 'Verpixer',
  authorId: ''
}

class View extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { postId, imgUrl, orientation, showAuthor, authorPhotoUrl, authorName, authorId, count, isLiked } = this.props;
    const { likePost, unlikePost, showLikelist } = this.props;
    const viewClass = classNames({
      'view-component': true,
      'view-portrait': orientation === ORIENTATION.PORTRAIT
    });
    const previewClass = classNames({
      'view-preview': true,
      'view-preview-portrait': orientation === ORIENTATION.PORTRAIT
    });

    return (
      <div className={viewClass}>
        <Link className="view-preview-wrapper" to={'/viewer/@' + postId}>
          <img className={previewClass} src={imgUrl} alt="preview" />
          <div className="view-preview-border" />
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

View.propTypes = propTypes;
View.defaultProps = defaultProps;

export default View;
