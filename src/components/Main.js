require('normalize.css');
require('styles/App.css');

import React from 'react';
import Header from './layout/header/HeaderComponent';
import Content from './layout/content/ContentComponent';
import Personal from './personal/PersonalComponent';
import Footer from './layout/footer/FooterComponent';

import testdata from '../../test/data/testdata0.json';

class AppComponent extends React.Component {
  componentDidMount() {
  }
  render() {
    return (
      <div>
        <Header username={ testdata.user.username }/>
        <Content>
          <Personal />
        </Content>
        <Footer />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
