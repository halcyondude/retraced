module.exports = {
  RETRACED_ENV: 'local',
  RETRACED_API_ENDPOINT: 'http://localhost:3000/v1',
  BUILD_VERSION: (function () {
    return String(Date.now());
  } ()),
  RETRACED_BUGSNAG_STAGE: 'development',
  RETRACED_PUBLIC_WEB_URL: 'http://localhost:8099',
};