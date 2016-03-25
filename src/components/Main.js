require('normalize.css');
require('styles/App.css');

import React from 'react';
import Header from './layout/header/HeaderComponent';
import Content from './layout/content/ContentComponent';
import Footer from './layout/footer/FooterComponent';

import View from './item/ViewComponent';

class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <Header username={ 'HAWK LIN' }/>
        <Content>
          <View
            linkUrl={ 'http://www.google.com' }
            imgUrl={ 'https://perryponders.files.wordpress.com/2015/06/20090907230522_jelly-fish-1.jpg' }
            initialCount={ 999 }
            initialIsLiked={ false }
          />
        </Content>
        <Footer />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
