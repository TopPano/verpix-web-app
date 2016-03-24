require('normalize.css');
require('styles/App.css');

import React from 'react';
import Header from './layout/header/HeaderComponent';
import Content from './layout/content/ContentComponent';
import Footer from './layout/footer/FooterComponent';

class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <Header username={'HAWK LIN'}/>
        <Content>
          <div>Content</div>
        </Content>
        <Footer />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
