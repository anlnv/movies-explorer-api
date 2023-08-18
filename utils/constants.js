const { config } = require('dotenv');

const { NODE_ENV } = process.env;

if (NODE_ENV === 'production') {
  config();
}

const { SECRET_SIGNING_KEY = 'dev-secret' } = process.env;

module.exports = {
  SECRET_SIGNING_KEY,
  NODE_ENV,
};
