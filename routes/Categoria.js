const express = require('express')
const router = express.Router()
const Categoria = require('../model/Categoria')

/************************************************** 
 * Lista todas as categorias
 * GET /categorias
***************************************************/
//Códigos de erros:
//200 - Quando deu tudo certo
//404 - Quando o erro esta no clint EX:(o client está requisitando algo que não existe)
//500 - Quando o erro é do lado do servidor
router.get('/', async(req, res) => {
    try {
        const categorias = await Categoria.find({"status":"ativo"}).sort({nome: 1}) // Equivale ao "Select * from" de um Banco de dados
        res.json(categorias)
    }catch (err) {
        res.status(500).send({
            errors: [{message: ' Não foi possível obter as categorias!'}]
        })
    }
})

module.exports = router