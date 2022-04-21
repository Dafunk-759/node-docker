import pg from "pg"

const pgconfig = {
  user: "zjq",
  host: "localhost",
  database: "learn_22_4_20_node_pg",
  password: "root",
  port: 5432
}

const pool = new pg.Pool(pgconfig)

async function query(...args) {
  const careField = res => ({
    command: res.command,
    rowCount: res.rowCount,
    rows: res.rows
  })

  return await pool.query(...args).then(
    res => {
      if (Array.isArray(res)) {
        return res.map(careField)
      } else {
        return careField(res)
      }
    },
    err => {
      const error = new Error(err.message)
      error.message = err.message
      error.detail = err.detail
      error.schema = err.schema
      error.table = err.table
      error.column = err.column
      error.hint = err.hint
      error.dataType = err.dataType
      error.constraint = err.constrain

      throw error
    }
  )
}

export async function inserMany(sql, data) {
  const ret = []
  for (const row of data) {
    const items = row.map((_, i) => "$" + (i + 1)).join(",")
    const q = `${sql} VALUES (${items});`
    ret.push(await query(q, row))
  }

  return ret
}

export default {
  query
}
