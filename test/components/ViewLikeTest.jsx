'use strict';

import React from 'react';
import { shallow } from 'enzyme';
import { toString, forEach, range, merge } from 'lodash';

import ViewLike from 'components/ViewLike';

describe('component: ViewLike', () => {
  let component, props;
  beforeEach(() => {
    props = {
      count: 0,
      isLiked: false,
      likePost: sinon.spy(),
      unlikePost: sinon.spy(),
      showLikelist: sinon.spy()
    }
  });

  describe('#render()', () => {
    describe('props: count', () => {
      it('should show a counter equals to the prop "count" when count > 0', () => {
        props.count = 100;
        component = shallow(<ViewLike {...props} />);
        expect(component.find('.view-like-count').first().text()).to.equal(toString(props.count));
      });

      it('should show a counter equals to 0 when the prop "count" <= 0', () => {
        range(0, -100, -10).forEach((count) => {
          props.count = count;
          component = shallow(<ViewLike {...props} />);
          expect(component.find('.view-like-count').first().text()).to.equal('0');
        });
      });

      it('should show a clickable counter when the prop "count" > 0', () => {
        props.count = 100;
        component = shallow(<ViewLike {...props} />);
        expect(component.find('.view-like-count.view-like-count-clickable')).to.have.length(1);
      });

      it('should show a unclickable counter when the prop "count" <= 0', () => {
        range(0, -100, -10).forEach((count) => {
          props.count = count;
          component = shallow(<ViewLike {...props} />);
          expect(component.find('.view-like-count.view-like-count-clickable')).to.have.length(0);
          expect(component.find('.view-like-count')).to.have.length(1);
        });
      });

      it('counter sholuld have a click handler equals to the "showLikelist" when the prop "count" > 0', () => {
        props.count = 100;
        component = shallow(<ViewLike {...props} />);
        component.find('.view-like-count').first().simulate('click');
        sinon.assert.calledOnce(props.showLikelist);
      });
    });

    describe('props: isLiked', () => {
      it('should have image shows it is liked or not', () => {
        ([true, false]).forEach((isLiked) => {
          const expectedSrc = `/static/images/view/likebtn${isLiked ? '-clicked' : ''}.png`;
          props.isLiked = isLiked;
          component = shallow(<ViewLike {...props} />);
          expect(component.find('img').get(0).props.src).to.equal(expectedSrc);
        });
      });
    });
  });

  describe('#handleClick()', () => {
    describe('props: isLiked', () => {
      it('should call "unlikePost" when the prop "isLiked" = true', () => {
        props.isLiked = true;
        component = shallow(<ViewLike {...props} />);
        component.instance().handleClick();
        sinon.assert.notCalled(props.likePost);
        sinon.assert.calledOnce(props.unlikePost);
      });

      it('should call "likePost" when the prop "isLiked" = false', () => {
        props.isLiked = false;
        component = shallow(<ViewLike {...props} />);
        component.instance().handleClick();
        sinon.assert.calledOnce(props.likePost);
        sinon.assert.notCalled(props.unlikePost);
      });
    });
  });
});
