'use strict';

import React from 'react';

require('styles/item/View.css');

class ViewComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state =  {
      count: props.initialCount,
      isLiked: props.initialIsLiked
    };
  }
  handleLikebtnClick = () => {
    this.setState({
      count: !this.state.isLiked ?
        this.state.count + 1 :
        this.state.count - 1,
      isLiked: !this.state.isLiked
    });
  }
  render() {
    return (
      <div className='view-component'>
        <a href={ this.props.linkUrl }><img className='view-preview' src={ this.props.imgUrl } alt='preview' /></a>
        <div className='view-like'>
          <div className='view-count'>{ this.state.count }</div>
          <img
            className='view-likebtn'
            onClick={ this.handleLikebtnClick }
            src={ this.state.isLiked ? '../../images/view/likebtn-clicked.png' : '../../images/view/likebtn.png' }
          />
        </div>
      </div>
    );
  }
}

ViewComponent.displayName = 'ItemViewComponent';

ViewComponent.propTypes = {
  linkUrl: React.PropTypes.string.isRequired,
  imgUrl: React.PropTypes.string.isRequired,
  initialCount: React.PropTypes.number.isRequired,
  initialIsLiked: React.PropTypes.bool.isRequired
};
ViewComponent.defaultProps = {
  linkUrl: '',
  imgUrl: '',
  initialCount: 0,
  initialIsLiked: false
};

export default ViewComponent;
