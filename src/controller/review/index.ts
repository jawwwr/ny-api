import { BaseContext } from 'koa';
import { getManager, getRepository, Repository, Not, Equal, Like, AdvancedConsoleLogger } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { request, summary, path, body, responsesAll, tagsAll } from 'koa-swagger-decorator';
import { Review } from '../../entity/review';

@responsesAll({ 200: { description: 'success'}, 400: { description: 'bad request'}, 401: { description: 'unauthorized, missing/wrong jwt token'}})
@tagsAll(['Review'])
export default class ReviewController {

    @request('get', '/reviews')
    @summary('Find all reviews')
    public static async getAllReview(ctx: BaseContext) {

        const reviewRepository: Repository<Review> = getManager().getRepository(Review);

        // load all reviews
        const reviews: Review[] = await reviewRepository.find();

        ctx.status = 200;
        ctx.body = reviews;
    }

    @request('get', '/review/{restaurant_id}')
    @summary('Find all review based on restaurant')
    public static async getReviewsByResto(ctx: BaseContext) {

        const reviews = await getRepository(Review)
            .createQueryBuilder('reviews')
            .limit( ctx.query.limit || 10)
            .orderBy('review.createdAt', 'DESC')
            .leftJoinAndSelect('review.user', 'user') // show user name per review
            .where('review.restaurantId = :id', { id: +ctx.params.restaurant_id }).getMany();

        if (reviews) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = reviews;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = 'No reviews for this restaurant.';
        }

    }

    @request('post', '/new-review')
    @summary('Create a new review for a restaurant restaurant')
    public static async createReview(ctx: BaseContext) {


        const reviewRepository: Repository<Review> = getManager().getRepository(Review);

        const reviewToSave: Review = new Review();
        reviewToSave.restaurantId = ctx.request.body.restaurant_id;
        reviewToSave.remarks = ctx.request.body.remarks;
        reviewToSave.starRating = ctx.request.body.star_rating;
        reviewToSave.user = ctx.request.body.user_id;

        const review = await reviewRepository.save(reviewToSave);

        if (review) {

            ctx.status = 201;
            ctx.body = review;

        } else {

            ctx.status = 400;
            ctx.body = 'Was not able to add review.';
        }
    }
}