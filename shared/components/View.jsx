'use strict';

import React, { Component, PropTypes } from 'react';

import ViewAuthor from './ViewAuthor.jsx';
import ViewLike from './ViewLike.jsx';

if (process.env.BROWSER) {
  require('styles/item/View.css');
}

export default class View extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { linkUrl, imgUrl, width, height, showAuthor, authorPhotoUrl, authorName, authorId, count, isLiked } = this.props;

    return (
      <div className='view-component'>
        <a href={linkUrl}>
          <img className='view-preview' src={imgUrl} width={width} height={height} alt='preview' />
        </a>
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
        />
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
  count: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  showAuthor: PropTypes.bool,
  authorPhotoUrl: PropTypes.string,
  authorName: PropTypes.string,
  authorId: PropTypes.string
};
View.defaultProps = {
  linkUrl: '',
  imgUrl: '',
  count: 0,
  isLiked: false,
  width: 500,
  height: 250,
  showAuthor: false,
  authorPhotoUrl: '/static/images/profile-photo-default.png',
  authorName: 'Verpixer',
  authorId: ''
};

