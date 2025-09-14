// This file is for MikroORM CLI to work properly with TypeScript source files
require('ts-node/register');
module.exports = require('./src/config/mikro-orm.config.ts').default;
