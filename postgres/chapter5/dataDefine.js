import db, { inserMany } from "../db.js"

// myFirstTable()
async function myFirstTable() {
  await db
    .query(
      `--sql
    CREATE TABLE my_first_table (
      first_col text,
      second_col text
    )
  `
    )
    .then(console.log)
}

// products()
async function products() {
  await db
    .query(
      `--sql
    CREATE TABLE products (
      product_no integer,
      name text,
      price numeric
    )
  `
    )
    .then(console.log)
}

// dropTopTwo()
async function dropTopTwo() {
  db.query(
    `--sql
    DROP TABLE my_first_table;
    DROP TABLE products;
  `
  ).then(console.log)
}

// productsWithDefault()
async function productsWithDefault() {
  await db
    .query(
      `--sql
    DROP TABLE products;
    CREATE TABLE products ( 
      name text,
      product_no serial,
      price numeric DEFAULT 9.99
    )
  `
    )
    .then(console.log)

  await db
    .query(
      `--sql
    INSERT INTO products VALUES ($1, $2)
  `,
      ["dog", 0]
    )
    .then(console.log)

  await db
    .query(
      `--sql 
    SELECT * FROM products;
  `
    )
    .then(res => res.rows)
    .then(console.log)
}

// generated()
async function generated() {
  await db
    .query(
      `--sql
    CREATE TABLE people (
      height_cm numeric,
      height_in numeric GENERATED ALWAYS AS (height_cm / 2.54) STORED
    )
  `
    )
    .then(console.log)
}

// check()
async function check() {
  await db
    .query(
      `--sql
    DROP TABLE products;
    CREATE TABLE products (
      product_no integer,
      name text,
      price numeric,
      CHECK (price > 0),
      discounted_price numeric,
      CHECK (discounted_price > 0),
      CHECK (price > discounted_price)
    );
  `
    )
    .then(console.log)

  await db
    .query(
      `--sql
    INSERT INTO products VALUES ($1, $2, $3, $4); 
  `,
      [0, "dog", 10, 20]
    )
    .then(console.log)
}

// notNull()
async function notNull() {
  await db
    .query(
      `--sql
    DROP TABLE products;
    CREATE TABLE products (
      product_no integer NOT NULL,
      name text,
      price numeric CHECK (price > 0)
    );
  `
    )
    .then(console.log)

  await db.query(
    `--sql
    INSERT INTO products VALUES ($1, $2, $3)
  `,
    [0, "dog", 20]
  )

  await db
    .query(
      `--sql
    SELECT * FROM products;
  `
    )
    .then(console.log)
}

// unique()
async function unique() {
  await db
    .query(
      `--sql
    DROP TABLE products;
    CREATE TABLE products (
      product_no integer unique,
      name text,
      price numeric
    )
  `
    )
    .then(console.log)

  await inserMany(
    `--sql
    INSERT INTO products (product_no, name, price)
  `,
    [
      [0, "dog", 10],
      [1, "cat", 20]
    ]
  ).then(console.log)

  await db
    .query(
      `--sql
    SELECT * FROM products;
  `
    )
    .then(console.log)
}

// multiUnique()
async function multiUnique() {
  await db
    .query(
      `--sql
    DROP TABLE IF EXISTS example;
    CREATE TABLE example (
      a integer,
      b integer,
      c integer,
      unique (a, b)
    )
  `
    )
    .then(console.log)

  await inserMany(
    `--sql
    INSERT INTO example (a, b, c)
  `,
    [
      [1, 2, 3],
      [3, 2, 1],
      [2, 1, 3]
      // [1, 2, 4]
    ]
  ).then(console.log)

  await db.query(`SELECT * FROM example;`).then(console.log)
}

// pk()
async function pk() {
  await db
    .query(
      `--sql
    DROP TABLE IF EXISTS example;
    CREATE TABLE example (
      a integer,
      b integer,
      c integer,
      PRIMARY KEY (a, b)
    )
  `
    )
    .then(console.log)

  await inserMany(
    `--sql
    INSERT INTO example (a, b, c)
  `,
    [
      [1, 2, 3],
      [2, 1, 3],
      [1, 2, 3]
    ]
  ).then(console.log)

  await db
    .query(
      `--sql
    SELECT * FROM example;
  `
    )
    .then(res => res.rows)
    .then(console.log)
}

// fk()
async function fk() {
  await db
    .query(
      `--sql
    DROP TABLE IF EXISTS products CASCADE;
    CREATE TABLE products (
      product_no integer PRIMARY KEY,
      name text UNIQUE,
      price numeric
    )
  `
    )
    .then(console.log)

  await db
    .query(
      `--sql
    DROP TABLE IF EXISTS orders;
    CREATE TABLE orders (
      order_id integer PRIMARY KEY,
      product_no integer REFERENCES products,
      quantity integer
    )
  `
    )
    .then(console.log)
}

// manyToMany()
async function manyToMany() {
  await db
    .query(
      `--sql
    DROP TABLE IF EXISTS products CASCADE;
    CREATE TABLE products (
      product_no integer PRIMARY KEY,
      name text,
      price numeric
    )
  `
    )
    .then(console.log)

  await inserMany(
    `--sql
    INSERT INTO products (product_no, name, price)
  `,
    [
      [0, "dog", 10],
      [1, "cat", 20]
    ]
  ).then(console.log)

  await db
    .query(
      `--sql
    DROP TABLE IF EXISTS orders CASCADE;
    CREATE TABLE orders (
      order_id integer PRIMARY KEY,
      quantity integer
    )
  `
    )
    .then(console.log)

  await inserMany(
    `--sql
    INSERT INTO orders (order_id, quantity)
  `,
    [
      [0, 10],
      [1, 20]
    ]
  ).then(console.log)

  await db
    .query(
      `--sql
    DROP TABLE IF EXISTS order_items;
    CREATE TABLE order_items (
      product_no integer REFERENCES products,
      order_id integer REFERENCES orders,
      PRIMARY KEY (product_no, order_id)
    );
  `
    )
    .then(console.log)

  await inserMany(
    `--sql
    INSERT INTO order_items (product_no, order_id)
  `,
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0]
    ]
  ).then(console.log)
}

// alterTable()
async function alterTable() {
  await db
    .query(
      `--sql
    DROP TABLE IF EXISTS products CASCADE;
    CREATE TABLE products (
      id integer PRIMARY KEY,
      name text
    )
  `
    )
    .then(console.log)

  await db
    .query(
      `--sql
    ALTER TABLE products
    ADD COLUMN description text CHECK (description <> '');
  `
    )
    .then(console.log)

  await db
    .query(
      `--sql
    ALTER TABLE products
    DROP COLUMN description;
  `
    )
    .then(console.log)

  await db
    .query(
      `--sql
    ALTER TABLE products
    ADD CHECK (name <> '');
  `
    )
    .then(console.log)

  await db
    .query(
      `--sql
    ALTER TABLE products
    ADD UNIQUE (name);
  `
    )
    .then(console.log)

  await db
    .query(
      `--sql
    ALTER TABLE products
    ADD COLUMN order_id integer REFERENCES orders;
  `
    )
    .then(console.log)

  await db
    .query(
      `--sql
    ALTER TABLE products
    ALTER COLUMN name SET NOT NULL;
  `
    )
    .then(console.log)

  await db
    .query(
      `--sql
    ALTER TABLE products
    RENAME COLUMN id to product_id;
  `
    )
    .then(console.log)

  await db
    .query(
      `--sql
    ALTER TABLE products
    RENAME to items;
  `
    )
    .then(console.log)
}

// schema()
async function schema() {
  await db
    .query(
      `--sql
    DROP SCHEMA IF EXISTS my_first_schema CASCADE;
    CREATE SCHEMA my_first_schema;
  `
    )
    .then(console.log)

  await db
    .query(
      `--sql
    CREATE TABLE my_first_schema.my_table (
      id integer PRIMARY KEY,
      name text
    )
  `
    )
    .then(console.log)
}

// inherit()
async function inherit() {
  await db
    .query(
      `--sql
      DROP TABLE IF EXISTS cities CASCADE;
      CREATE TABLE cities (
        name            text NOT NULL,
        population      float NOT NULL,
        elevation       int  NOT NULL -- in feet
      );
    `
    )
    .then(console.log)

  await inserMany(
    `--sql
    INSERT INTO cities (name, population, elevation) 
  `,
    [
      ["shijiazhaung", 500.5, 20],
      ["baoding", 300.9, 15]
    ]
  ).then(console.log)

  await db
    .query(
      `--sql   
      SELECT * FROM cities;
    `
    )
    .then(res => res.rows)
    .then(console.log)

  await db
    .query(
      `--sql
      DROP TABLE IF EXISTS capitals;
      CREATE TABLE capitals (
        state char(2)
      ) INHERITS (cities);
    `
    )
    .then(console.log)

  await inserMany(
    `--sql
    INSERT INTO capitals
  `,
    [["shijiazhaung", 500.5, 600, "1"]]
  ).then(console.log)

  await db
    .query(
      `--sql
      SELECT * from cities;
    `
    )
    .then(console.log)

  await db
    .query(
      `--sql
      SELECT * from only cities WHERE name = 'shijiazhaung';
    `
    )
    .then(console.log)
}

// partition()
async function partition() {
  await db
    .query(
      `--sql
      DROP TABLE IF EXISTS measurement;
      CREATE TABLE measurement (
        city_id         int not null,
        logdate         date not null,
        peaktemp        int,
        unitsales       int
      ) PARTITION BY RANGE (logdate);
      SELECT * FROM measurement;
    `
    )
    .then(console.log)

}
