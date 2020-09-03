const mysql = require('./conection');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');



/**
 * create user 
 */
router.post('/register', async (req, res) => {
    const { name, lastname, email, password, city, phone }  = req.body
    const querySearch = 'SELECT * FROM users WHERE email = ?'
    const query = 'INSERT INTO users(name, lastname, email, password, city, phone) VALUES (?,?,?,?,?,?)'
    //se busca el correo
    mysql.query(querySearch, [email], async (error, results, fields) => {
        if (!error && results.length > 0) {
            //console.log('este es:', results);
            res.json({status: 201, error: true, errorMjs: 'Ya hay un email registrado'})
        } else  {
            try {
                const hashedPassword = await bcrypt.hash(password, 10)
                console.log(hashedPassword);
                mysql.query(query, [name, lastname, email, hashedPassword, city, phone], (err, results, fields) => {
                    console.log(err);
                    if (!err) {
                        //console.log(results);
                        res.json({status: 201, error: false})
                    } else {
                        res.json({status: 400, error: true, errorMjs: 'Ocurrio un error al insertar'})
                    }
                })
            } catch (error) {
                res.json({status: 400, error: true, errorMjs: 'Ocurrio un error'})
        
            }
        }
    })   
})

/**
 * login
 */
router.post('/login', async (req, res) => {
    const { email, password }  = req.body
    console.log(req.body);
    const querySearch = 'SELECT * FROM users WHERE email = ?'
    mysql.query(querySearch, [email], async (error, results, fields)=> {
        if (!error && results.length >0 ) {
            console.log('results: ',results[0].password);
            try {
                const comparePass= await bcrypt.compare(password, results[0].password)
                if (comparePass) {
                    res.json({status: 201, error: false, rows: {
                        id: results[0].id,
                        name: results[0].name,
                        email: results[0].email
                    }})
                } else {
                    res.json({status: 401, error: true, errorMjs: 'credenciales invalidas'})

                }
                
            } catch (error) {
                res.json({status: 400, error: true, errorMjs: 'Ocurrio un error al hacer login'})

            }
        } else {
            res.json({status: 400, error: true, errorMjs: 'Ocurrio un error al hacer login'})

        }
    })
})
/**
 * create courses 
 */
router.post('/createCourse', async (req, res) => {
    const { title, description, user_id }  = req.body
    const query = 'INSERT INTO course (title, description, user_id ) VALUES (?,?,?)'
    //se busca el correo
    mysql.query(query, [title, description, user_id], async (error, results, fields) => {
       if (!error) {
            res.json({status: 201, error: false})
       } else  {
            res.json({status: 400, error: true, errorMjs: 'Ocurrio un error al hacer login'})
       }
    })   
})

/**
 * get course list
 */
router.get('/courseList', async (req, res) => {
    const query = 'SELECT * FROM course'
    //se busca el correo
    mysql.query(query, async (error, results, fields) => {
       if (!error) {
            res.json({status: 200, error: false, results})
       } else  {
            res.json({status: 400, error: true, errorMjs: 'Ocurrio un error '})
       }
    })   
})

/**
 * get course list by id
 */
router.get('/courseList/:id', (req, res) => {
    const { id } = req.params;
    console.log('id: ', id);
    const query = `SELECT * FROM course WHERE id=${id}`
    //se busca el correo
    mysql.query(query, async (error, results, fields) => {
       if (!error && results.length > 0) {
            res.json({status: 200, error: false, results})
       } else  {
            res.json({status: 400, error: true, errorMjs: 'Ocurrio un error'})
       }
    })   
})
/**
* update course list by id
*/
router.put('/updateCourse/:id', (req, res) => {
    const { id } =  req.params;
    const { title, description } = req.body;
    const sql = `UPDATE course set title='${title}', description='${description}' WHERE id=${id}`;
    mysql.query(sql, [title, description ], (error, results, fields) => {
        console.log(results);
        if (!error && results.affectedRows > 0) {
            res.json({status: 200, error: false });
        } else {
            res.json({status: 400, error: true, errorMjs: 'Ocurrio un error'})
        }  
    });
});

/**
 * delete course list by id
 */
router.delete('/deleteCourse/:id', (req, res) => {
    const { id } =  req.params;
    const sql = `DELETE FROM course WHERE id=${id}`;
    mysql.query(sql, (error, results, fields) => {
        if (!error && results.affectedRows > 0) {
            res.json({status: 200});
        } else {
            res.json({status: 400, error: true, errorMjs: 'Ocurrio un error'})
        }  
    });
})




module.exports = router