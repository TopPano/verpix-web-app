require('normalize.css');
require('styles/App.css');

import React from 'react';
import Header from './layout/header/HeaderComponent';
import Content from './layout/content/ContentComponent';
import Footer from './layout/footer/FooterComponent';

import Gallery from './item/GalleryComponent';
import Button from './item/ButtonComponent';

import testdata from '../../test/data/testdata0.json';

class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <Header username={ testdata.user.username }/>
        <Content>
          <Button
            initialIsClicked={ true }
            text={ 'follow' }
            textClicked={ 'unfollow' }
            callbackToClicked={ () => { console.log('follow me'); } }
            callbackToUnclicked={ () => { console.log('unfollow me'); } }
          />
          <Gallery
            posts={ testdata.personal.posts }
            maxWidth={ testdata.personal.maxWidth }
            ratio={ testdata.personal.ratio }
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
