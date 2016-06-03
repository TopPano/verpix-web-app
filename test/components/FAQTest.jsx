'use strict';

import React from 'react';
import { shallow } from 'enzyme';
import { range } from 'lodash';

import FAQ from 'components/FAQ';

describe('component: FAQ', () => {
  let component;
  let faqs;
  
  beforeEach(() => {
    component = shallow(<FAQ />);
    faqs = component.instance().faqs;
  });

  describe('#handleClickLang', () => {
    it('should have state that "chosenLang" equals to the parameter after calling handleClickLang', () => {
      range(0, faqs.length).forEach((index) => {
        component.instance().handleClickLang(index);
        expect(component.state().chosenLang).to.equal(index);
      });
    });
  });

  describe('#render', () => {
    it('should have correct title for different languages', () => {
      range(0, faqs.length).forEach((index) => {
        component.setState({ chosenLang: index });
        expect(component.find('h1').first().text()).to.equal(faqs[index].title);
      });
    });

    it('should have a languages choosing bar', () => {
      let k = 0;
      component.find('.faq-lang').forEach((lang) => {
        const handleClickLang = lang.props().onClick;
        expect(handleClickLang).to.exist;
        handleClickLang();
        expect(component.state().chosenLang).to.equal(k);
        k++;
      });

      range(0, faqs.length).forEach((index) => {
        k = 0;
        component.setState({ chosenLang: index });
        component.find('.faq-lang').forEach((lang) => {
          if(k == index) {
            assert(lang.hasClass('faq-lang-clicked'));
          } else {
            assert(!lang.hasClass('faq-lang-clicked'));
          }
          assert(lang.hasClass('clickable'));
          expect(lang.text()).to.equal(faqs[k].lang);
          k++;
        });
      });
    });

    it('should have questions and corresponding links of answer for different languages', () => {
      range(0, faqs.length).forEach((index) => {
        let k = 0;
        component.setState({ chosenLang: index });
        component.find('.faq-question').forEach((question) => {
          const anchor = question.find('a').first();
          assert(anchor.hasClass('text-link'));
          expect(anchor.props().href).to.equal(faqs[index].content[k].link);
          expect(anchor.text()).to.equal(faqs[index].content[k].question);
          k++;
        });
      });
    });
  });
});
