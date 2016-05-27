'use strict';

import React from 'react';
import { shallow } from 'enzyme';
import { merge, mount } from 'lodash';

import Button from 'components/Button';

describe('component: Button', () => {
  const DEFAULT_PROPS = {
    isClicked: false,
    textIsClicked: 'is clicked',
    textIsUnclicked: 'is unclicked'
  }
  let component;

  describe('#render()', () => {
    describe('props: isClicked=true', () => {
      before(() => {
        const props = merge({}, DEFAULT_PROPS, {
          isClicked: true
        });
        component = shallow(<Button {...props} />);
      });

      it('should have className "button-component button-compnent-clicked" when the prop "isClicked" is true', () => {
        expect(component.props().className).to.equal('button-component button-component-clicked');
      });

      it('should have text equals to the prop "textIsClicked" when the prop "isClicked" is true', () => {
        expect(component.find('span').first().text()).to.equal(DEFAULT_PROPS.textIsClicked);
      });
    });

    describe('props: isClicked=false', () => {
      before(() => {
        component = shallow(<Button {...DEFAULT_PROPS} />);
      });

      it('should have className "button-component" when the prop "isClicked" is false', () => {
        expect(component.props().className).to.equal('button-component');
      });

      it('should have text equals to the prop "textIsUnclicked" when the prop "isClicked" is false', () => {
        expect(component.find('span').first().text()).to.equal(DEFAULT_PROPS.textIsUnclicked);
      });
    });
  });

  describe('#handleBtnClick()', () => {
    describe('props: isClicked=true', () => {
      let props, defaultCallback;

      beforeEach(() => {
        props = merge({}, DEFAULT_PROPS, {
          isClicked: true
        });
        defaultCallback = sinon.spy(Button.defaultProps, 'handleWhenIsClicked');
      });

      afterEach(() => {
        defaultCallback.restore();
      });

      it('should call the passed callback when the prop "isClicked" is true and "handleWhenIsClicked" is specified', () => {
        props = merge({}, props, {
          handleWhenIsClicked: sinon.spy()
        });
        component = shallow(<Button {...props} />);
        component.instance().handleBtnClick();
        sinon.assert.calledOnce(props.handleWhenIsClicked);
        sinon.assert.notCalled(defaultCallback);
      })

      it('should call the default callback when the prop "isClicked" is true and "handleWhenIsClicked" is not specified', () => {
        component = shallow(<Button {...props} />);
        component.instance().handleBtnClick();
        sinon.assert.calledOnce(defaultCallback);
      })
    });

    describe('props: isClicked=false', () => {
      let props, defaultCallback;

      beforeEach(() => {
        props = merge({}, DEFAULT_PROPS, {
          isClicked: false
        });
        defaultCallback = sinon.spy(Button.defaultProps, 'handleWhenIsUnclicked');
      });

      afterEach(() => {
        defaultCallback.restore();
      });

      it('should call the passed callback when the prop "isClicked" is true and "handleWhenIsUnclicked" is specified', () => {
        props = merge({}, props, {
          handleWhenIsUnclicked: sinon.spy()
        });
        component = shallow(<Button {...props} />);
        component.instance().handleBtnClick();
        sinon.assert.calledOnce(props.handleWhenIsUnclicked);
        sinon.assert.notCalled(defaultCallback);
      })

      it('should call the default callback when the prop "isClicked" is true and "handleWhenIsUnclicked" is not specified', () => {
        component = shallow(<Button {...props} />);
        component.instance().handleBtnClick();
        sinon.assert.calledOnce(defaultCallback);
      })
    });
  });
});
