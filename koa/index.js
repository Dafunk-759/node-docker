import Koa from "koa"
import Router from "./my-router-mw/main.js"

new Koa()
  .use(
    new Router()
      .get("/", ctx => {
        ctx.body = "0"
      })
      .get("/1", ctx => {
        ctx.body = "1"
      })
      .get("/2", ctx => {
        ctx.body = "2"
      })
      .routes()
  )
  .listen(3000, () => {
    console.log("listen on 3000.")
  })
