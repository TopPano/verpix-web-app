'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

if (process.env.BROWSER) {
  require('./ViewAuthor.css');
}

const propTypes = {
  authorPhotoUrl: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired
}

const defaultProps = {
}

export default class ViewAuthor extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { authorPhotoUrl, authorName, authorId } = this.props;
    return (
      <div className="view-author-component">
        <Link to={'/@' + authorId}><img className="view-author-photo" src={authorPhotoUrl}/></Link>
        <Link to={'/@' + authorId} className="view-author-name">{authorName}</Link>
      </div>
    );
  }
}

ViewAuthor.propTypes = propTypes;
ViewAuthor.defaultProps = defaultProps;

export default ViewAuthor;
