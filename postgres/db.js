import pg from "pg"

const pgconfig = {
  user: "zjq",
  host: "localhost",
  database: "learn_22_4_20_node_pg",
  password: "root",
  port: 5432
}

const pool = new pg.Pool(pgconfig)

export async function inserMany(sql, data) {
  const ret = []
  for (const row of data) {
    const items = row.map((_, i) => "$" + (i + 1)).join(",")
    const q = `${sql} VALUES (${items});`
    ret.push(await pool.query(q, row))
  }

  return ret
}

export default pool
