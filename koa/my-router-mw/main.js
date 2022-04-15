export default class Router {
  /**
   *  {
   *    get: {
   *      "/": ctx => {},
   *      "/user": ctx => {}
   *    }
   *  }
   */
  matchTable = {}

  get(path, handler) {
    if (this.matchTable.get === undefined) {
      this.matchTable.get = {}
    }
    this.matchTable.get[path] = handler
    return this
  }

  routes() {
    let matchTable = this.matchTable

    return async function (ctx, next) {
      let { url, method } = ctx
      method = method.toLowerCase()

      matchTable?.[method]?.[url]?.(ctx)

      console.log("url: ", url, "method: ", method)

      await next()
    }
  }
}
