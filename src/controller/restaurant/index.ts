import { BaseContext } from 'koa';
import { description, request, summary, tagsAll } from 'koa-swagger-decorator';
import { getRestaurant, getRestaurants, getRestaurantCuisines } from './hooks';
@tagsAll(['Restaurant'])
export default class RestaurantController {

    @request('get', '/restaurants')
    @summary('List of restaurants')
    @description('Restaurants description here.')
    public static async getAll(ctx: BaseContext) {
        const result = await getRestaurants(ctx.query);
        ctx.body = result;
    }

    @request('get', '/restaurants/id')
    @summary('Get restaurants')
    @description('Restaurant description here.')
    public static async get(ctx: BaseContext) {
        const { id } = ctx.params;
        const result = await getRestaurant(id);
        ctx.body = result;
    }

    public static async getCuisines(ctx: BaseContext) {
        const result = await getRestaurantCuisines(ctx.query);
        ctx.body = result;
    }

}