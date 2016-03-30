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
        <img className='counter-icon' src={ this.props.icon }/>
        <div className='counter-count'>{ this.state.count }</div>
      </div>
    );
  }
}

CounterComponent.displayName = 'ItemCounterComponent';

CounterComponent.propTypes = {
  icon: React.PropTypes.string.isRequired,
  isIconRight: React.PropTypes.bool.isRequired,
  initialCount: React.PropTypes.number.isRequired
};
CounterComponent.defaultProps = {
  icon: '',
  isIconRight: true,
  initialCount: 0
};

export default CounterComponent;
