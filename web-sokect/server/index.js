import http from "http"
import path from "path"
import express from "express"
import { Server } from "socket.io"
import User from "./model/user.js"

const staticRoot = path.join(process.cwd(), "../view")
const port = 3000

const app = express().use(express.static(staticRoot))
const server = http.createServer(app)
const io = new Server(server)
const users = new User()

io.on("connection", socket => {
  users.add(socket)

  io.emit("someone connected", users.makeMsg(socket, "hi!"))

  console.log("a user connected")

  socket.on("disconnect", () => {
    console.log("a user disconnected")

    users.remove(socket)
  })

  socket.on("chat message", msg => {
    console.log(`Chat Message is ${msg}`)

    const userMsg = users.makeMsg(socket, msg)
    console.log("userMsg: ", userMsg)

    // io.emit 会广播给所有正在连接的用户
    io.emit("chat message", userMsg)
  })
})

server.listen(port, () => {
  console.log(`server running on port : ${port}!`)
})
