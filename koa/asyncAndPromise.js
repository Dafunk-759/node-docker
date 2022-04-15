// main()
async function main() {
  try {
    let s1 = await asyncTask(false).catch(_ => {
      throw 1
    })

    let s2 = await asyncTask(false).catch(_ => {
      console.log("after throw 1")

      throw 2
    })

    console.log("after throw 2")
    console.log("s1: ", s1)
    console.log("s2: ", s2)
  } catch (err) {
    console.log("err:", err)
  }
}

// main2()
function main2() {

  return asyncTask(false)
    .catch(_ => {
      console.log("first catch")
      throw 1
    })
    .then(s1 => {
      console.log("first then")
      return asyncTask(false)
        .then(s2 => ({ s1, s2 }))
        .catch(_ => {
          console.log("second catch")
          throw 2
        })
    })
    .then(({ s1, s2 }) => {
      console.log("s1:", s1)
      console.log("s2:", s2)
    })
    .catch(e => {
      console.log("final catch")
      console.log("e:", e)
    })
}

function asyncTask(err = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (err) {
        reject("fail")
      } else {
        resolve("success")
      }
    }, 1000)
  })
}
