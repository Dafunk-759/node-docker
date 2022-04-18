import fs from "fs"
import path from "path"
import Person from "./genPerson.js"

/**
 * 用法:
 *  node index.js ${count}
 * count 是要生成的记录数
 */

const count = Number(process.argv[2])
const filePath = path.resolve(
  process.cwd(),
  "seedPersonTable.sql"
)

if (Number.isNaN(count) || count < 0) {
  throw new Error("Invalid count!")
}

console.log(`
start writing ${count} record into ${filePath}!
`)

const to = fs.createWriteStream(filePath)

to.write(Person.dropTableStatement + "\n")
to.write(Person.createTableStatement + "\n")

for (let i = 0; i < count; i++) {
  to.write(Person.genPerson() + "\n")
  console.log(`inserted ${i + 1} person..`)
}

to.end(() => {
  console.log("\ndone.\n")
})
