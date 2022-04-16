import http from "http"

http
  .createServer((req, res) => {
    const { url, method } = req
    console.log(`URL: ${url}; METHOD: ${method}`)
    if (url === "/api/save" && method === "POST") {
      let body = ""
      req.on("data", chunk => {
        const s = chunk.toString()
        console.log("chunk")
        body += s
      })

      req.on("end", () => {
        console.log("body")
      })

      res.end("success")
    }
  })
  .listen(3002, () => {
    console.log("Port 3002.")
  })
