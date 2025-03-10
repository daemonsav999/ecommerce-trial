const getTimestamp = () => {
  return new Date().toISOString()
      .replace('T', ' ')
      .substring(0, 19);
};

const getCurrentUser = () => {
  return process.env.CURRENT_USER || 'daemonsav999';
};

const ENV_INFO = {
  get timestamp() {
      return getTimestamp();
  },
  get user() {
      return getCurrentUser();
  },
  environment: process.env.NODE_ENV || 'development'
};

// Add function to format log metadata
const getLogMetadata = (additional = {}) => ({
  timestamp: getTimestamp(),
  user: getCurrentUser(),
  environment: ENV_INFO.environment,
  ...additional
});

module.exports = {
  ENV_INFO,
  getTimestamp,
  getCurrentUser,
  getLogMetadata
};