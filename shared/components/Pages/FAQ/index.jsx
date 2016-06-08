'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';

import FAQ_EN_US from 'content/faq/en-us.json';
import FAQ_ZH_TW from 'content/faq/zh-tw.json';

if (process.env.BROWSER) {
  require('./FAQ.css');
}

export default class FAQ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenLang: 0
    }
    this.FAQS = [FAQ_EN_US, FAQ_ZH_TW];
  }

  handleClickLang = (index) => {
    this.setState({
      chosenLang: index
    });
  }

  render() {
    const { chosenLang } = this.state;
    let langs = [], questions = [];

    this.FAQS.map((FAQ, k) => {
      const langClass = classNames({
        'faq-lang': true,
        'clickable': true,
        'faq-lang-clicked': chosenLang === k
      });
      langs.push(
        <span
          key={k}
          className={langClass}
          onClick={this.handleClickLang.bind(this, k)}
        >
          {FAQ.LANG}
        </span>
      );
    });

    this.FAQS[chosenLang].CONTENT.map((ITEM, k) => {
      questions.push(
        <li
          key={k}
          className='faq-question'
        >
          <a href={ITEM.LINK} target='_blank' className='text-link'>{ITEM.QUESTION}</a>
        </li>
      );
    });

    return (
      <div className='faq-component container-fluid'>
        <div className='faq-header'>
          <h1>{this.FAQS[chosenLang].TITLE}</h1>
          <div className='faq-langs'>
            {langs}
          </div>
        </div>
        <ul className='faq-questions'>
          {questions}
        </ul>
      </div>
    );
  }
}

FAQ.displayName = 'FAQ';
