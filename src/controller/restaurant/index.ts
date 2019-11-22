import { BaseContext } from 'koa';
import { description, request, summary, tagsAll } from 'koa-swagger-decorator';
import { getRestaurants } from './hooks'
@tagsAll(['Restaurant'])
export default class RestaurantController {

    @request('get', '/restaurants')
    @summary('List of restaurants')
    @description('Restaurants description here.')
    public static async getAll(ctx: BaseContext) {
        const result = await getRestaurants()
        console.log(result)
        ctx.body = result
    }

}