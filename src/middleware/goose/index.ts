import { splitWiseToken } from '../../controller/goose/hooks';

export async function GooseMiddleware(ctx :any, next :any) {
  const splitwise_token = await splitWiseToken();
  console.log(splitwise_token)
}