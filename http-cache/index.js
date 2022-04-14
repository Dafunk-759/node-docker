import http from "http"
import crypto from "crypto"

let currentTime = new Date().toLocaleString()

setInterval(() => {
  currentTime = new Date().toLocaleString()
}, 5000)

http
  .createServer((req, res) => {
    let content = (() => {
      switch (req.url) {
        case "/":
          return `
            <html>
              Html Update Time ${currentTime}<br/>
              <script src="main.js"></script>
            </html>
          `
        case "/main.js":
          // 强缓存
          // res.statusCode = 200
          // res.setHeader(
          //   "Expires",
          //   new Date(Date.now() + 10_000).toUTCString()
          // )
          // res.setHeader("Cache-Control", "max-age=20")

          // 协商缓存
          // res.setHeader("Cache-Control", "no-cache")
          // res.setHeader(
          //   "last-modified",
          //   new Date().toUTCString()
          // )

          // let ims = req.headers["if-modified-since"]
          // if (
          //   ims &&
          //   new Date(ims).getTime() + 3000 > Date.now()
          // ) {
          //   console.log("协商缓存命中")
          //   res.statusCode = 304
          //   return
          // }

          //Etag
          const content = `
            document
              .writeln('JS update time ${currentTime}');
          `
          const hash = crypto
            .createHash("sha1")
            .update(content)
            .digest("hex")
          res.setHeader("Etag", hash)

          let lastEtag = req.headers["if-none-match"]
          if (lastEtag && lastEtag === hash) {
            console.log("缓存命中")
            res.statusCode = 304
            return
          }

          return content
        case "/favicon.ico":
          return ""
      }
    })()

    res.end(content)
  })
  .listen(3000, () => {
    console.log("listen on port 3000.")
  })
