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
        const num_people = ctx.query.number_of_person || 2;

        let filtered_result = [];
        if(result && result.restaurants.length !== 0) {
            if(ctx.query.budget) { 
                const budget_per_person = parseFloat(ctx.query.budget)/parseFloat(num_people);
                filtered_result = result.restaurants.map(resto => {
                    if (resto.restaurant.average_cost_for_two <= (budget_per_person * 2)) return resto;
                });
            }
        }

        ctx.body = filtered_result;
    }

    @request('get', '/roll-restaurant')
    @summary('Get restaurants')
    @description('roll for a random restaurant.')
    public static async rollRestaurant(ctx: BaseContext) {
        const result = await getRestaurants(ctx.query);
        const num_people = ctx.query.number_of_persons || 2;
        let filtered_result = result;

        if (ctx.query.budget) {
            const budget_per_person = parseFloat(ctx.query.budget) / parseFloat(num_people);
            filtered_result = result.restaurants.filter(resto => {
                if (resto.restaurant.average_cost_for_two <= (budget_per_person * 2)) return resto;
            });
        }
        const randIndex = Math.floor(Math.random() * filtered_result.length);
        ctx.body = filtered_result[randIndex];
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