import { spawn } from "child_process"

const cp = spawn("npm", ["--help"])

cp.stdout
  .on("data", chunk => {
    console.log("cp on data")
  })
  .on("close", () => {
    console.log("cp close")
  })
  .pipe(process.stdout)
cp.stderr
  .on("data", chunk => {
    console.log("cp err")
  })
  .on("close", () => {
    console.log("cp err close")
  })
  .pipe(process.stderr)

cp.on("message", msg => {
  console.log("msg", msg)
})
cp.on("disconnect", () => {
  console.log("disconnect")
})
cp.on("spawn", () => {
  console.log("on spawn")
})
cp.on("error", err => {
  console.error("child_process error:", err)
})

cp.on("close", code => {
  console.log("exit with " + code)
})
