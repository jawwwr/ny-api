import Router from 'koa-router';
import controller = require('./controller');
import { GooseMiddleware } from './middleware/goose'

const unprotectedRouter = new Router();

// Hello World route
unprotectedRouter.get('/', controller.general.helloWorld);
unprotectedRouter.get('/restaurants', controller.restaurant.getAll);
unprotectedRouter.get('/roll-restaurant', controller.restaurant.rollRestaurant);
unprotectedRouter.get('/restaurants/:id', controller.restaurant.get);
unprotectedRouter.get('/cuisines', controller.restaurant.getCuisines);
unprotectedRouter.get('/goose', controller.goose.create);
unprotectedRouter.get('/goose/list', GooseMiddleware, controller.goose.getConnections);
unprotectedRouter.get('/check-ins', controller.checkIn.getAllUserCheckIn);
unprotectedRouter.get('/check-in/:user_id', controller.checkIn.getUserCheckIn);
unprotectedRouter.post('/check-in', controller.checkIn.createCheckIn);
unprotectedRouter.get('/ranks', controller.restaurant_rank.getAllRanks);
unprotectedRouter.get('/user-rank/:restaurant_id', controller.restaurant_rank.getUserRankByResto);
unprotectedRouter.get('/ranks/:restaurant_id', controller.restaurant_rank.getRanksByResto);
unprotectedRouter.post('/new-rank', controller.restaurant_rank.createRank);
unprotectedRouter.get('/reviews', controller.review.getAllReview);
unprotectedRouter.post('/new-review', controller.review.createReview);
unprotectedRouter.get('/review/:restaurant_id', controller.review.getReviewsByResto);


export { unprotectedRouter };