'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { loadUserSummary } from '../../actions/user';
import { loadUserPosts } from '../../actions/post';
import connectDataFetchers from '../../lib/connectDataFetchers';
import Summary from '../../components/Summary.jsx';
import Gallery from '../../components/Gallery.jsx';

import testdata from '../../../test/data/testdata0.json';

if (process.env.BROWSER) {
  require('styles/personal/Personal.css');
}

class Personal extends Component {
  static propTyes = {
    user: PropTypes.object.isRequired,
    posts: PropTypes.object.isRequired,
    maxWidth: PropTypes.number,
    ratio: PropTypes.number
  };

  render() {
    return (
      <div className="personal-component">
        <Summary user={this.props.user} />
        <Gallery
          posts={ testdata.personal.posts }
          maxWidth={ testdata.personal.maxWidth }
          ratio={ testdata.personal.ratio }
        />
      </div>
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
  connectDataFetchers(Personal, [ loadUserSummary, loadUserPosts ])
);
