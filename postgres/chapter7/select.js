import db from "../db.js"

// select()
async function select() {
  /**
    num | name
  -----+------
    1  |  a
    2  |  b
    3  |  c

     num | value
-----+-------
   1 | xxx
   3 | yyy
   5 | zzz
  */

  await db
    .query(
      `--sql
      DROP TABLE IF EXISTS t1;
      CREATE TABLE t1 (
        num integer,
        name text
      );
    `
    )
    .then(console.log)

  await Promise.all(
    [
      [1, "a"],
      [2, "b"],
      [3, "c"],
      [4, "ddd"]
    ].map(
      async row =>
        await db
          .query(
            `--sql
      INSERT INTO t1 (num, name) VALUES
        ($1, $2)
      RETURNING *;
    `,
            row
          )
          .then(console.log)
    )
  )

  await db
    .query(
      `--sql
      DROP TABLE IF EXISTS t2;
      CREATE TABLE t2 (
        num integer,
        value text
      );
    `
    )
    .then(console.log)

  await Promise.all(
    [
      [1, "xxx"],
      [3, "yyy"],
      [5, "zzz"],
      [7, "ddd"]
    ].map(
      async row =>
        await db
          .query(
            `--sql
      INSERT INTO t2 (num, value) VALUES
        ($1, $2)
      RETURNING *;
    `,
            row
          )
          .then(console.log)
    )
  )

  await db
    .query(
      `--sql
      SELECT * FROM t1 CROSS JOIN t2;
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM t1 INNER JOIN t2 on t1.num = t2.num;
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM t1 INNER JOIN t2 USING (num);
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM t1 NATURAL INNER JOIN t2;
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM t1 LEFT JOIN t2 ON t1.num = t2.num;
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM t1 LEFT JOIN t2 USING (num);
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM t1 RIGHT JOIN t2 ON t1.num = t2.num;
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM t1 RIGHT JOIN t2 USING (num);
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM t1 FULL JOIN t2 ON t1.num = t2.num;
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM t1 CROSS JOIN t2;
    `
    )
    .then(console.log)

  //tricky
  await db
    .query(
      `--sql
      SELECT * FROM t1 LEFT JOIN t2 ON t1.num = t2.num AND t2.value = 'xxx';
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM t1 LEFT JOIN t2 USING (num);
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM t1 LEFT JOIN t2 ON t1.num = t2.num
      WHERE t2.value = 'xxx';
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM t1 INNER JOIN t2 ON t1.name = t2.value;
    `
    )
    .then(console.log)
}

// subSelect()
async function subSelect() {
  await db
    .query(
      `--sql
      SELECT *
      FROM (VALUES ('anne', 'smith'), ('bob', 'jones'), ('joe', 'blow'))
           AS names(first, last);
    `
    )
    .then(console.log)
}

// withSelect()
async function withSelect() {
  await db
    .query(
      `--sql
      WITH RECURSIVE t(n) AS (
        VALUES (1)
        UNION ALL
        SELECT (n + 1) FROM t WHERE n < 100
      )
      SELECT * FROM t;
    `
    )
    .then(console.log)
}