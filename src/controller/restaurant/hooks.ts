import Axios, { AxiosResponse } from 'axios'

const zomate_token = process.env.ZOMATO_KEY
const zomate_url = process.env.ZOMATO_URL

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