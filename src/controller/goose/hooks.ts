import Axios from 'axios';
import SplitwiseAuthApi from 'splitwise-node';
import Splitwise from 'splitwise';

const sw_key = process.env.SPLITWISE_KEY;
const sw_secret = process.env.SPLITWISE_SECRET;

let userOAuthToken, userOAuthTokenSecret;

async function splitWiseAuthUser() {
    const authApi = new SplitwiseAuthApi(sw_key, sw_secret);
    const { token, secret } = await authApi.getOAuthRequestToken();
    userOAuthToken = token;
    userOAuthTokenSecret = secret;
    return {
        value: authApi.getUserAuthorisationUrl(token),
        status: 'unauthorized'
    };
}

export async function splitWiseToken() {
    try {
        if (!userOAuthToken || !userOAuthTokenSecret) {
            return splitWiseAuthUser();
        }
        const sw = Splitwise({
            consumerKey: sw_key,
            consumerSecret: sw_secret,
            accessToken: userOAuthToken
        });
        const token = await sw.getAccessToken();
        return {
            value: token,
            status: 'authorized'
        };
    } catch (e) {
        return e;
    }
}

export async function getConnectionsHooks(ctx) {
    const { splitwise } = ctx.state

    const sw = Splitwise({
        consumerKey: sw_key,
        consumerSecret: sw_secret,
        accessToken: userOAuthToken
    });

    const friends = await sw.getFriends();
    const expenses = await sw.getExpenses();
    const groups = await sw.getGroups()
    const profile = await sw.getCurrentUser()

    return {
        expenses,
        splitwise,
        friends,
        groups,
        profile
    }
}