import React from 'react';
import { Route } from 'react-router';

import App from './containers/App.jsx';

import MainLayout from './containers/layouts/MainLayout.jsx';

import HomePageContainer from './containers/pages/Home.jsx';
import ViewerPageContainer from './containers/pages/Viewer.jsx';
import PersonalPageContainer from './containers/pages/Personal.jsx';

export default (
  <Route component={App}>
    <Route component={MainLayout}>
      <Route component={HomePageContainer} path='/' />
      <Route component={ViewerPageContainer} path='/viewer/@:postId' />
      <Route component={PersonalPageContainer} path='/@:id' />
    </Route>
  </Route>
);
