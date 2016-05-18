'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Viewer from '../../components/Viewer';

class ViewerPageContainer extends Component {
  render() {
    const { postId } = this.props.params;
    return (
      <Viewer postId={postId} options={{}}/>
    );
  }
}

export default connect()(ViewerPageContainer);
