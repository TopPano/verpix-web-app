'use strict';

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Modal from 'react-bootstrap/lib/Modal';

import Button from '../Button';

if (process.env.BROWSER) {
  require('./PeopleList.css');
}

export default class PeopleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      peopleList: []
    }
  }

  genPeopleList() {
    const { list, userId, followUser, unfollowUser } = this.props;
    let peopleList = [];

    list.map((person, k) => {
      const { id, username, profilePhotoUrl, isFriend } = person;
      // userId: id of logged-in user, id: id of the person of current page.
      const isMyself = (userId === id);
      peopleList.push(
        <div key={k} className='people-list-item'>
          <Link to={'/@' + id} onClick={this.hideList}><img className='people-list-item-photo' src={profilePhotoUrl} /></Link>
          <Link to={'/@' + id} onClick={this.hideList} className='people-list-item-name'>{username}</Link>
          {!isMyself &&
            <Button
              isClicked={isFriend}
              textIsUnclicked={'follow'}
              textIsClicked={'unfollow'}
              handleWhenIsUnclicked={followUser.bind(this, id)}
              handleWhenIsClicked={unfollowUser.bind(this, id)}
            />
          }
        </div>
      );
    });
    return peopleList;
  }

  showList = () => {
    this.setState({
      show: true
    });
  }

  hideList = () => {
    this.setState({
      show: false
    });
  }

  render() {
    const { show } = this.state;
    const peopleList = this.genPeopleList();
    return (
      <div className='people-list-component'>
        <Modal className='people-list-modal' show={show} onHide={this.hideList}>
          <Modal.Body>
            {peopleList}
          </Modal.Body>
        </Modal>
        <div className='people-list-content' onClick={this.showList}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

PeopleList.displayName = 'PeopleList';

PeopleList.propTypes = {
  list: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
  followUser: PropTypes.func.isRequired,
  unfollowUser: PropTypes.func.isRequired
};

PeopleList.defaultProps = {
};
