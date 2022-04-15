import http from "http"
import { readFile } from "fs/promises"
import { createReadStream } from "fs"

const routes = {
  "/": (req, res) =>
    readFile("./index.html").then(
      content => {
        res.statusCode = 200
        res.setHeader("Contet-Type", "text/html")
        res.end(content)
      },
      _ => {
        res.statusCode = 500
        res.setHeader(
          "Content-Type",
          "text/plain;charset=utf-8"
        )
        res.end("500 server error.")
      }
    ),
  "/api/users": (req, res) => {
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
  .listen(3000, () => {
    console.log("port 3000!!")
  })
