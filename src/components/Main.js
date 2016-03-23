require('normalize.css');
require('styles/App.css');

import React from 'react';
import Logobar from './layout/LogobarComponent';

class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <Logobar />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
