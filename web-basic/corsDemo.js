import http from "http"

const routes = {
  "/api/users": (req, res) => {
    // 期望是GET请求
    console.log("Expect GET /api/users")
    // 实际是
    console.log(`Actual ${req.method} /api/users`)

    const data = [
      {
        name: "Tom",
        age: 12
      }
    ]

    res.statusCode = 200
    res.setHeader("Contet-Type", "application/json")
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
