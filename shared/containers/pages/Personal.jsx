'use strict';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import connectDataFetchers from '../../lib/connectDataFetchers';
import { loadUserSummary } from '../../actions/user';
import { loadUserPosts } from '../../actions/post';
import Personal from '../../components/Personal.jsx';

class PersonalPageContainer extends Component {
  static propTyes = {
    person: PropTypes.object.isRequired,
    children: PropTypes.object
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { posts } = this.props.person;
    // Determine: need to read more posts or not.
    if(posts.hasNext) {
      var offset = window.scrollY + window.innerHeight;
      var height = document.documentElement.offsetHeight;

      // Scroll to the bottom?
      if(offset === height) {
        const { params, dispatch } = this.props;
        dispatch(loadUserPosts({
          userId: params.id,
          lastPostId: posts.lastPostId
        }));
      }
    }
  }

  render() {
    return (
      <Personal person={this.props.person}>
        {this.props.children}
      </Personal>
    );
  }
}

Personal.displayName = 'Personal';

function mapStateToProps(state) {
  const { person } = state;
  return {
    person
  }
}

export default connect(mapStateToProps)(
  connectDataFetchers(PersonalPageContainer, [ loadUserSummary, loadUserPosts ])
);
