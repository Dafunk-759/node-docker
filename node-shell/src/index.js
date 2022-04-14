import path from "path"
import shell from "shelljs"

shell.ls("-R", "testdir/**/*.js").forEach(file => {
  let { dir, name, ext } = path.parse(file)
  dir = path.join(dir, "__test__")

  let spec = path.format({
    dir,
    base: name + ".spec" + ext
  })

  console.log("making dir:", dir)
  shell.mkdir(dir)

  console.log("making spec", spec)
  shell.touch(spec)
})

// shell.rm("-rf", "testdir/**/__test__")
