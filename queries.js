const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})

const getUsers = (request, response) => {
  pool.query("SELECT users.*, EXTRACT(year FROM age(current_date,birthdate)) AS edad, concat(name,' ',surname) AS nombre_completo FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserByJob = (request, response) => {
  const job = request.params.job

  pool.query('SELECT * FROM users WHERE job = $1', [job], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  const { name, surname, birthdate, job, email } = request.body

  pool.query('INSERT INTO users (name, surname, birthdate, job, email) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, surname, birthdate, job, email], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`User added with ID: ${results.insertId}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const {name, surname, birthdate, job, email} = request.body

  pool.query(
    'UPDATE users SET name = $1, surname = $2, birthdate = $3, job = $4, email = $5 WHERE id = $6',
    [name, surname, birthdate, job, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  getUserByJob,
  createUser,
  updateUser,
  deleteUser,
}