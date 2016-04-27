'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import connectDataFetchers from '../../lib/connectDataFetchers';
import { loadUserSummary } from '../../actions/user';
import { loadUserPosts } from '../../actions/post';
import Personal from '../../components/Personal.jsx';

class PersonalPageContainer extends Component {
  static propTyes = {
    user: PropTypes.object.isRequired,
    children: PropTypes.object
  };

  render() {
    return (
      <Personal user={this.props.user}>
        {this.props.children}
      </Personal>
    );
  }
}

Personal.displayName = 'Personal';

function mapStateToProps(state) {
  const { person } = state;
  return {
    user: person
  }
}

export default connect(mapStateToProps)(
  connectDataFetchers(PersonalPageContainer, [ loadUserSummary, loadUserPosts ])
);
