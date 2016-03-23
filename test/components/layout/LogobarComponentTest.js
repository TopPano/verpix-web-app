/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0 */
'use strict';

// Uncomment the following lines to use the react test utilities
// import TestUtils from 'react-addons-test-utils';
import createComponent from 'helpers/shallowRenderHelper';

import LogobarComponent from 'components/layout/LogobarComponent.js';

describe('LogobarComponent', () => {
  let component;

  beforeEach(() => {
    component = createComponent(LogobarComponent);
  });

  it('should have its component name as default className', () => {
    expect(component.props.className).to.equal('logobar-component');
  });
});
