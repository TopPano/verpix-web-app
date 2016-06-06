'use strict';

import React from 'react';
import Link from './Link';

if (process.env.BROWSER) {
  require('./List.css');
}

class ListComponent extends React.Component {
  render() {
    return (
      <div className="footer-list-component">
        <Link url={'#'} label={'Terms of Use'} />
        <Link url={'#'} label={'About Verpix'} />
        <Link url={'#'} label={'Services'} />
        <Link url={'#'} label={'Contact'} />
      </div>
    );
  }
}

ListComponent.displayName = 'LayoutFooterListComponent';

// Uncomment properties you need
// ListComponent.propTypes = {};
// ListComponent.defaultProps = {};

export default ListComponent;
