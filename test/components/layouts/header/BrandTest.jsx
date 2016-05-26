'use strict';

import createComponent from 'helpers/shallowRenderHelper';

import Brand from 'components/layouts/header/Brand';

describe('Component: Brand', () => {
  describe('#render()', () => {
    let component;

    it('img should have className "brand brand-always-show" when the prop "alwaysShow" is true', () => {
      const props = {
        alwaysShow: true
      }
      component = createComponent(Brand, props);
      expect(component.props.children.props.className).to.equal('brand brand-always-show');
    });

    it('img should have className "brand" when the prop "alwaysShow" is false', () => {
      const props = {
        alwaysShow: false
      }
      component = createComponent(Brand, props);
      expect(component.props.children.props.className).to.equal('brand');
    });
  });
});
