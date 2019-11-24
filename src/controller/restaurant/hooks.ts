import Axios, { AxiosResponse } from 'axios';

const zomate_token = process.env.ZOMATO_KEY;
const zomate_url = process.env.ZOMATO_URL;

export async function getRestaurants(filters: any = {}) {
    try {
        const config = {
            headers: {
                // tslint:disable-next-line:object-literal-key-quotes
                'user-key': zomate_token,
                'content-type': 'application/json',
            },
        };

        const param_filter = Object.entries(filters).map(([key, val]) => `${key}=${val}`).join('&');
        console.log(param_filter)
        console.log(`${zomate_url}/search?${param_filter}&count=50`)
        const request = await Axios.get(
            `${zomate_url}/search?${param_filter}&count=50`,
            config,
        );

        return request.data;
    } catch (e) {
        return e;
    }
}

export async function getRestaurant(id: number) {
    try {
        const config = {
            headers: {
                // tslint:disable-next-line:object-literal-key-quotes
                'user-key': zomate_token,
                'content-type': 'application/json',
            },
        };

        const request = await Axios.get(
            `${zomate_url}/restaurant?res_id=${id}`,
            config,
        );

        return request.data;
    } catch (e) {
        return e;
    }
}

export async function getRestaurantCuisines(coordinates: any) {
    try {
        const config = {
            headers: {
                // tslint:disable-next-line:object-literal-key-quotes
                'user-key': zomate_token,
                'content-type': 'application/json',
            },
        };
        const param_coordinates = Object.entries(coordinates).map(([key, val]) => `${key}=${val}`).join('&');
        const request = await Axios.get(
            `${zomate_url}/cuisines?${param_coordinates}`,
            config,
        );

        return request.data;
    } catch (e) {
        return e;
    }
}