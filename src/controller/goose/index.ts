import { BaseContext } from 'koa';
import { description, request, summary, tagsAll } from 'koa-swagger-decorator';
import { splitWiseToken, getConnectionsHooks } from './hooks';

@tagsAll(['Goose'])
export default class GooseController {

    @request('get', '/goose')
    @summary('List of goose')
    @description('Goose description here.')
    public static async getAll(ctx: BaseContext) {
        ctx.body = 'Goose';
    }

    public static async getConnections(ctx: BaseContext) {
        const connections = await getConnectionsHooks(ctx)
        ctx.body = connections
    }

    @request('get', '/goose')
    @summary('Create goose')
    @description('Goose description here.')
    public static async create(ctx: BaseContext) {
        const restaurant = 18097006;
        const bill = 1200;
        const person_count = 4;
        const splitwise_token = await splitWiseToken();

        ctx.body = splitwise_token;
    }

    @request('get', '/goose')
    @summary('checkAuth goose')
    @description('Goose description here.')
    public static async checkAuth(ctx: BaseContext) {
        const splitwise_token = await splitWiseToken();
        ctx.body = splitwise_token;
    }
}