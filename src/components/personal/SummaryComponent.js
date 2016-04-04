'use strict';

import React from 'react';
import Counter from '../item/CounterComponent';
import Button from '../item/ButtonComponent';
import Profile from './ProfileComponent';

require('styles/personal/Summary.css');

class SummaryComponent extends React.Component {
  render() {
    return (
      <div className='personal-summary-component container-fluid'>
        <div className='personal-summary-main'>
          <div className='personal-summary-profilebg' />
          <div className='personal-summary-profile'>
            <div className='personal-summary-profile-left'>
              <Counter
                icon={ '../../images/personal/personal-counter-post.png' }
                initialCount={ 3000 }
              />
              <Counter
                icon={ '../../images/personal/personal-counter-like.png' }
                initialCount={ 999 }
              />
            </div>
            <Profile
              initialProfileUrl={ 'http://imgs.tuts.dragoart.com/how-to-draw-a-cartoon-jellyfish_1_000000002605_5.jpg' }
            />
            <div className='personal-summary-profile-right'>
              <Counter
                icon={ '../../images/personal/personal-counter-follower.png' }
                initialCount={ 4 }
                isIconRight
              />
              <Button
                initialIsClicked={ false }
                text={ 'follow' }
                textClicked={ 'unfollow' }
              />
            </div>
          </div>
          <div className='personal-summary-name'>{ 'HAWK LIN' }</div>
        </div>
      </div>
    );
  }
}

SummaryComponent.displayName = 'PersonalSummaryComponent';

// Uncomment properties you need
// SummaryComponent.propTypes = {};
// SummaryComponent.defaultProps = {};

export default SummaryComponent;
