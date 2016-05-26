'use strict';

import React from 'react';
import { shallow } from 'enzyme';

import Brand from 'components/layouts/header/Brand';

describe('Component: Brand', () => {
  describe('#render()', () => {
    let component;

    it('img should have className "brand brand-always-show" when the prop "alwaysShow" is true', () => {
      const props = {
        alwaysShow: true
      }
      component = shallow(<Brand {...props} />);
      expect(component.find('img').get(0).props.className).to.equal('brand brand-always-show');
    });

    it('img should have className "brand" when the prop "alwaysShow" is false', () => {
      const props = {
        alwaysShow: false
      }
      component = shallow(<Brand {...props} />);
      expect(component.find('img').get(0).props.className).to.equal('brand');
    });
  });
});
