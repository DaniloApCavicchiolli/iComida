const express = require('express')
const router = express.Router()
//express-validator = um auxiliador para fazer validações
const { check, validationResult } = require('express-validator') //Importação do express-validator
const Restaurante = require('../model/Restaurante')

/************************************************** 
 * Lista todos os restaurante
 * GET /restaurantes
***************************************************/
//Códigos de erros:
//200 - Quando deu tudo certo
//404 - Quando o erro esta no clint EX:(o client está requisitando algo que não existe)
//500 - Quando o erro é do lado do servidor
router.get('/', async(req, res) => {
    try {
        // Equivale ao "Select * from" de um Banco de dados
        const restaurante = await Restaurante
                                    .find({"status":"ativo"})//.find()= Filtrar os status e Traser somente os restaurantes que estão "ativo"
                                    .sort({nome: 1})//.sort({nome: 1}) ordenando pelo nome, "1" ordem ascendente e "-1" ordem descendente 
                                    .populate("categoria", "nome")//.populate()= Popule a "categoria" trasendo o "nome" dela
        res.json(restaurante)
    }catch (err) {
        res.status(500).send({
            errors: [{message: ' Não foi possível obter os restaurantes!'}]
        })
    }
})

/************************************************** 
 * Lista um restaurante pelo id
 * GET /restaurantes/:id
***************************************************/
//(:) = Quando é colocado dois pontos, ele intende que é um parametro que eu vou receber
// findById() = Localiza pelo id  
router.get('/:id', async(req, res) => {
    try {
        const restaurante = await Restaurante.findById(req.params.id) // Equivale ao "Select * from" de um Banco de dados
        res.json(restaurante)
    }catch (err) {
        res.status(500).send({
            errors: [{message:  `Não foi possível obter o restaurante com o id ${req.params.id}`}]
        })
    }
})

/************************************************** 
 * Lista um restaurante pelo id da categoria
 * GET /restaurantes/categoria:id
***************************************************/
//(:) = Quando é colocado dois pontos, ele intende que é um parametro que eu vou receber

router.get('/categoria/:id', async(req, res) => {
    try {
        const restaurantes = await Restaurante //.find()= Filtrar a "categoria", estou recebendo via requisição(req) um parametro(params) chamado (id)
                                    .find({"categoria":req.params.id})
                                    .sort({nome: 1})//.sort({nome: 1}) ordenando pelo nome, "1" ordem ascendente e "-1" ordem descendente 
                                    .populate("categoria", "nome")//.populate()= Popule a "categoria" trasendo o "nome" dela
        res.json(restaurantes)
    }catch (err) {
        res.status(500).send({
            errors: [{message:  `Não foi possível obter o restaurante com o id da categoria ${req.params.id}`}]
        })
    }
})

/************************************************** 
 * Inclui um novo restaurante
 * POST /restaurantes
***************************************************/
const validaRestaurante = [
    check('nome').not().isEmpty().withMessage('Nome do restaurante é obrigatório').isLength({ min: 5 })
    .withMessage('Nome do restaurante é muito curto'),

    check('status','Informe um status válido para o restaurante.').isIn(['ativo','inativo']),

    check('notaMedia').isNumeric().withMessage('A nota média deve ser um número').isFloat({min:0, max:5})
    .withMessage('A nota deve ser um número entre 0 a 5'),

    check('categoria').isMongoId().trim().withMessage('A categoria do restaurante é válida'),

    check('faixaPreco', 'Afaixa de preco informada é válida.').isIn(['barato','médio','luxo'])

]


router.post('/', validaRestaurante, async(req, res) => {
    //Estou fazendo a validação dessa requisição
    const errors = validationResult(req)
    if(!errors.isEmpty()){ //Verifica se o array não está vazio
        return res.status(400).json({
            errors: errors.array()// exibe os erros
        })
    }
    //Verificar se a categoria já existe
    const { nome } = req.body// Vai no corpo da requisição e pega o nome
    let restaurante = await Restaurante.findOne({nome})//Vou aguardar ele ir até a categoria o findOne(localizarUm) pelo {nome}
    if(restaurante){
        return res.status(200).json({
            errors: [{message: "Já existe um restaurante com o nome informado!"}]
        })
    }
    try{
        let restaurante = new Restaurante(req.body)
        await restaurante.save()
        res.send(restaurante)
    }catch (err){
        return res.status(500).json({
            errors: [{message: `Erro ao salvar o restaurante: ${err.message}`}]
        })
    }

})

/************************************************** 
 * Remove um restaurante
 * DELETE /restaurantes/:id
***************************************************/
router.delete('/:id', async(req, res) => {
    await Restaurante.findByIdAndRemove(req.params.id)
    .then(restaurante => {
        res.send({message: `Restaurante ${restaurante.nome} removido com sucesso! `})
    }).catch(err => {
        return res.status(500).send({
            errors: [{message: `Não foi possivel apagar o restaurante com o id: ${req.params.id}`}]
        })
    })
})

/************************************************** 
 * Edita o restaurante
 * PUT /restaurantes
***************************************************/
router.put('/', validaRestaurante, async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    let dados = req.body 
    await Restaurante.findByIdAndUpdate(req.body._id, {
        $set: dados
    }, {new: true})//true = mostra os dados que foram alterados
    .then(restaurante => {
        res.send({message: `Restaurante ${restaurante.nome} alterado com sucesso!`})
    }).catch (err => {
        return res.status(500).send({
            errors: [{message: `Não foi possível alterar o restaurante com o id: ${req.body._id}`}]
        })
    })
})

module.exports = router