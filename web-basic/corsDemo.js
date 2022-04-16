import http from "http"

const routes = {
  "/api/users": (req, res) => {
    // 期望是GET请求
    console.log("Expect GET /api/users")
    // 实际是
    console.log(`Actual ${req.method} /api/users`)
    console.log("Cookie: ", req.headers.cookie)

    const data = [
      {
        name: "Tom",
        age: 12
      }
    ]

    res.statusCode = 200
    res.setHeader("Set-Cookie", "cookie=zjq")
    res.setHeader("Contet-Type", "application/json")

    // 第一层封印
    // 用于所有类型的请求
    // 包括简单请求，复杂请求，带cookie的请求
    // 必须要设置
    res.setHeader(
      "Access-Control-Allow-Origin",
      "http://localhost:3000"
    )

    // 第三层封印
    // 关于Cookie
    // 也就是说同意携带cookie的请求
    res.setHeader(
      "Access-Control-Allow-Credentials",
      "true"
    )

    // 第二层封印
    // 对于复杂请求
    // 浏览器会在实际发送请求之前发送一次
    // preflight(预检)请求
    // (注意这个请求的Method是OPTIONS)
    // 下面的headers 用于处理预检请求
    // 告诉浏览器 服务器对于跨域请求的规则
    // 浏览器收到后就会知道实际请求到底要不要发送
    if (req.method === "OPTIONS") {
      console.log(
        `
          preflight(预检, 在飞行前)
          Allow Headers: X-Token; 
          Allow method: GET
        `
      )
      res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Token"
      )
      res.setHeader("Access-Control-Allow-Methods", "GET")
    }

    res.end(JSON.stringify(data))
  }
}

http
  .createServer((req, res) => {
    console.log(`Coming Request: `, req.method, req.url)

    const route = routes[req.url]

    if (route) {
      route(req, res)
    } else {
      res.statusCode = 404
      res.setHeader(
        "Content-Type",
        "text/plain;charset=utf-8"
      )
      res.end("404 Not Found.")
    }
  })
  .listen(3001, () => {
    console.log("port 3001!!")
  })
