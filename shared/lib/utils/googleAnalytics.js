import { google } from '../../../etc/external-api';

export function initialize() {
  ga('create', google.gaTrackingCode, 'auto');
}

export function navigate(pageData) {
  ga('set', pageData);
  ga('send', 'pageview');
}

export function sendEvent(category, action, label, value) {
  ga('send', {
    hitType       : 'event',
    eventCategory : category,
    eventAction   : action,
    eventLabel    : label,
    eventValue    : value
  });
}
