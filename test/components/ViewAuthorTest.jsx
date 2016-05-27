'use strict';

import React from 'react';
import { shallow } from 'enzyme';

import ViewAuthor from 'components/ViewAuthor';

const DEFAULT_PROPS = {
  authorPhotoUrl: '/static/images/profile-photo-default.png',
  authorName: 'hawk.lin',
  authorId: '8a0a8410-df79-11e5-a22d-7b202e989a7f'
}

describe('component: ViewAuthor', () => {
  describe('#render()', () => {
    let props, component;

    before(() => {
      props = DEFAULT_PROPS;
      component = shallow(<ViewAuthor {...props} />);
    });

    it('should have image with source equals to the prop "authorPhotoUrl"', () => {
      expect(component.find('img').first().props().src).to.equal(props.authorPhotoUrl);
    });

    it('should have links with url equals to the prop "authorId"', () => {
      component.find('Link').forEach((link) => {
        expect(link.props().to).to.equal('/@' + props.authorId);
      });
    });

    it('should have text equals to the prop "authorName"', () => {
      expect(component.find('.view-author-name').first().children().text()).to.equal(props.authorName);
    });
  });
});
