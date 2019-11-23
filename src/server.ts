import Koa from 'koa';
import jwt from 'koa-jwt';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import winston from 'winston';
import { createConnection } from 'typeorm';
import 'reflect-metadata';
import socketIO from 'socket.io';
import Http from 'http';
import * as PostgressConnectionStringParser from 'pg-connection-string';
import mysql from 'mysql';

import { logger } from './logging';
import { config } from './config';
import { unprotectedRouter } from './unprotectedRoutes';
import { protectedRouter } from './protectedRoutes';
import { cron } from './cron';
import InitializeSocket from './services/socketio';


createConnection({
    type: 'mysql',
    host: 'db-ny-beta.cuyamerxrzkv.ap-southeast-1.rds.amazonaws.com', // config.host_db,
    port: 3306, // config.port,
    username: 'admin', // config.username,
    password: 'noygrittes', // config.password,
    database: 'ny_db_beta', // config.database,
    synchronize: true,
    logging: false,
    entities: config.dbEntitiesPath,
    acquireTimeout: 1000,
    extra: {
        ssl: config.dbsslconn, // if not development, will use SSL
    }
}).then(async connection => {

    const app = new Koa();
    const server = Http.createServer(app.callback());
    const io = socketIO(server);

    // socket initialize
    InitializeSocket(io);

    // Provides important security headers to make your app more secure
    app.use(helmet());

    // Enable cors with default options
    app.use(cors());

    // Logger middleware -> use winston as logger (logging.ts with config)
    app.use(logger(winston));

    // Enable bodyParser with default options
    app.use(bodyParser());

    // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

    // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
    // do not protect swagger-json and swagger-html endpoints
    app.use(jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/] }));

    // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    // Register cron job to do any action needed
    cron.start();

    server.listen(config.port);

    console.log(`Server running on port ${config.port}`);

}).catch(error => console.log('TypeORM connection error: ', error));