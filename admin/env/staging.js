module.exports = {
  RETRACED_ENV: 'staging',
  RETRACED_API_ENDPOINT: 'https://api.staging.retraced.io/v1',
  BUILD_VERSION: (function () {
    return process.env.BUILD_VERSION;
  } ()),
  RETRACED_BUGSNAG_STAGE: 'staging',
  RETRACED_PUBLIC_WEB_URL: 'https://preview.staging.retraced.io',
};