'use strict';

import React from 'react';
import { shallow } from 'enzyme';
import classNames from 'classnames';

import View from './';
import { MEDIA_TYPE, ORIENTATION } from 'constants/common';
import INPUT_DATA from './__testdata__/View.json';

describe('component: View', () => {
  describe('#render()', () => {
    let components = [];

    beforeEach(() => {
      let callbacks = {
        likePost: sinon.spy(),
        unlikePost: sinon.spy(),
        showLikelist: sinon.spy()
      }
      components = INPUT_DATA.map((props) => {
        return shallow(<View {...props} {...callbacks} />);
      });
    });

    it('should have different class based on the prop "orientation"', () => {
      components.forEach((component) => {
        const { orientation } = component.instance().props;

        assert(component.hasClass('view-component'));
        if(orientation === ORIENTATION.PORTRAIT) {
          assert(component.hasClass('view-portrait'));
        }
      });
    });

    it('should have an image that shows its type', () => {
      components.forEach((component) => {
        const type = component.instance().props.type;
        const expectedTypeImgUrl = `/static/images/view/type-${type === MEDIA_TYPE.PANO_PHOTO ? 'pano-photo' : 'live-photo'}.png`;
        const typeImg = component.find('.view-type').first();

        expect(typeImg.props().src).to.equal(expectedTypeImgUrl);
        expect(typeImg.props().alt).to.equal(type);
      });
    });

    it('should have an preview image that links to a post', () => {
      components.forEach((component) => {
        const { postId, imgUrl, orientation } = component.instance().props;
        const previewWrapper = component.find('.view-preview-wrapper').first();
        const preview = previewWrapper.find('.view-preview').first();
        const previewClass = classNames({
          'view-preview': true,
          'view-preview-portrait': orientation === ORIENTATION.PORTRAIT
        });

        expect(previewWrapper.props().to).to.equal('/viewer/@' + postId);
        expect(preview.props().src).to.equal(imgUrl);
        expect(preview.props().alt).to.equal('preview');
        expect(preview.props().className).to.equal(previewClass);
        expect(previewWrapper.find('.view-preview-border')).to.have.length(1);
      });
    });

    it('should have a ViewLike as sub-component', () => {
      components.forEach((component) => {
        const viewLike = component.find('ViewLike');
        const shouldHavePropsList = [
          'count',
          'isLiked',
          'likePost',
          'unlikePost',
          'showLikeList'
        ];
        
        expect(viewLike).to.have.length(1);
        shouldHavePropsList.forEach((propName) => {
          expect(component.instance().props[propName]).to.equal(viewLike.prop(propName));
        });
      });
    });

    it('should have a ViewAuthor as sub-component when the props "showAuthor" is true', () => {
      components.forEach((component) => {
        const viewAuthor = component.find('ViewAuthor');
        const shouldHavePropsList = [
          'authorPhotoUrl',
          'authorName',
          'authorId'
        ];

        if(component.instance().props.showAuthor === true) {
          expect(viewAuthor).to.have.length(1);
          shouldHavePropsList.forEach((propName) => {
            expect(component.instance().props[propName]).to.equal(viewAuthor.prop(propName));
          });
        } else {
          expect(viewAuthor).to.have.length(0);
        }
      });
    });
  });
});
