require('normalize.css');
require('styles/App.css');

import React from 'react';
import Header from './layout/header/HeaderComponent';
import Content from './layout/content/ContentComponent';
import Footer from './layout/footer/FooterComponent';

import Gallery from './item/GalleryComponent';
import Button from './item/ButtonComponent';
import Counter from './item/CounterComponent';
import Summary from './personal/SummaryComponent';

import testdata from '../../test/data/testdata0.json';

class AppComponent extends React.Component {
  componentDidMount() {
    this.refs.counterPost.addCounter(-10);
    this.refs.counterPost.setCounter(55);
  }
  render() {
    return (
      <div>
        <Header username={ testdata.user.username }/>
        <Content>
          <Summary />
          <Button
            initialIsClicked={ true }
            text={ 'follow' }
            textClicked={ 'unfollow' }
            callbackToClicked={ () => { console.log('follow me'); } }
            callbackToUnclicked={ () => { console.log('unfollow me'); } }
          />
          <Counter
            ref='counterPost'
            icon={ 'images/personal/personal-counter-post.png' }
            isIconRight={ true }
            initialCount={ 99 }
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
