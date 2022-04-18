import _ from "lodash"

const dropTableStatement = "DROP TABLE IF EXISTS person;"
const createTableStatement = `CREATE TABLE person (
  id SERIAL NOT NULL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  gender VARCHAR(7) NOT NULL,
  date_of_birth DATE NOT NULL,
  email VARCHAR(150),
  country_of_birth VARCHAR(50)
);`

const makePerson = ({
  first_name,
  last_name,
  gender,
  date_of_birth,
  email,
  contry_of_birth
}) => `INSERT INTO person (
  first_name,
  last_name,
  gender,
  date_of_birth,
  email,
  country_of_birth
)
VALUES (
  ${first_name},
  ${last_name},
  ${gender},
  ${date_of_birth},
  ${email},
  ${contry_of_birth}
);`

const firstNames = [
  "'Zhao'",
  "'Qian'",
  "'Sun'",
  "'Li'",
  "'Zhou'",
  "'Wu'",
  "'Zheng'",
  "'Wang'"
]

const lastNames = [
  "'Yi'",
  "'Er'",
  "'San'",
  "'Si'",
  "'Wu'",
  "'Liu'",
  "'Qi'",
  "'Ba'"
]

const genders = ["'MALE'", "'FAMALE'"]

const date_of_birth = [
  "'1988-10-1'",
  "'1995-2-13'",
  "'1965-3-14'",
  "'1978-4-30'",
  "'2001-3-21'",
  "'2005-4-19'",
  "'2007-12-16'",
  "'1994-11-21'"
]

const contry_of_birth = [
  "'China'",
  "'US'",
  "'UK'",
  "'Canada'",
  "'Janpen'",
  "'Korea'",
  "null",
  "null"
]

const oneOf = names => {
  return () => {
    let i = _.random(0, names.length - 1, false)
    return names[i]
  }
}

const firstName = oneOf(firstNames)
const lastName = oneOf(lastNames)
const gender = oneOf(genders)
const birthday = oneOf(date_of_birth)
const email = name => {
  // 除去前后两个单引号
  const email = `'${name.slice(1, -1)}@gmail.com'`

  return oneOf([email, "null"])()
}
const birthCountry = oneOf(contry_of_birth)
const genPerson = () => {
  const first_name = firstName()

  return makePerson({
    first_name,
    last_name: lastName(),
    gender: gender(),
    date_of_birth: birthday(),
    email: email(first_name),
    contry_of_birth: birthCountry()
  })
}

export default {
  dropTableStatement,
  createTableStatement,
  genPerson
}
