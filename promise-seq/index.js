console.log(`
  需要给Array.prototype加3个方法
  1. forAwaitEach
  2. awaitMap
  3. awaitReduce
`)

/**
 * `cb :: (val, index) => Promise<any>`
 *
 * @return `Promise<void>`
 */
Array.prototype.forAwaitEach = async function (cb) {
  for (let i = 0; i < this.length; i++) {
    await cb(this[i], i)
  }
}

// testForAwaitEach()
async function testForAwaitEach() {
  const delays = Array.from({ length: 5 }, () => 500)

  // 2.5s 后 acc == 5
  const now = startTimer()
  let acc = 0
  await delays.forAwaitEach(async (ms, i) => {
    console.log(`i: ${i}; time: ${now()}`)
    acc += await delay(ms)
  })

  console.log(`acc: ${acc}; time: ${now()}`)
}

/**
 * `cb :: (val, i) => Promise<otherVal>`
 *
 * @return `Proimse<otherVal>[]`
 */
Array.prototype.awaitMap = async function (cb) {
  const ret = []
  for (let i = 0; i < this.length; i++) {
    ret.push(await cb(this[i], i))
  }
  return ret
}

// testAwaitMap()
async function testAwaitMap() {
  const arr = [1, 2, 3, 4, 5]

  const now = startTimer()
  const ret = await arr.awaitMap(async (val, i) => {
    console.log(`i: ${i}; time: ${now()}`)
    await delay(500)
    return val + 1
  })

  console.log(`ret: ${ret}; time: ${now()}`)
}

/**
 * `reducer :: (acc, cur, i) => Promise<acc>`
 *
 * @return Promise<acc>
 */
Array.prototype.awaitReduce = async function (
  reducer,
  init
) {
  let acc = init ?? this[0]

  for (let i = 0; i < this.length; i++) {
    acc = await reducer(acc, this[i], i)
  }

  return acc
}

testAwaitReduce()
async function testAwaitReduce() {
  const arr = Array.from({ length: 10 }, (_, i) => i)

  const now = startTimer()
  const ret = await arr.awaitReduce(async (acc, cur) => {
    console.log(`acc: ${acc}; time: ${now()}`)
    await delay(500)
    return acc + cur
  })

  console.log(`ret: ${ret}; time: ${now()}`)
}

function startTimer() {
  let now = Date.now()
  return () => Date.now() - now
}

function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1)
    }, ms)
  })
}

function delay_unsafe(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.2) {
        reject(new Error("some err"))
      } else {
        resolve(1)
      }
    }, ms)
  })
}
