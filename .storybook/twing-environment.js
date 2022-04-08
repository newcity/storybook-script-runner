const {
  TwingEnvironment,
  TwingLoaderRelativeFilesystem,
} = require('twing');

const twing = new TwingEnvironment(new TwingLoaderRelativeFilesystem(), {
  autoescape: false,
});

// API: https://nightlycommit.github.io/twing/advanced.html

/*
  Note: in case there's need for custom Functions or Filters,
  remember that callbacks must return Promises in Twing (just make them `async`).
*/

module.exports = twing;
