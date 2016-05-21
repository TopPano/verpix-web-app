export const DEFAULT_PROFILE_PHOTO_URL = '/static/images/profile-photo-default.png';

export const DEFAULT_VIEWER_OPTIONS = {
  LAT: 0,
  LNG: 30,
  FOV: 70
}

export const LOGIN_ERR_MSG = {
  USERNAME: {
    EMPTY: 'Please enter your name.',
    INVALID: 'Please try another name.\n(Only letters, numbers, underscores and periods)'
  },
  EMAIL: {
    EMPTY: 'Please enter your email.',
    INVALID: 'The email address is not valid.'
  },
  PASSWORD: {
    EMPTY: 'Please enter your password.',
    EMPTY_AGAIN: 'Please enter your password again.',
    NOT_MATCHED: 'These passwords don\'t match.'
  },
  AJAX: {
    EXISTED: 'The email address already exists.',
    UNAUTHORIZED: 'The email and password don\'t match.',
    OTHERS: 'Something wrong with server.\nPlease try again later.'
  }
}

export const EXTERNAL_LINKS = {
  TERMS_OF_USE: 'http://toppano.in/termofuse/',
  PRIVACY_POLICY: 'http://toppano.in/privacy-policy/'
}
