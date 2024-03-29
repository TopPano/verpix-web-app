'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import toInteger from 'lodash/toInteger';
import merge from 'lodash/merge';
import trim from 'lodash/trim';
import replace from 'lodash/replace';
import CopyToClipboard from 'react-copy-to-clipboard';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import Modal from 'react-bootstrap/lib/Modal';
import FacebookLogin from 'react-facebook-login';

import PeopleList from 'components/Common/PeopleList';
import { parseUsername, parseProfilePhotoUrl, genLikelist } from 'lib/utils';
import { shareTwitter, shareFacebook } from './share';
import { isMobile } from 'lib/devices';
import externalApiConfig from 'etc/external-api'

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
const HELP_LIST = [
  {
    img: '/static/images/sidebar/help-look-{$device}.svg',
    desc: 'Look Around'
  },
  {
    img: '/static/images/sidebar/help-zoom-{$device}.svg',
    desc: 'Zoom In/Out'
  },
  {
    img: '/static/images/sidebar/help-click-{$device}.svg',
    desc: '(X1) Hide/Show'
  },
  {
    img: '/static/images/sidebar/help-click-{$device}.svg',
    desc: '(X2) FullScreen'
  }
];
const URL_UPDATE_RATE = 16;
const IFRAME_MIN_WIDTH = 240;
const IFRAME_MIN_HEIGHT = 160;

var urlUpdater;

if (process.env.BROWSER) {
  require('./Sidebar.css');
}

const propTypes = {
  post: PropTypes.object.isRequired,
  likelist: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired,
  getLikelist: PropTypes.func.isRequired,
  getLikelist: PropTypes.func.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired,
  shareParams: PropTypes.object.isRequired,
  getSnapshot: PropTypes.func.isRequired,
  getCurrentUrl: PropTypes.func.isRequired
};

const defaultProps = {
};

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: NON_CLICKED,
      isInTransitioned: false,
      isHelpShown: false,
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
          '" src="' + this.props.getCurrentUrl() +
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
    shareTwitter(this.props.getCurrentUrl());
  }

  handleShareFacebookWithPermission = (response) => {
    this.shareFacebookCaller(() => {
      return this.props.getSnapshot(response.accessToken);
    });
  }

  handleShareFacebookWithoutPermission = () => {
    this.shareFacebookCaller(this.props.getSnapshot);
  }

  shareFacebookCaller = (getSnapshot) => {
    const { post, shareParams } = this.props;
    const opts = {
      linkUrl: this.props.getCurrentUrl(),
      caption: trim(post.caption) ? trim(post.caption) : shareParams.defaultCaption,
      description: shareParams.defaultDescription
    }
    shareFacebook(opts, getSnapshot);
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

  showHelp = () => {
    this.setState({
      isHelpShown: true
    });
  }

  hideHelp = () => {
    this.setState({
      isHelpShown: false
    });
  }

  // Transfrom the date to our format.
  transDateFormat(dateRaw) {
    let date = new Date(dateRaw);
    return date.getUTCFullYear() + '/' +
        (date.getUTCMonth() + 1) + '/' +
        date.getUTCDate() + ' ' +
        date.getUTCHours() + ':' +
        date.getUTCMinutes();
  }

  render() {
    const { post, userId, likelist, shareParams, likePost, unlikePost, followUser, unfollowUser } = this.props;
    const { clicked, isInTransitioned, isHelpShown, shareLink } = this.state;
    const showContent = (clicked !== NON_CLICKED) && (clicked !== 1);
    let icons = [], contents = [], helpList = [];

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

    const name = parseUsername(post.owner),
          profilePhotoUrl = parseProfilePhotoUrl(post.owner),
          date = this.transDateFormat(post.created),
          ownerId = post.owner.sid;
    contents.push(
      <div className={'sidebar-content sidebar-info' + (clicked === 0 && !isInTransitioned ? ' sidebar-shown' : '')}>
        <div className='sidebar-info-upper'>
          <Link to={'@' + ownerId}><img className='sidebar-info-photo' src={profilePhotoUrl} /></Link>
          <div className='sidebar-info-title'>
            <Link to={'@' + ownerId} className='sidebar-info-name text-single-line'>{name}</Link>
            <div className='sidebar-info-date text-single-line'>{date}</div>
          </div>
        </div>
        <textarea className='sidebar-info-caption' readOnly value={post.caption} />
      </div>
    );
    contents.push(
      <div />
    );
    const copiedTooltip = <Tooltip>{'Copied!'}</Tooltip>
    contents.push(
      <div className={'sidebar-content sidebar-share' + (clicked === 2 && !isInTransitioned ? ' sidebar-shown' : '')}>
        <div className='sidebar-share-btnlist'>
          <FacebookLogin
            appId={externalApiConfig.facebook.id}
            version={externalApiConfig.facebook.version}
            scope={shareParams.needFBPermission? 'publish_actions' : ''}
            callback={shareParams.needFBPermission? this.handleShareFacebookWithPermission : this.handleShareFacebookWithoutPermission}
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

    const device = isMobile() ? 'mobile' : 'desktop';
    HELP_LIST.map((help) => {
      const imgUrl = replace(help.img, '{$device}', device);
      helpList.push(
        <div className='sidebar-help-item'>
          <img className='sidebar-help-item-img' src={imgUrl} alt={help.desc} />
          <div className='sidebar-help-item-desc'>{help.desc}</div>
        </div>
      );
    });

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
        <img className='sidebar-icon sidebar-help' src='/static/images/sidebar/icon-help.png' onClick={this.showHelp}/>
        <PeopleList
          ref='peopleList'
          list={genLikelist(likelist.list)}
          userId={userId}
          followUser={followUser}
          unfollowUser={unfollowUser}
        />
        <Modal className='sidebar-help-modal' show={isHelpShown} onHide={this.hideHelp}>
          <Modal.Body>
            {helpList}
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

export default Sidebar;
