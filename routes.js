'use strict'
//express
import express from 'express'
const app = express()
//middleware to catch requests and parse
app.use(express.json())
//postgres
import pg from 'pg'
const { Pool } = pg
//dotenv
import dotenv from 'dotenv'
dotenv.config()

const dbPassword = process.env.PASSWORD

//new pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'do_a_kickflip',
    password: dbPassword,
    port: '5432'
})
app.use(express.static('public'))

async function routes() {
    //Get all route
    app.get('/api/skaters', async (req, res, next) => {
        try {
            let result = await pool.query('SELECT * FROM skaters')
            res.status(200).json(result.rows)
        } catch (err) {
            next(err)
        }
    })

    //get all with tricks
    app.get('/api/skaters_tricks/:id', async (req, res, next) => {
        let id = parseInt(req.params.id)
        try {
            let result = await pool.query('SELECT tricks.trick_name FROM skaters JOIN skaters_tricks ON skaters.id = skaters_tricks.skaters_id JOIN tricks ON skaters_tricks.tricks_id = tricks.id WHERE skaters.id = $1', [id])
            if (result.rows.length === 0) {
                res.status(404).send('NOT FOUND')
            } else {
                res.status(200)
                res.json(result.rows)
            }
        } catch (err) {
            next(err)
        }
    })

    // Get one route
    app.get('/api/skaters/:id', async (req, res, next) => {
        const id = parseInt(req.params.id)
        try {
            let result = await pool.query('SELECT * FROM skaters WHERE id = $1', [id])
            if (result.rows.length === 0) {
                res.status(404).send('NOT FOUND')
            } else {
                res.status(200)
                res.json(result.rows[0])
            }
        } catch (err) {
            next(err)
        }
    })

    //Post one
    app.post('/api/skaters', async (req, res, next) => {
        const newSkater = req.body
        try {
            if (!newSkater.first_name || !newSkater.last_name || !newSkater.age || !newSkater.years_skating) {
                let error = new Error('Invalid Data')
                error.status = 400
                res.set("Content-Type", "text/plain")
                throw error
            }
            let result = await pool.query('INSERT INTO skaters(first_name, last_name, age, years_skating) VALUES($1, $2, $3, $4) RETURNING id',
                [newSkater.first_name, newSkater.last_name, newSkater.age, newSkater.years_skating])
            newSkater.id = result.rows[0].id
            res.status(201)
            res.json(newSkater)
        } catch (err) {
            next(err)
        }
    })
    
    //update
    app.patch('/api/skaters/:id', async (req, res, next) => {
        const id = parseInt(req.params.id)
        try {
            let result = await pool.query('SELECT * FROM skaters WHERE id = $1', [id])
            if (result.rowCount === 0) {
                let error = new Error('Skater not Available')
                error.status = 404
                throw error
            }
            const updated = req.body
            const existingSkater = result.rows[0]

            for (const key in updated) {
                if (updated.hasOwnProperty(key)) {
                    existingSkater[key] = updated[key]
                }
            }
            const updateResult = await pool.query(
                'UPDATE skaters SET first_name = $1, last_name = $2, age = $3, years_skating = $4 WHERE id = $5',
                [existingSkater.first_name, existingSkater.last_name, existingSkater.age, existingSkater.years_skating, id])
            if (updateResult.rowCount === 1) {
                res.status(200)
                res.json(existingSkater)
            } else {
                let error = new Error('Failed to update')
                error.status = 500
                throw error
            }
        } catch (err) {
            next(err)
        }
    })

    //delete
    app.delete('/api/skaters/:id', async (req, res, next) => {
        const id = parseInt(req.params.id)
        try {
            let result = await pool.query('SELECT * FROM skaters WHERE id = $1', [id])
            if (result.rowCount === 0) {
                let error = new Error('Skater not Available')
                error.status = 404
                throw error
            }
            const deleteResult = await pool.query('DELETE FROM skaters WHERE id = $1', [id])
            if (deleteResult.rowCount === 1) {
                res.status(200)
                res.json({message: 'Delete successful'})
            } else {
                let error = new Error('Failure to delete')
                error.status = 500
                throw error
            }
        } catch (err) {
            next(err)
        }
    })
    
    app.use((err, req, res, next) => {
        console.error(err.stack)
        res.set('Content-Type', 'text/plain')
        res.status(err.status || 500)
        res.send(err.message)
    })
    //port
    const port = 1337
    //listener
    app.listen(port, () => {
        console.log(`You are now tuned into: ${port}`)
    })


}

routes()
