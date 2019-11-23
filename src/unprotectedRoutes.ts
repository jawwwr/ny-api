import Router from 'koa-router';
import controller = require('./controller');

const unprotectedRouter = new Router();

// Hello World route
unprotectedRouter.get('/', controller.general.helloWorld);
unprotectedRouter.get('/restaurants', controller.restaurant.getAll);
unprotectedRouter.get('/restaurants/:id', controller.restaurant.get);
unprotectedRouter.get('/cuisines', controller.restaurant.getCuisines);
unprotectedRouter.get('/goose', controller.goose.create);

export { unprotectedRouter };