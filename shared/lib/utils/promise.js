// TODO: import Promise from 'bluebird' will cause PhantomJS crash in test mode,
// so we use native Promise currently. Please fix it.
export default (process.env.NODE_ENV === 'test') ? global.Promise : require('bluebird');
