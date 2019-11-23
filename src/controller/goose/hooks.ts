import Axios from 'axios'
import SplitwiseAuthApi from 'splitwise-node'
import Splitwise from 'splitwise'

const zomate_token = process.env.ZOMATO_KEY
const zomate_url = process.env.ZOMATO_URL
const sw_key = process.env.SPLITWISE_KEY
const sw_secret = process.env.SPLITWISE_SECRET

let userOAuthToken, userOAuthTokenSecret;

async function splitWiseAuthUser() {
    const authApi = new SplitwiseAuthApi(sw_key, sw_secret);
    const { token, secret } = await authApi.getOAuthRequestToken()
    userOAuthToken = token
    userOAuthTokenSecret = secret
    return authApi.getUserAuthorisationUrl(token);
}

export async function splitWiseToken() {
    try {
        if(!userOAuthToken || !userOAuthTokenSecret) {
            return splitWiseAuthUser()
        } 
        const sw = Splitwise({
            consumerKey: sw_key,
            consumerSecret: sw_secret,
            accessToken: userOAuthToken
        })
        const token = await sw.getAccessToken()
        return token;
    }catch(e) {
        return e
    }
}


export async function getRestaurants() {
    try {
        const config = {
            headers: {
                // tslint:disable-next-line:object-literal-key-quotes
                'user-key': zomate_token,
                'content-type': 'application/json',
            },
        }

        const request = await Axios.get(
            `${zomate_url}/search?lat=10.334300&lon=123.892790&sort=rating&radius=10000`,
            config,
        )
        return request.data
    } catch (e) {
        return undefined
    }
}