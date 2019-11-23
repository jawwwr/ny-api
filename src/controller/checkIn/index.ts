import { BaseContext } from 'koa';
import { getManager, getRepository, Repository, Not, Equal, Like, AdvancedConsoleLogger } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import { request, summary, path, body, responsesAll, tagsAll } from 'koa-swagger-decorator';
import { User } from '../../entity/user/User';
import { CheckIn } from '../../entity/check_in/CheckIn';
import { PointBreakdown } from '../../entity/point_breakdown/PointBreakdown';
import { restaurant_rank } from '../index';


@responsesAll({ 200: { description: 'success'}, 400: { description: 'bad request'}, 401: { description: 'unauthorized, missing/wrong jwt token'}})
@tagsAll(['User'])
export default class CheckInController {

    @request('get', '/check-ins')
    @summary('Find all check-ins')
    public static async getAllUserCheckIn(ctx: BaseContext) {

        // get a user repository to perform operations with checkIn
        const checkInRepository: Repository<CheckIn> = getManager().getRepository(CheckIn);

        // load all checkIns
        const checkIns: CheckIn[] = await checkInRepository.find();

        // return OK status code and loaded users array
        ctx.status = 200;
        ctx.body = checkIns;
    }

    @request('get', '/check-in/{user-id}')
    @summary('Find all check-ins by user')
    @path({
        id: { type: 'number', required: true, description: 'id of user' }
    })
    public static async getUserCheckIn(ctx: BaseContext) {

        // load user by id

        const checkIns = await getRepository(CheckIn)
            .createQueryBuilder('checkIns')
            .where('checkIns.userId = :id', { id: +ctx.params.user_id })
            .getMany();

        if (checkIns) {
            // return OK status code and loaded user object
            ctx.status = 200;
            ctx.body = checkIns;
        } else {
            // return a BAD REQUEST status code and error message
            ctx.status = 400;
            ctx.body = 'The user you are trying to retrieve doesn\'t exist in the db';
        }

    }

    @request('post', '/check-in')
    @summary('Create a check in')
    // @body(userSchema)
    public static async createCheckIn(ctx: BaseContext) {

        // get a user repository to perform operations with user
        const checkInRepository: Repository<CheckIn> = getManager().getRepository(CheckIn);
        const user = await getRepository(User)
            .createQueryBuilder('user')
            .where('user.id = :id', { id: +ctx.request.body.user_id })
            .getOne();

        const pointbreakdown = await getRepository(PointBreakdown).createQueryBuilder('point')
            .where('point.id = :id', { id: 1 })
            .getOne();

        // build up entity user to be saved
        const checkInToSave: CheckIn = new CheckIn();
        const today = new Date();
        // get corresponding point from PoinBreakdown Table
        ctx.request.body.points =  pointbreakdown.point;

        checkInToSave.restaurantId = ctx.request.body.restaurant_id;
        checkInToSave.points = ctx.request.body.points;
        checkInToSave.time = today;
        checkInToSave.latitude = ctx.request.body.latitude;
        checkInToSave.longitude = ctx.request.body.longitude;
        checkInToSave.user = ctx.request.body.user_id;
        // validate user entity

        if (parseFloat(ctx.request.body.latitude) < (parseFloat(ctx.request.body.restaurant_latitude) + 0.0001) && parseFloat(ctx.request.body.latitude) > (parseFloat(ctx.request.body.restaurant_latitude) - 0.0001) ) {
            if (parseFloat(ctx.request.body.longitude) < parseFloat(ctx.request.body.restaurant_longitude) + 0.0001 && parseFloat(ctx.request.body.longitude) > parseFloat(ctx.request.body.restaurant_longitude) - 0.0001 ) {
                const hours = (checkInToSave.time).valueOf() - (user.lastCheckInTime).valueOf();
                // if last check in time is greater then 2 hours offset
                if (hours < 2 ) {
                    // return BAD REQUEST status code and email already exists error
                    ctx.status = 400;
                    ctx.body = 'Check in still on cooldown';
                } else {
                    // save the user contained in the POST body

                    const checkIn = await checkInRepository.save(checkInToSave);
                    await restaurant_rank.createRank(ctx);
                    // return CREATED status code and updated user
                    ctx.status = 201;
                    ctx.body = checkIn;
                }
            } else {
                ctx.status = 400;
                ctx.body = 'You are not within check-in distance!';
            }

        } else {
            ctx.status = 400;
            ctx.body = 'You are not within check-in distance!';
        }



    }

}
