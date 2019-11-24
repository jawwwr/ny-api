import { splitWiseToken } from '../../controller/goose/hooks';

export async function GooseMiddleware(ctx :any, next :any) {
  try {
    const sw = await splitWiseToken();
    console.log(sw)
    if(sw.status === 'unauthorized') {
      ctx.status = 401
      ctx.body = {
          Success: false,
          success: false,
          link: sw.value,
          message: 'Unauthorized Splitwise',
      }
      return
    } else {
      ctx.state.splitwise = sw
      await next()
    }
  }catch(e) {
    ctx.status = 401
    ctx.body = {
        Success: false,
        success: false,
        data: e,
        message: 'Some problem occured.',
    }
    return

  }
}