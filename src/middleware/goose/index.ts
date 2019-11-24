import { splitWiseToken } from '../../controller/goose/hooks';

export async function GooseMiddleware(ctx :any, next :any) {
  const sw = await splitWiseToken();
  console.log(sw)
  if(sw && sw.status == 'unauthorized') {
    ctx.body = {
        success: false,
        link: sw.value,
        message: 'Unauthorized Splitwise',
    }
    return
  }

  ctx.state.splitwise = sw
  await next()
}