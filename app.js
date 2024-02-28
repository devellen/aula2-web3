const express = require('express');
const mysql = require('mysql2');
const bodyParse = require('body-parser');


const app = express();

const PORT = process.env.PORT || 5001;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'aluno',
    password: 'ifpecjbg',
    database: 'aula2'
})

connection.connect((err) => {
    if(err) {
        console.error('erro ao conectar ao mysql ' + err.message);
    } else {
        console.log('conectado');
    }
});

//middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//rota para o metodo post para inserir usuario
app.post('/api/usuarios', (req, res) => {
    const {email, senha } = req.body;

    //inserir dados na tabela
    const sql = 'INSERT INTO usuario (email, senha) VALUES (?, ?)';
    connection.query(sql, [email, senha], (err, result) => {
        if(err) {
            console.error('erro ao inserir' + err.message);
            res.status(500).json({error: 'erro ao inserir registro'});
        } else {
            console.log('registro inserido com sucesso');
            res.status(201).json({message: 'registro inserido!'});
        }
    });
});

//rota para o metodo get buscar usuario
app.get('/api/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuario'; 
    connection.query(sql, (err, results) => {
        if(err) {
            console.error('erro ao buscar registros' + err.message);
            res.status(500).json({error: 'erro ao buscar registros'});
        } else {
            res.status(200).json(results);
        }
    });
});

//rota para o metodo put atualizar usuario
app.put('/api/usuarios/:id', (req, res) => {
    const {id} = req.params;
    const {email, senha} = req.body;

    //atualizar dados na tabela
    const sql = 'UPDATE usuario SET email = ?, senha = ? WHERE id = ?';
    connection.query(sql, [email, senha, id], (err, result) => {
        if(err) {
            console.error('erro ao atualizar registro' + err.message);
            res.status(500).json({error: 'erro ao atualizar registro'});
        } else {
            console.log('registro atualizado!')
            res.status(200).json({message: 'registro atualizado com sucesso!'});
        }
    });
})

//rota para o metodo delete 
app.delete('/api/usuarios/:id', (req, res) => {
    const {id} = req.params;
    const sql = 'DELETE FROM usuario WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if(err) {
            console.error('erro ao excluir registro' + err.message);
            res.status(500).json({error: 'erro ao excluir registro'});
        } else {
            if(result.affectedRows > 0) {
                console.log('registro excluido!')
                res.status(200).json({message: 'registro excluido com sucesso!'});
            } else {
                console.log('registro não encontrado');
                res.status(404).json({message: 'resgitro não encontrado.'})
            }  
        }
    });
})


app.listen(PORT, console.log(`server started ${PORT}`));