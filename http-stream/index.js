import http from "http"
import fs from "fs/promises"

const routes = {
  "/": (req, res) =>
    fs.readFile("./index.html").then(
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
  "/users": (req, res) => {
    const data = [
      {
        name: "Tom",
        age: 12
      }
    ]

    res.statusCode = 200
    res.setHeader("Contet-Type", "application/json")
    res.end(JSON.stringify(data))
  },
  "/img": (req, res) => {
    console.log("headers", req.headers.accept)

    res.end("img")
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

// http
//   .createServer((req, res) =>
//     new Promise((resolve, reject) => {
//       if (req.url === "/" && req.method === "GET") {
//         resolve(req)
//       } else {
//         reject(404)
//       }
//     })
//       .then(req =>
//         fs.readFile("./index.html").catch(_ => {
//           throw 500
//         })
//       )
//       .then(content => {
//         res.statusCode = 200
//         res.setHeader("Contet-Type", "text/html")
//         res.end(content)
//       })
//       .catch(errCode => {
//         console.log("errCode", errCode)

//         res.statusCode = errCode
//         res.setHeader(
//           "Content-Type",
//           "text/plain;charset=utf-8"
//         )
//         if (errCode === 500) {
//           res.end("500 Server Error")
//         } else if (errCode === 404) {
//           res.end("404 Not Found")
//         }
//       })
//   )
//   .listen(3000, () => {
//     console.log("port 3000!!")
//   })
