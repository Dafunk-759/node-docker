import fs from "fs"
import http from "http"
import {
  Writable,
  Readable,
  Duplex,
  Transform
} from "stream"
import zlib from "zlib"
import crypto from "crypto"

function e1() {
  // http 发送大文件
  const server = http.createServer()

  server.on("request", (req, res) => {
    const src = fs.createReadStream("./big.file")
    src.pipe(res)
  })

  server.listen(8000)
}

function e2() {
  // 写大文件 降低内存消耗的方法
  console.log("1")
  write(1e6)
  console.log("2")
  const file = fs.createWriteStream("./big.file")
  function write(i) {
    if (i < 0) {
      file.end(() => {
        console.log("write end")
      })
      return
    }
    setTimeout(() => {
      const content = `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n`
      file.write(content)
      write(i - 1)
    }, 0)
  }
}

function e3() {
  // pipe under the hood
  const rs = fs.createReadStream("./view.jpg")
  const ws = fs.createWriteStream("./view3.jpg")
  rs.on("data", chunk => {
    console.log("chunk in coming...")
    ws.write(chunk)
  })
  rs.on("end", () => {
    console.log("done.")
    ws.end()
  })
}

function e4() {
  // 创建Writable
  const toUpper = new Writable({
    write: (chunk, encoding, cb) => {
      console.log("encoding is:", encoding)

      try {
        console.log(chunk.toString().toUpperCase())
      } catch (err) {
        err.message =
          "chunk.toString().toUpperCase() failed!"
        console.error(err)
        cb(err)
      }
    }
  })

  // process.stdin.pipe(toUpper)

  // 创建Readable
  const readableA = new Readable({
    read: (() => {
      let curCharCode = 65
      return function (size) {
        this.push(String.fromCharCode(curCharCode++))
        if (curCharCode > 90) {
          this.push(null)
        }
      }
    })()
  })

  // readableA.pipe(process.stdout)

  // 创建Duplex
  const dup = new Duplex({
    write(chunk, encoding, callback) {
      console.log(chunk.toString())
      callback()
    },
    read: (() => {
      let curCharCode = 65
      return function (size) {
        this.push(String.fromCharCode(curCharCode++))
        // if (curCharCode > 90) {
        //   this.push(null)
        // }
      }
    })()
  })

  // process.stdin.pipe(dup).pipe(process.stdout)

  const transformer = transform => {
    return function (chunk, encoding, cb) {
      try {
        let data = transform(chunk, encoding)
        cb(undefined, data) // 这里调用cb 相当于push data
      } catch (err) {
        cb(err, undefined)
      }
    }
  }

  // Transforms
  const upper = new Transform({
    transform: transformer(chunk =>
      chunk.toString().toUpperCase()
    )
  })

  // process.stdin.pipe(upper).pipe(process.stdout)

  const commaSplitter = new Transform({
    readableObjectMode: true,
    transform: transformer(chunk =>
      chunk.toString().trim().split(",")
    )
  })

  const arrayToObj = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,

    transform: transformer(chunk => {
      const obj = {}
      for (let i = 0; i < chunk.length; i += 2) {
        obj[chunk[i]] = chunk[i + 1]
      }
      return obj
    })
  })

  const objectToString = new Transform({
    writableObjectMode: true,
    transform: transformer(
      chunk => JSON.stringify(chunk) + "\n"
    )
  })

  process.stdin
    .pipe(commaSplitter)
    .pipe(arrayToObj)
    .pipe(objectToString)
    .pipe(process.stdout)
}

function e5() {
  const file = process.argv[2]

  // 文件压缩示例
  fs.createReadStream(file)
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(file + ".gz"))
}

function e6() {
  const file = process.argv[2]

  // 文件压缩示例
  fs.createReadStream(file)
    .pipe(zlib.createGzip())
    .on("data", () => process.stdout.write("."))
    .pipe(fs.createWriteStream(file + ".zz"))
    .on("finish", () => console.log("Done"))
}

e7()
function e7() {
  const file = process.argv[2]

  const reportProgress = new Transform({
    transform(chunk, encoding, callback) {
      process.stdout.write(".")
      callback(null, chunk)
    }
  })

  // 文件压缩示例
  fs.createReadStream(file)
    .pipe(zlib.createGzip())
    .pipe(crypto.createCipher("aes192", "a_secret"))
    .pipe(reportProgress)
    .pipe(fs.createWriteStream(file + ".zz"))
    .on("finish", () => console.log("Done"))
}
