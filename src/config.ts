import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export interface IConfig {
    port: number;
    host_db: string;
    username: string;
    password: string;
    database: string;
    debugLogging: boolean;
    dbsslconn: boolean;
    jwtSecret: string;
    dbEntitiesPath: string[];
    cronJobExpression: string;
}

const isDevMode = process.env.NODE_ENV == 'development';

const config: IConfig = {
    port: +process.env.PORT || 3306,
    host_db: process.env.NY_HOST_DB || 'db-ny-beta.cuyamerxrzkv.ap-southeast-1.rds.amazonaws.com',
    username: process.env.USERNAME || 'admin',
    password: process.env.PASSWORD || 'noygrittes',
    database: process.env.DATABASE || 'ny_db_beta',
    debugLogging: isDevMode,
    dbsslconn: false,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-whatever',
    dbEntitiesPath: [
      ... isDevMode ? ['src/entity/**/*.ts'] : ['dist/entity/**/*.js'],
    ],
    cronJobExpression: '0 * * * *'
};

export { config };