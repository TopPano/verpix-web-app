'use strict';

import React, { Component, PropTypes } from 'react';
import { toInteger, merge } from 'lodash';
import CopyToClipboard from 'react-copy-to-clipboard';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import FacebookLogin from 'react-facebook-login';

import PeopleList from './PeopleList';
import { parseUsername, parseProfilePhotoUrl } from '../lib/profileParser.js';
import { getCurrentUrl } from '../lib/viewer.js';
import { shareTwitter, shareFacebook } from '../lib/share.js';

const NON_CLICKED = -1;
const ICON_LIST = [
  '/static/images/sidebar/icon-info.png',
  '/static/images/sidebar/icon-map.png',
  '/static/images/sidebar/icon-share.png'
];
const ICON_CLICKED_LIST = [
  '/static/images/sidebar/icon-info-clicked.png',
  '/static/images/sidebar/icon-map-clicked.png',
  '/static/images/sidebar/icon-share-clicked.png'
];
const URL_UPDATE_RATE = 16;
const IFRAME_MIN_WIDTH = 240;
const IFRAME_MIN_HEIGHT = 160;

var urlUpdater;

if (process.env.BROWSER) {
  require('styles/Sidebar.css');
}

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: NON_CLICKED,
      isInTransitioned: false,
      shareLink: {
        width: IFRAME_MIN_WIDTH,
        height: IFRAME_MIN_HEIGHT,
        output: ''
      }
    }
  }

  componentDidMount() {
    urlUpdater = setInterval(() => {
      if(this.refs.shareLinkOutput) {
        const { shareLink } = this.state;
        const width = toInteger(shareLink.width);
        const height = toInteger(shareLink.height);
        const output =
          '<iframe' +
          ' width="' + ((isNaN(width) || width < IFRAME_MIN_WIDTH) ? IFRAME_MIN_WIDTH : width) +
          '" height="' + ((isNaN(height) || height < IFRAME_MIN_HEIGHT) ? IFRAME_MIN_HEIGHT : height) +
          '" src="' + getCurrentUrl() +
          '" style="border: none" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';
        this.setState(merge({}, this.state, {
          shareLink: {
            output: output
          }
        }));
      }
    }, 1000 / URL_UPDATE_RATE );
  }

  componentWillUnmount() {
    clearInterval(urlUpdater);
  }

  handleChangeClicked = (index) => {
    const { clicked } = this.state;
    let newClicked, needTransition = false;

    if(clicked === NON_CLICKED) {
      newClicked = index;
      needTransition = true;
    } else if(clicked === index) {
      newClicked = NON_CLICKED;
      needTransition = true;
    } else {
      newClicked = index;
      if(clicked === 1) {
        needTransition = true;
      }
    }
    if(needTransition) {
      this.setState({
        clicked: newClicked,
        isInTransitioned: true
      });
      setTimeout(() => {
        this.setState({
          isInTransitioned: false
        });
      }, 300);
    } else {
      this.setState({
        clicked: newClicked
      });
    }
  }

  handleShareLinkChange = () => {
    const { shareLinkWidth, shareLinkHeight } = this.refs;
    this.setState(merge({}, this.state, {
      shareLink: {
        width: shareLinkWidth.value,
        height: shareLinkHeight.value
      }
    }));
  }

  handleCopiedLink = () => {
    this.refs.copiedOverlayTrigger.show();
  }

  handleShareTwitter = () => {
    shareTwitter(getCurrentUrl());
  }

  handleShareFacebook = (response) => {
    shareFacebook(response.accessToken, {
      link: getCurrentUrl(),
      caption: this.props.post.caption
    });
  }

  genLikelist = () => {
    const { users, userIds } = this.props.likelist.list;
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

  showLikelist = () => {
    this.props.getLikelist();
    this.waitUpdateLikelist();
  }

  waitUpdateLikelist = () => {
    setTimeout(() => {
      if(this.props.likelist.isFetching) {
        this.waitUpdateLikelist();
      } else {
        this.refs.peopleList.showList();
      }
    }, 50);
  }

  render() {
    const { post, userId, likePost, unlikePost, followUser, unfollowUser } = this.props;
    const { clicked, isInTransitioned, shareLink } = this.state;
    const showContent = (clicked !== NON_CLICKED) && (clicked !== 1);
    let icons = [], contents = [];

    ICON_LIST.map((icon, k) => {
      const iconClicked = ICON_CLICKED_LIST[k];
      icons.push(
        <img
          key={k}
          className='sidebar-icon'
          src={clicked === k ? iconClicked : icon}
          onClick={this.handleChangeClicked.bind(this, k)}
        />
      );
    });

    const copiedTooltip = <Tooltip>{'Copied!'}</Tooltip>
    contents.push(
      <div className={'sidebar-content sidebar-info' + (clicked === 0 && !isInTransitioned ? ' sidebar-shown' : '')}>
        <div className='sidebar-info-upper'>
          <img className='sidebar-info-photo' src='https://upload.wikimedia.org/wikipedia/commons/0/02/Fried_egg,_sunny_side_up.jpg' />
          <div className='sidebar-info-title'>
            <div className='sidebar-info-name text-single-line'>{'hawk lin'}</div>
            <div className='sidebar-info-date text-single-line'>{'2015/6/3 6:6'}</div>
          </div>
        </div>
        <textarea className='sidebar-info-caption' readOnly value={post.caption} />
      </div>
    );
    contents.push(
      <div />
    );
    contents.push(
      <div className={'sidebar-content sidebar-share' + (clicked === 2 && !isInTransitioned ? ' sidebar-shown' : '')}>
        <div className='sidebar-share-btnlist'>
          <FacebookLogin
            appId='589634317860022'
            version={'2.6'}
            scope={'publish_actions'}
            callback={this.handleShareFacebook}
            cssClass='sidebar-share-btn sidebar-share-facebook'
            textButton=''
          />
          <div className='sidebar-share-btn sidebar-share-twitter' onClick={this.handleShareTwitter} />
          <OverlayTrigger ref='copiedOverlayTrigger' rootClose trigger={'click'} placement={'top'} overlay={copiedTooltip}>
            <CopyToClipboard text={shareLink.output} onCopy={this.handleCopiedLink}>
              <div className='sidebar-share-btn sidebar-share-copy' />
            </CopyToClipboard>
          </OverlayTrigger>
        </div>
        <div className='sidebar-share-inputs'>
          <input ref='shareLinkWidth' type='text' value={shareLink.width} onChange={this.handleShareLinkChange} placeholder='width' />
          <span className='sidebar-share-multiply'>{'X'}</span>
          <input ref='shareLinkHeight' type='text' value={shareLink.height} onChange={this.handleShareLinkChange} placeholder='height' />
        </div>
        <textarea ref='shareLinkOutput' className='sidebar-share-link' disabled value={shareLink.output} />
      </div>
    );

    return (
      <div className='sidebar-component'>
        <div className='sidebar-like'>
          {post.likes.count > 0 ?
            <span className='sidebar-like-count sidebar-like-count-clickable' onClick={this.showLikelist}>{post.likes.count}</span> :
            <span className='sidebar-like-count'>{post.likes.count}</span>
          }
          <img
            className='sidebar-icon'
            src={post.likes.isLiked ? '/static/images/view/likebtn-clicked.png' : '/static/images/view/likebtn.png'}
            onClick={post.likes.isLiked ? unlikePost : likePost}
          />
        </div>
        <div className='sidebar-main'>
          <div className={'sidebar-content-wrapper' + (showContent ? ' sidebar-shown' : '')}>
            {showContent && contents[clicked]}
          </div>
          <div className='sidebar-iconlist'>
            {icons}
          </div>
        </div>
        <img className='sidebar-icon sidebar-help' src='/static/images/sidebar/icon-help.png'/>
        <PeopleList
          ref='peopleList'
          list={this.genLikelist()}
          userId={userId}
          followUser={followUser}
          unfollowUser={unfollowUser}
        />
      </div>
    );
  }
}

Sidebar.displayName = 'Sidebar';

Sidebar.propTypes = {
  post: PropTypes.object.isRequired,
  likelist: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  getLikelist: PropTypes.func.isRequired,
  getLikelist: PropTypes.func.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired
};
Sidebar.defaultProps = {
};

