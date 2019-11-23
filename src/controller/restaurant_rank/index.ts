import { BaseContext } from 'koa';
import { getManager, getRepository, Repository, Not, Equal, Like, AdvancedConsoleLogger } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { request, summary, path, body, responsesAll, tagsAll } from 'koa-swagger-decorator';
import { RestaurantRank } from '../../entity/restaurant_rank';

@responsesAll({ 200: { description: 'success'}, 400: { description: 'bad request'}, 401: { description: 'unauthorized, missing/wrong jwt token'}})
@tagsAll(['RestaurantRank'])
export default class RestaurantRankController {

    @request('get', '/ranks')
    @summary('Find all ranks')
    public static async getAllRanks(ctx: BaseContext) {

        const rankRepository: Repository<RestaurantRank> = getManager().getRepository(RestaurantRank);

        // load all checkIns
        const ranks: RestaurantRank[] = await rankRepository.find();

        ctx.status = 200;
        ctx.body = ranks;
    }

    @request('get', '/ranks/{restaurant_id}')
    @summary('Find all rank based on restaurant')
    public static async getRanksByResto(ctx: BaseContext) {

        const ranks = await getRepository(RestaurantRank)
            .createQueryBuilder('ranks')
            .limit( ctx.query.limit || 10)
            .orderBy('ranks.points', 'DESC')
            .leftJoinAndSelect('ranks.user', 'user')
            .where('ranks.restaurantId = :id', { id: +ctx.params.restaurant_id }).getMany();

        if (ranks) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = ranks;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = 'No ranks for this restaurant.';
        }

    }

    @request('get', '/user-rank/{restaurant_id}')
    @summary('Find user rank based on restaurant')
    public static async getUserRankByResto(ctx: BaseContext) {
        const userRank = await getManager().getRepository(RestaurantRank)
            .createQueryBuilder('ranks')
            .leftJoinAndSelect('ranks.user', 'user')
            .where('ranks.restaurantId = :id', { id: +ctx.params.restaurant_id })
            .andWhere('ranks.userId = :user_id', { user_id: ctx.query.user_id })
            .getOne();

        if (userRank) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = userRank;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = 'No ranks for this restaurant.';
        }

    }

    @request('post', '/new-rank')
    @summary('Create a unique restaurant rank per user')
    public static async createRank(ctx: BaseContext) {
        const rankRepository: Repository<RestaurantRank> = getManager().getRepository(RestaurantRank);
        const rankToSave: RestaurantRank = new RestaurantRank();
        rankToSave.restaurantId = ctx.request.body.restaurant_id;
        rankToSave.points = ctx.request.body.points;
        rankToSave.user = ctx.request.body.user_id;
        const existing_rank = await rankRepository.findOne({ user: rankToSave.user, restaurantId: rankToSave.restaurantId });
    if (existing_rank) {
            const new_points = existing_rank.points + rankToSave.points;
            const rank = await getRepository(RestaurantRank)
            .createQueryBuilder()
            .update(RestaurantRank)
            .set({ points: new_points })
            .where('restaurantId = :restaurant_id', { restaurant_id: rankToSave.restaurantId })
            .andWhere('userId = :user_id', { user_id: rankToSave.user  })
            .execute();
        if (rank) {
            ctx.status = 201;
            ctx.body = rank;
        }
        else {
            ctx.status = 400;
            ctx.body = 'Was not able to update rank.';
        }

    }
    else {
            // save the user contained in the POST body
            const rank = await rankRepository.save(rankToSave);
            // return CREATED status code and updated user
            ctx.status = 201;
            ctx.body = rank;
        }
    }
}