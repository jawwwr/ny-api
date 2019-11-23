import { BaseContext } from 'koa';
import { getManager, getRepository, Repository, Not, Equal, Like, AdvancedConsoleLogger } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { request, summary, path, body, responsesAll, tagsAll } from 'koa-swagger-decorator';
import { User } from '../../entity/User';
import { CheckIn } from '../../entity/CheckIn';
import { RestaurantRank } from '../../entity/RestaurantRank';

@responsesAll({ 200: { description: 'success'}, 400: { description: 'bad request'}, 401: { description: 'unauthorized, missing/wrong jwt token'}})
@tagsAll(['User'])


export default class restaurantRankController {

    @request('get', '/ranks')
    @summary('Find all ranks')
    public static async getAllRanks(ctx: BaseContext) {

        // get a user repository to perform operations with checkIn
        const rankRepository: Repository<RestaurantRank> = getManager().getRepository(RestaurantRank);

        // load all checkIns
        const ranks: RestaurantRank[] = await rankRepository.find();

        // return OK status code and loaded users array
        ctx.status = 200;
        ctx.body = ranks;
    }

    @request('get', '/ranks/{restaurant_id}')
    @summary('Find all all with rank based on restaurant')
    @path({
        restaurant_id: { type: 'number', required: true, description: 'id of restaurant' }
    })
    public static async getRanksByResto(ctx: BaseContext) {

        // load user by id

        const ranks = await getRepository(RestaurantRank)
            .createQueryBuilder("ranks")
            .leftJoinAndSelect("ranks.user", "user")
            .where("ranks.restaurantId = :id", { id: +ctx.params.restaurant_id })
            .getMany();

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

    @request('post', '/new-rank')
    @summary('Create a unique restaurant rank per user')
    // @body(userSchema)
    public static async createRank(ctx: BaseContext) {
        // .leftJoinAndSelect("user.photos", "photo")
        // get a user repository to perform operations with user

        const rankRepository: Repository<RestaurantRank> = getManager().getRepository(RestaurantRank);
        const rankToSave: RestaurantRank = new RestaurantRank();
        rankToSave.restaurantId = ctx.request.body.restaurant_id;
        rankToSave.points = ctx.request.body.points;
        rankToSave.user = ctx.request.body.user_id;

        // validate user entity
        const existing_rank = await rankRepository.findOne({ user: rankToSave.user, restaurantId: rankToSave.restaurantId })
    if (existing_rank){
            const new_points = existing_rank.points + rankToSave.points;
            const rank = await getRepository(RestaurantRank)
            .createQueryBuilder()
            .update(RestaurantRank)
            .set({ points: new_points })
            .where("restaurantId = :restaurant_id", { restaurant_id: rankToSave.restaurantId })
            .andWhere("userId = :user_id", { user_id: rankToSave.user  })
            .execute();
        if (rank){
            ctx.status = 201;
            ctx.body = rank;
        }
        else{
            ctx.status = 400;
            ctx.body = 'Was not able to update rank.';
        }
            
    }
    else{
            // save the user contained in the POST body
            const rank = await rankRepository.save(rankToSave);
            // return CREATED status code and updated user
            ctx.status = 201;
            ctx.body = rank;
        }
    }
}