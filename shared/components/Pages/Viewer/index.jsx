'use strict';

import React, { Component, PropTypes } from 'react';

import { isIframe } from 'lib/devices';
import Panorama from './Panorama';
import LivePhoto from './LivePhoto';
import Sidebar from './Sidebar';

if(process.env.BROWSER) {
  require('./Viewer.css');
}

const propTypes = {
  post: PropTypes.object.isRequired,
  likelist: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  getLikelist: PropTypes.func.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired
};

const defaultProps = {
};

export default class Viewer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const player =
        this.props.post.mediaType === 'panoPhoto' ?
        <Panorama {...this.props} /> :
        <LivePhoto {...this.props} />;

    return (
      <div className="viewer-component">
        <div className='viewer-wrapper'>
          {player}
          { !isIframe() && <Sidebar {...this.props} /> }
        </div>
      </div>
    );
  }
}

Viewer.propTypes = propTypes;
Viewer.defaultProps = defaultProps;

export default Viewer;
