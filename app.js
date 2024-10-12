const express = require('express')
const jwt = require('jsonwebtoken')
const config = require('./public/scripts/config')
const path = require('path')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extends: false }))

/***********************************************/
const users = []

/** REGISTER - Inicio **/
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','register.html'));
})
app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','register.html'));
})
app.post('/register',(req,res)=>{
    const {username, password, email} = req.body;
    
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' })
    }

    const newUser = {
        id: users.length+1,
        username,
        email,
        password
    };
    users.push(newUser)

    const token = jwt.sign({ id:newUser.id, username: newUser.username }, config.secretkey,{expiresIn:'1h'})
    return res.redirect(`/index/${token}`)

    // return res.json({
    //     message:'Usuario registrado exitosamente',
    //     token
    // })
})
/** REGISTER - Fin **/

/** Index - Inicio **/
app.get('/index/:token',(req,res)=>{
    const token = req.params.token;

    jwt.verify(token,config.secretkey,(err, decode)=>{
        if (err) {
            return res.sendFile(path.join(__dirname, 'public', 'error.html'))
        } else {
            return res.sendFile(path.join(__dirname, 'public', 'index.html'))
        }
    })
})
/** Index - Fin **/





/***********************************************/
app.use(express.static('public'))

app.listen(config.port, () => {
    console.log(`Servidor corriendo en el puerto ${config.port}, http://localhost:${config.port}`)
})