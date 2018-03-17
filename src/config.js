const Joi = require('joi');
const Dotenv = require('dotenv');

Dotenv.load({ path: './.env' });

const evnObject = Joi.object({
        NODE_ENV: Joi.string()
            .allow(['development', 'production', 'test', 'provision'])
            .default('development'),
        DATABASE_CLIENT: Joi.string()
            .allow(['mongodb', 'mysql'])
            .default('mysql'),
        SERVER_PORT: Joi.number()
            .default(8000),
        SECRET_TOKEN: Joi.string()
            .description('Secret token required to sign'),
        API_KEY: Joi.string()
            .description('API key'),
        MYSQL_HOST: Joi.string()
            .description('MYSQL host')
            .default('localhost'),
        MYSQL_PORT: Joi.number()
            .default(3306),
        MYSQL_USERNAME: Joi.string()
            .default('root'),
        MYSQL_PASSWORD: Joi.string()
            .default('9244'),
        MYSQL_MAX_POOL: Joi.number()
            .default(10),
        DATABASE_NAME: Joi.string()
            .default('test'),
        HEADER_API_KEY: Joi.string()
            .default('x-api-key'),
        HEADER_ACCESS_TOKEN: Joi.string()
            .default('x-access-token'),
        HEADER_USER_ID: Joi.string()
            .default('x-user-id'),
        EMAIL_CLIENT: Joi.string()
            .default('gmail'),
        EMAIL_USERNAME: Joi.string(),
<<<<<<< HEAD
        EMAIL_PASSWORD: Joi.string()
=======
        EMAIL_PASSWORD: Joi.string(),
        BASE_URL: Joi.string()
            .default('http://localhost:8000')
>>>>>>> 225a7758de6c7f2ea535f8096e2838df9f6cc875
    }).unknown()
    .required();

const { error, value: envVars } = Joi.validate(process.env, evnObject);
if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const config = {
    env: envVars.NODE_ENV,
    port: envVars.SERVER_PORT,
    secret_token: envVars.SECRET_TOKEN,
    api_key: envVars.API_KEY,
    database_client: envVars.DATABASE_CLIENT,
    mysql: {
        host: envVars.MYSQL_HOST,
        port: envVars.MYSQL_PORT,
        username: envVars.MYSQL_USERNAME,
        password: envVars.MYSQL_PASSWORD,
        max_pool: envVars.MYSQL_MAX_POOL,
        database_name: envVars.DATABASE_NAME
    },
    header: {
        api_key: envVars.HEADER_API_KEY,
        access_token: envVars.HEADER_ACCESS_TOKEN,
        user_id: envVars.HEADER_USER_ID
    },
    email: {
        client: envVars.EMAIL_CLIENT,
        username: envVars.EMAIL_USERNAME,
        password: envVars.EMAIL_PASSWORD
    },
    base_url: envVars.BASE_URL,
    root_folder: process.env.PWD
};

module.exports = config;