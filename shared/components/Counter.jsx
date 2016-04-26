'use strict'

import React, { Component, PropTypes } from 'react';

if (process.env.BROWSER) {
  require('styles/item/Counter.css');
}

export default class Counter extends Component {
  render() {
    const { icon, iconPosition, count } = this.props
    return (
      <div className={ 'counter-component' + (iconPosition === 'counter-right' ? ' counter-right' : '') }>
        <div className='counter-icon-wrapper'>
          <img className='counter-icon' src={icon}/>
        </div>
        <div className='counter-count'>{count}</div>
      </div>
    );
  }
}

Counter.displayName = 'Counter';

Counter.propTypes = {
  icon: PropTypes.string.isRequired,
  iconPosition: PropTypes.string,
  count: PropTypes.number
};

Counter.defaultProps = {
  icon: '',
  iconPosition: '',
  count: 0
};

