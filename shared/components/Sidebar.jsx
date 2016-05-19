'use strict';

import React, { Component, PropTypes } from 'react';

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

if (process.env.BROWSER) {
  require('styles/Sidebar.css');
}

export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: NON_CLICKED,
      isInTransitioned: false
    }
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

  likePost = () => {}
  showLikelist = () => {}

  render() {
    const { clicked, isInTransitioned } = this.state;
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

    contents.push(
      <div className={'sidebar-content sidebar-info' + (clicked === 0 && !isInTransitioned ? ' sidebar-shown' : '')}>
        <div className='sidebar-info-upper'>
          <img className='sidebar-info-photo' src='https://upload.wikimedia.org/wikipedia/commons/0/02/Fried_egg,_sunny_side_up.jpg' />
          <div className='sidebar-info-title'>
            <div className='sidebar-info-name text-single-line'>{'hawk lin'}</div>
            <div className='sidebar-info-date text-single-line'>{'2015/6/3 6:6'}</div>
          </div>
        </div>
        <textarea className='sidebar-info-caption' readOnly value={'hahaha hahaha'} />
      </div>
    );
    contents.push(
      <div />
    );
    contents.push(
      <div className={'sidebar-content sidebar-share' + (clicked === 2 && !isInTransitioned ? ' sidebar-shown' : '')}>
        <div className='sidebar-share-btnlist'>
          <div className='sidebar-share-btn sidebar-share-facebook' />
          <div className='sidebar-share-btn sidebar-share-twitter' />
          <div className='sidebar-share-btn sidebar-share-copy' />
        </div>
        <div className='sidebar-share-inputs'>
          <input type='text' value='240' placeholder='width' />
          <span className='sidebar-share-multiply'>{'X'}</span>
          <input type='text' value='160' placeholder='height' />
        </div>
        <textarea className='sidebar-share-link' readOnly defaultValue={'kerkerker'} />
      </div>
    );

    return (
      <div className='sidebar-component'>
        <div className='sidebar-like'>
          <span className='sidebar-like-count' onClick={this.showLikelist}>9999</span>
          <img className='sidebar-icon' src='/static/images/view/likebtn.png' onClick={this.likePost}/>
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
      </div>
    );
  }
}

Sidebar.displayName = 'Sidebar';

Sidebar.propTypes = {
  post: PropTypes.object.isRequired
};
Sidebar.defaultProps = {
};

