/**
 * 聊天室小demo
 */
import net from "net"

const clients = new Set()
const server = net.createServer()


const matchChar = (char, matcher) => {
  const codeTabel = {
    13: "end",
    8: "del"
  }

  const charKand = codeTabel[char.charCodeAt(0)]

  if (charKand !== undefined) {
    return matcher[charKand]()
  } else {
    return matcher.default()
  }
}

server.on("connection", socket => {
  console.log("connected")
  clients.add(socket)
  let userWord = ""

  socket.on("data", chunk => {
    let char = chunk.toString()
    console.log("char: ", char)
    console.log("char code: ", char.charCodeAt(0))

    matchChar(char, {
      // 当用户输入回车
      end: () => {
        console.log(
          "User Input is: ",
          userWord,
          "length: ",
          userWord.length
        )

        if (userWord === ":quit") {
          console.log("quiting...")
          // 结束当前用户的流 并在用户列表中移除这个用户
          socket.end()
          clients.delete(socket)
          return
        }

        // 为正在与服务器连接的所有用户广播
        clients.forEach(c => {
          c.write(userWord + "\n")
        })
        userWord = ""
        console.log("end")
      },
      del: () => {
        userWord = userWord.slice(0, -1)
        console.log("del")
      },
      default: () => {
        userWord += char
        console.log("default")
      }
    })
  })

  socket.write(`Welcome!! Type ":quit" to quit.\n`)
})

server.on("close", () => {
  console.log("close")
})

server.on("error", err => {
  console.log("err: ", err)
})

server.on("listening", () => {
  console.log("listening")
})

server.listen(3000, () => {
  console.log("listening on port 3000.")
})
