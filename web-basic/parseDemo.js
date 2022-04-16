import express from "express"
import path from "path"
import fs from "fs"
import { createProxyMiddleware } from "http-proxy-middleware"

express()
  .use(express.static(process.cwd()))
  .use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:3002/"
    })
  )
  .listen(3000, () => {
    console.log("port 3000!")
  })
