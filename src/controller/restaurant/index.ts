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
        let filtered_result = result;

        // const number_of_people = ;
        if(ctx.query.budget) { 
            const budget_per_person = parseFloat(ctx.query.budget)/parseFloat(ctx.query.number_of_persons || 1);
            const ceil_per_person = budget_per_person + 100;
        
            filtered_result = result.restaurants.map(resto => {
                if(resto.restaurant.average_cost_for_two <= (ceil_per_person * 2) && resto.restaurant.average_cost_for_two <= (budget_per_person * 2)) return resto
            });
        } 
        
        ctx.body = filtered_result;
    }

    // @request('get', '/roll-restaurant')
    // @summary('Get restaurants')
    // @description('roll for a random restaurant.')
    // public static async rollRestaurant(ctx: BaseContext) {
    //     const result = await getRestaurants(ctx.query);
    //     const num_people = ctx.query.number_of_persons || 2;
    //     let filtered_result = result;

    //     console.log(num_people)
    //     if(ctx.query.budget) { 
    //         let budget_per_person = parseFloat(ctx.query.budget)/parseFloat(num_people);
    //         let ceil_per_person = budget_per_person + 100;
    //         filtered_result = result.restaurants.filter(resto => {
    //             console.log("========"+resto.restaurant.average_cost_for_two)
    //             console.log(ceil_per_person * 2+"========")
    //             if(resto.restaurant.average_cost_for_two >= (budget_per_person * 2) && resto.restaurant.average_cost_for_two <= (ceil_per_person * 2)) return resto
    //         });
    //     } 
    //     console.log(filtered_result.length) 
    //     const randIndex = Math.floor(Math.random() * filtered_result.length)
    //     console.log(randIndex)
    //     console.log(filtered_result)        
    //     ctx.body = filtered_result[randIndex];
    // }
    

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