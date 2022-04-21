import db, { inserMany } from "../db.js"

// insert()
async function insert() {
  await db
    .query(
      `--sql
      DROP TABLE IF EXISTS products;
      CREATE TABLE products (
        product_no integer,
        name text,
        price numeric
      );
    `
    )
    .then(console.log)

  // await db
  //   .query(
  //     `--sql
  //     INSERT INTO products VALUES (1, 'Cheese', DEFAULT);
  //     INSERT INTO products DEFAULT VALUES;
  //   `
  //   )
  //   .then(console.log)

  await db
    .query(
      `--sql
      INSERT INTO products (name, product_no, price) VALUES
        ('Cheese', 2, 20.5),
        ('Noodle', 3, 30.5);
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      INSERT INTO products (name, product_no, price) VALUES
        ($1, $2, $3)
      RETURNING *;
    `,
      ["Breed", 1, 10.5]
    )
    .then(console.log)

  // 插入查询的结果
  await db
    .query(
      `--sql
      INSERT INTO products (name, product_no, price)
        SELECT name, product_no, price FROM products;
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM products;
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      DROP TABLE products;
    `
    )
    .then(console.log)
}

// update()
async function update() {
  await db
    .query(
      `--sql
      DROP TABLE IF EXISTS products;
      CREATE TABLE products (
        product_no integer,
        name text,
        price numeric
      );
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      INSERT INTO products VALUES
        (0, 'Cheese', 10.5),
        (1, 'Breed', 10),
        (2, 'Cat', 20.5),
        (3, 'Dog', 30.5)
    `
    )
    .then(console.log)

  // normal
  // await db
  //   .query(
  //     `--sql
  //     UPDATE products SET price = price + 5
  //     WHERE price = 10;
  //   `
  //   )
  //   .then(console.log)

  await db
    .query(
      `--sql
      UPDATE products SET price = $1
      WHERE name = 'Cat';
    `,
      ["100"]
    )
    .then(console.log)

  await db
    .query(
      `--sql
      INSERT INTO products (name) VALUES
        ($1)
      RETURNING *;
    `,
      ["coffe"]
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM products;
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      DROP TABLE products;
    `
    )
    .then(console.log)
}

async function deleteTable(arg) {
  await db
    .query(
      `--sql
      DROP TABLE IF EXISTS products;
      CREATE TABLE products (
        name text,
        price numeric
      );
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      INSERT INTO products (name, price) VALUES
        ('cat', 1.5),
        ('dog', 2.5);
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM products;
    `
    )
    .then(console.log)

  // 删除匹配的行
  await db
    .query(
      `--sql
      DELETE FROM products WHERE name = 'dog';
    `
    )
    .then(console.log)

  //删除整张表
  // await db
  //   .query(
  //     `--sql
  //     DELETE FROM products;
  //   `
  //   )
  //   .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM products;
    `
    )
    .then(console.log)
}

returning()
async function returning() {
  await db
    .query(
      `--sql
      DROP TABLE IF EXISTS users;
      CREATE TABLE users (
        firstname text,
        lastname text,
        id serial primary key
      );
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      INSERT INTO users (firstname, lastname) VALUES
        ('Zhang', 'Jiaqi')
      RETURNING *;
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      UPDATE users SET lastname = 'JQ'
      WHERE id = 1
      RETURNING *;
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      DELETE FROM users WHERE id = 1
      RETURNING *;
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * FROM users;
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      DROP TABLE IF EXISTS users;
    `
    )
    .then(console.log)
}
