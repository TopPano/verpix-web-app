'use strict';

import React from 'react';

require('styles/item/Counter.css');

class CounterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: props.initialCount
    };
  }
  addCounter(toAdd) {
    this.setState({
      count: this.state.count + toAdd
    });
  }
  setCounter(count) {
    this.setState({
      count: count
    });
  }
  render() {
    return (
      <div className={ 'counter-component' + (this.props.isIconRight ? ' counter-right' : '') }>
        <div className='counter-icon-wrapper'>
          <img className='counter-icon' src={ this.props.icon }/>
        </div>
        <div className='counter-count'>{ this.state.count }</div>
      </div>
    );
  }
}

CounterComponent.displayName = 'ItemCounterComponent';

CounterComponent.propTypes = {
  icon: React.PropTypes.string.isRequired,
  isIconRight: React.PropTypes.bool,
  initialCount: React.PropTypes.number.isRequired
};
CounterComponent.defaultProps = {
  icon: '',
  isIconRight: false,
  initialCount: 0
};

export default CounterComponent;
