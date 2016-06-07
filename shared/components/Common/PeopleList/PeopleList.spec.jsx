'use strict';

import React from 'react';
import { shallow } from 'enzyme';

import PeopleList from './';
import INPUT_DATA from './__testdata__/PeopleList.json';

describe('component: PeopleList', () => {
  let props, component
  beforeEach(() => {
    props = {
      list: INPUT_DATA.list,
      userId: INPUT_DATA.userId,
      followUser: sinon.spy(),
      unfollowUser: sinon.spy()
    };
    component = shallow(<PeopleList {...props} />);
  });

  describe('#getPeopleList', () => {
    let genList;
    beforeEach(() => {
      genList = component.instance().genPeopleList();
    });

    it('img should have the same url corresponding to each item in list, a link and a click event handler', () => {
      genList.map((genItem, i) => {
        const genItemComponent = shallow(genItem);
        const item = props.list[i];
        expect(genItemComponent.find('img').first().props().src).to.equal(item.profilePhotoUrl);
        expect(genItemComponent.find('Link').first().props().to).to.equal('/@' + item.id);
        expect(genItemComponent.find('Link').first().props().onClick).to.equal(component.instance().hideList);
      });
    });

    it('username should have the same value corresponding to each item in list, a link and a click event handler', () => {
      genList.map((genItem, i) => {
        const genItemComponent = shallow(genItem);
        const item = props.list[i];
        expect(genItemComponent.find('.people-list-item-name').first().children().text()).to.equal(item.username);
        expect(genItemComponent.find('Link').get(1).props.to).to.equal('/@' + item.id);
        expect(genItemComponent.find('Link').get(1).props.onClick).to.equal(component.instance().hideList);
      });
    });

    it('should have a button when userId is not equal to id for each item in list', () => {
      genList.map((genItem, i) => {
        const button = shallow(genItem).find('Button');
        const item = props.list[i];
        if(item.id !== props.userId) {
          expect(button).to.exist;
          expect(button.props().isClicked).to.equal(item.isFriend);
        } else {
          expect(button).to.be.empty;
        }
      });
    });
  });

  describe('#showList', () => {
    it('should have the state that "show" is true after calling showlist', () => {
      component.instance().showList();
      expect(component.state().show).to.equal(true);
    });
  });

  describe('#hideList', () => {
    it('should have the state that "show" is true after calling hidelist', () => {
      component.instance().hideList();
      expect(component.state().show).to.equal(false);
    });
  });

  describe('#render', () => {
    it('should have a Modal with correct props', () => {
      const modal = component.find('Modal');
      expect(modal).to.exist;
      expect(modal.props().show).to.equal(component.state().show);
      expect(modal.props().onHide).to.equal(component.instance().hideList);
    });

    it('should have customizable content which can show list when it it clicked', () => {
      expect(component.find('.people-list-content').props().onClick).to.equal(component.instance().showList);
    });
  });
});
