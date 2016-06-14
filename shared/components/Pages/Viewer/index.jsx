'use strict';

import React, { Component, PropTypes } from 'react';

import { isIframe } from 'lib/devices';
import Panorama from './Panorama';
import LivePhoto from './LivePhoto';
import Sidebar from './Sidebar';
import CONTENT from 'content/viewer/en-us.json';

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
    let player, shareParams;
    if(this.props.post.mediaType === 'panoPhoto') {
      player = <Panorama ref="player" {...this.props} />;
      shareParams = {
        needFBPermission: true,
        defaultCaption: CONTENT.SHARE.PANORAMA.DEFAULT_CAPTION,
        defaultDescription: CONTENT.SHARE.PANORAMA.DEFAULT_DESCRIPTION
      }
    } else {
      player = <LivePhoto ref="player" {...this.props} />;
      shareParams = {
        needFBPermission: false,
        defaultCaption: CONTENT.SHARE.LIVE_PHOTO.DEFAULT_CAPTION,
        defaultDescription: CONTENT.SHARE.LIVE_PHOTO.DEFAULT_DESCRIPTION
      }
    }

    return (
      <div className="viewer-component">
        <div className='viewer-wrapper'>
          {player}
          { !isIframe() &&
            <Sidebar
              {...this.props}
              shareParams={shareParams}
              getSnapshot={(accessToken) => { return this.refs.player.getSnapshot(accessToken)}}
              getCurrentUrl={() => { return this.refs.player.getCurrentUrl() }}
            />
          }
        </div>
      </div>
    );
  }
}

Viewer.propTypes = propTypes;
Viewer.defaultProps = defaultProps;

export default Viewer;
