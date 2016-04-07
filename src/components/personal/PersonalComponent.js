'use strict';

import React from 'react';
import Summary from './SummaryComponent.js';
import Gallery from '../item/GalleryComponent.js';

import testdata from '../../../test/data/testdata0.json';

require('styles/personal/Personal.css');

class PersonalComponent extends React.Component {
  render() {
    return (
      <div className="personal-component">
        <Summary />
        <Gallery
          posts={ testdata.personal.posts }
          maxWidth={ testdata.personal.maxWidth }
          ratio={ testdata.personal.ratio }
        />
      </div>
    );
  }
}

PersonalComponent.displayName = 'PersonalPersonalComponent';

// Uncomment properties you need
// PersonalComponent.propTypes = {};
// PersonalComponent.defaultProps = {};

export default PersonalComponent;
