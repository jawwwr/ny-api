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
            Splitwise: sw,
            value: token,
            status: 'authorized'
        };
    } catch (e) {
        return e;
    }
}

export async function getConnectionsHooks(ctx) {
    const { splitwise } = ctx.state
    console.log(ctx.state)
    console.log(userOAuthToken)
    console.log(splitwise)

    const sw = Splitwise({
        consumerKey: sw_key,
        consumerSecret: sw_secret,
        accessToken: splitwise.value
    });

    const token = await splitwise.Splitwise.getAccessToken();
    const friends = await splitwise.Splitwise.getFriends();
    const expenses = await splitwise.Splitwise.getExpenses();
    const groups = await splitwise.Splitwise.getGroups()
    const profile = await splitwise.Splitwise.getCurrentUser()
    return {
        friends,
        expenses,
        groups,
        profile,
        token,
    }
}