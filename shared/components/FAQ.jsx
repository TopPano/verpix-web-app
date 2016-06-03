'use strict';

import React, { Component } from 'react';
import classNames from 'classnames';

import faqEnUs from '../content/faq/en-us.json';
import faqZhTw from '../content/faq/zh-tw.json';

if (process.env.BROWSER) {
  require('styles/FAQ.css');
}

export default class FAQ extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenLang: 0
    }
    this.faqs = [faqEnUs, faqZhTw];
  }

  handleClickLang = (index) => {
    this.setState({
      chosenLang: index
    });
  }

  render() {
    const { chosenLang } = this.state;
    let langs = [], questions = [];

    this.faqs.map((faq, k) => {
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
          {faq.lang}
        </span>
      );
    });

    this.faqs[chosenLang].content.map((item, k) => {
      questions.push(
        <li
          key={k}
          className='faq-question'
        >
          <a href={item.link} target='_blank' className='text-link'>{item.question}</a>
        </li>
      );
    });

    return (
      <div className='faq-component container-fluid'>
        <div className='faq-header'>
          <h1>{this.faqs[chosenLang].title}</h1>
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
