import pg from "pg"

const pgconfig = {
  user: "zjq",
  host: "localhost",
  database: "learn_22_4_20_node_pg",
  password: "root",
  port: 5432
}

const client = new pg.Client(pgconfig)
;(async () => {
  // use pool
  // const pool = new pg.Pool(pgconfig)

  // const res = await pool.query(`SELECT now()`).catch(err => {
  //   throw err
  // })

  // console.log("res:", res)

  await client.connect()

  const res = await client
    .query(
      `--sql
      SELECT now()
      `
    )
    .catch(err => {
      throw err
    })

  console.log(res.rows, res.fields, res.command)
})().finally(() => {
  client.end(err => {
    if (err) {
      throw err
    }
  })
})
