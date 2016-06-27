'use strict';

import React from 'react';
import { shallow, mount } from 'enzyme';
import { range, merge } from 'lodash';

import Gallery from './';
import { createFixedArray, genLikelist, parseUsername, parseProfilePhotoUrl } from 'lib/utils';
import INPUT_DATA from './__testdata__/Gallery.input.json';
import OUTPUT_DATA from './__testdata__/Gallery.output.json';
import { MEDIA_TYPE, ORIENTATION } from 'constants/common';
import { GALLERY_BOUNDARY } from 'constants/gallery';

describe('component: Gallery', () => {
  let component, props = INPUT_DATA;

  beforeEach(() => {
    let callbacks = {
      followUser: sinon.spy(),
      unfollowUser: sinon.spy(),
      likePost: sinon.spy(),
      unlikePost: sinon.spy(),
      getLikelist: sinon.spy(),
      loadMorePosts: sinon.spy()
    }
    component = shallow(<Gallery {...props} {...callbacks} />);
  });

  describe('#dividePostIds()', () => {
    it('should return an empty array for "numDivs" <= 0', () => {
      range(-100, 10, 10).forEach((numDivs) => {
        const instance = component.instance();
        const { postIds, posts, hasNext } = instance.props;
        const dividedPostIds = instance.dividePostIds(postIds, posts, numDivs, hasNext);

        expect(dividedPostIds).to.deep.equal([]);
      });
    });

    it('should return devisions of postIds which have almost equal heights for "numDivs" > 0', () => {
      range(1, 3).forEach((numDivs) => {
        [false, true].forEach((hasNext) => {
          const instance = component.instance();
          const { postIds, posts } = instance.props;
          const dividedPostIds = instance.dividePostIds(postIds, posts, numDivs, hasNext);
          const expectedDividedPostIds = OUTPUT_DATA.dividedPostIds[hasNext + 'And' + numDivs];

          expect(dividedPostIds).to.have.length(numDivs);
          expect(dividedPostIds).to.deep.equal(expectedDividedPostIds);
        });
      });
    });
  });

  describe('#getOrientation()', () => {
    it('should get correct orientation for each post', () => {
      const { postIds, posts } = component.instance().props;
      postIds.forEach((id) => {
        const post = posts[id];
        const expectedOrientation = 
          post.mediaType === MEDIA_TYPE.LIVE_PHOTO && post.dimension.orientation === ORIENTATION.PORTRAIT ?
          ORIENTATION.PORTRAIT :
          ORIENTATION.LANDSCAPE;
        expect(component.instance().getOrientation(post)).to.equal(expectedOrientation);
      });
    });
  });

  describe('#isPortrait()', () => {
    it('should return true if a post is live photo and portrait', () => {
      const { postIds, posts } = component.instance().props;
      postIds.forEach((id) => {
        const post = posts[id];
        const expectedIsPortrait = 
          post.mediaType === MEDIA_TYPE.LIVE_PHOTO && post.dimension.orientation === ORIENTATION.PORTRAIT ?
          true :
          false;
        expect(component.instance().isPortrait(post)).to.equal(expectedIsPortrait);
      });
    });
  });

  describe('#calculateNumOfDivs()', () => {
    it('should return correct value based on "window.innerWidth"', () => {
      range(100, 1000, 100).forEach((innerWidth) => {
        window.innerWidth = innerWidth;
        const expectedNumOfDivs = innerWidth > GALLERY_BOUNDARY ? 2 : 1;
        expect(component.instance().calculateNumOfDivs()).to.equal(expectedNumOfDivs);
      });
    });
  });

  describe('#componentDidMount()', () => {
    it('should call "calculateNumOfDivs" once and set the state "numOfDivs" as its return value', () => {
      range(100, 1000, 100).forEach((innerWidth) => {
        let instance = component.instance();
        let spyCalculateNumOfDivs = sinon.spy(instance, 'calculateNumOfDivs');
        instance.componentDidMount();
        sinon.assert.calledOnce(spyCalculateNumOfDivs);
        expect(component.state().numOfDivs).to.equal(instance.calculateNumOfDivs());
        spyCalculateNumOfDivs.restore();
      });
    });

    it('should register "handleWindowResize" as a handler of "resize" event', () => {
      let instance = component.instance();
      let spyHandleWindowResize = sinon.spy(instance, 'handleWindowResize');
      instance.componentDidMount();
      window.dispatchEvent(new Event('resize'));
      sinon.assert.calledOnce(spyHandleWindowResize);
      spyHandleWindowResize.restore();
    });
  });

  describe('#componentWillUnmount()', () => {
    it('should register "handleWindowResize" from the handlers of "resize" event', () => {
      let instance = component.instance();
      let spyHandleWindowResize = sinon.spy(instance, 'handleWindowResize');
      instance.componentDidMount();
      instance.componentWillUnmount();
      window.dispatchEvent(new Event('resize'));
      sinon.assert.notCalled(spyHandleWindowResize);
      spyHandleWindowResize.restore();
    });
  });

  describe('#handleWindowResize()', () => {
    it('should update tne state "numOfDivs" from the result of calling "calculateNumOfDivs"', () => {
      range(100, 1000, 100).forEach((innerWidth) => {
        window.innerWidth = innerWidth;
        const expectedNumOfDivs = component.instance().calculateNumOfDivs();
        component.instance().handleWindowResize();
        expect(component.state().numOfDivs).to.equal(expectedNumOfDivs);
      });
    });
  });

  describe('#handleClickMoreBtn()', () => {
    it('should call "loadMorePosts" which is from its props', () => {
      component.instance().handleClickMoreBtn();
      sinon.assert.calledOnce(component.instance().props.loadMorePosts);
    });
  });

  describe('#render()', () => {
    it('should contains PeopleList as a sub-component', () => {
      const peopleList = component.find('PeopleList');
      const shouldHavePropsList = [
        'userId',
        'followUser',
        'unfollowUser'
      ];
      const expectedList = genLikelist(component.instance().props.like.list);
      
      expect(peopleList).to.have.length(1);
      shouldHavePropsList.forEach((propName) => {
        expect(peopleList.prop(propName)).to.equal(component.instance().props[propName]);
      });
      expect(peopleList.props().list).to.deep.equal(expectedList);
    });

    it('should contains a button for loading more posts when the prop "hasNext" is true', () => {
      const hasNexts = [true, false, undefined];
      hasNexts.forEach((hasNext) => {
        let callbacks = {
          followUser: sinon.spy(),
          unfollowUser: sinon.spy(),
          likePost: sinon.spy(),
          unlikePost: sinon.spy(),
          getLikelist: sinon.spy(),
          loadMorePosts: sinon.spy()
        }
        const _props = merge(props, { hasNext });

        component = shallow(<Gallery {...props} {...callbacks} />);

        const moreBtn = component.find('.gallery-more-btn');
        if(!hasNext) {
          component = shallow(<Gallery {...props} {...callbacks} />);
          expect(component.find('.gallery-more-btn')).have.length(0);
        } else {
          let spyHandleClickMoreBtn = sinon.spy(Gallery.prototype, 'handleClickMoreBtn');
          component = shallow(<Gallery {...props} {...callbacks} />);

          const moreBtn = component.find('.gallery-more-btn');
          expect(moreBtn).have.length(1);
          moreBtn.simulate('click');
          sinon.assert.calledOnce(spyHandleClickMoreBtn);
          spyHandleClickMoreBtn.restore();
        }
      });
    });

    it('should have a list of divided previews', () => {
      const instance = component.instance();
      const numOfDivses = [0, 1, 2];

      numOfDivses.forEach((numOfDivs) => {
        component.setState({numOfDivs});

        const gallerySubDivs = component.find('.gallery-sub');
        if(numOfDivs <= 0) {
          expect(gallerySubDivs).have.length(0);
        } else {
          const { postIds, posts, hasNext } = instance.props;
          const dividedPostIds = instance.dividePostIds(postIds, posts, numOfDivs, hasNext);

          expect(gallerySubDivs).have.length(numOfDivs);
          gallerySubDivs.forEach((gallerySubDiv, divIndex) => {
            const previews = gallerySubDiv.find('View');

            expect(gallerySubDiv.key()).to.equal(divIndex.toString());
            expect(previews).have.length(dividedPostIds[divIndex].length);
            gallerySubDiv.find('View').forEach((preview, previewIndex) => {
              const id = dividedPostIds[divIndex][previewIndex];
              const post = instance.props.posts[id];
              const expectedPropValues = {
                postId: id,
                type: post.mediaType,
                orientation: instance.getOrientation(post),
                imgUrl: post.thumbnail.downloadUrl,
                count: post.likes.count,
                isLiked: post.likes.isLiked,
                showAuthor: instance.props.showAuthor,
                authorId: post.owner.sid,
                authorName: parseUsername(post.owner),
                authorPhotoUrl: parseProfilePhotoUrl(post.owner)
              }

              expect(preview.key()).to.equal(id);
              for(let prop in expectedPropValues) {
                expect(preview.props()[prop]).to.equal(expectedPropValues[prop]);
              }
              preview.props().likePost();
              preview.props().unlikePost();
              // TODO: spy on showLikelist.
              sinon.assert.calledWith(instance.props.likePost, sinon.match(id));
              sinon.assert.calledWith(instance.props.unlikePost, sinon.match(id));
            });
          });
        }
      });
    });
  });

});
