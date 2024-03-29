'use strict'

import React, { Component, PropTypes } from 'react';

import PeopleList from '../PeopleList';

if (process.env.BROWSER) {
  require('./Counter.css');
}

export default class Counter extends Component {
  render() {
    const { icon, iconPosition, count, showList, list, userId, followUser, unfollowUser } = this.props

    return (
      <div className={ 'counter-component' + (iconPosition === 'counter-right' ? ' counter-right' : '') }>
        {(showList && count > 0) ?
          <PeopleList
            list={list}
            userId={userId}
            followUser={followUser}
            unfollowUser={unfollowUser}
          >
            <div className='counter-icon-wrapper'>
              <img className='counter-icon counter-icon-clickable' src={icon}/>
            </div>
            <div className='counter-count counter-count-clickable'>{count}</div>
          </PeopleList> :
          <div>
            <div className='counter-icon-wrapper'>
              <img className='counter-icon' src={icon}/>
            </div>
            <div className='counter-count'>{count}</div>
          </div>
        }
      </div>
    );
  }
}

Counter.displayName = 'Counter';

Counter.propTypes = {
  icon: PropTypes.string.isRequired,
  iconPosition: PropTypes.string,
  count: PropTypes.number,
  showList: PropTypes.bool,
  list: PropTypes.array,
  userId: PropTypes.string,
  followUser: PropTypes.func,
  unfollowUser: PropTypes.func
};

Counter.defaultProps = {
  icon: '',
  iconPosition: '',
  count: 0,
  showList: false,
  list: {},
  userId: '',
  followUser: () => {},
  unfollowUser: () => {}
};

