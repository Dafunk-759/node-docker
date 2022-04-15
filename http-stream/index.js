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
  "/view.jpg": (req, res) => {
    createReadStream("./view.jpg")
      .on("data", chunk => {
        console.log("Reading...")
      })
      .on("error", err => {
        res.statusCode = 500
        res.end("500 server error")
      })
      .pipe(res)
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
