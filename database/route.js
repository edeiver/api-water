const mysql = require('./conection');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');



//createUser
router.post('/register', async (req, res) => {
    const { name, lastname, phone, city }  = req.body
    try {
        const hashedPassword = await bcrypt.hash(lastname, 10)
        console.log(hashedPassword);
        mysql.query('INSERT INTO users (name, lastname, password, phone, city) values (?, ?, ?, ?, ?)', [name, lastname, hashedPassword, phone, city ], (err, results, fields) => {
            if (err === null) {
                console.log(results);
                res.json({status: 201, results})
            } else {
                res.json({status: 400, error: true, errorMjs: 'Ocurrio un error'})
            }
        })
    } catch (error) {
        res.json({status: 400, error: true, errorMjs: 'Ocurrio un error'})

    }

   
})

module.exports = router