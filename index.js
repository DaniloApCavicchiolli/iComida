const express = require('express') //eu preciso ter o 'express'
require('dotenv').config() // Carrega as variáveis de ambiemte
const InicializaMongoServer = require('./config/Db')
//Definindo as rotas da aplicação
const rotasCategoria = require('./routes/Categoria')
const rotasRestaurante = require('./routes/Restaurante')
const rotaUpload = require('./routes/Upload')

//Inicializamos o servidro MongoDB
InicializaMongoServer()

const app = express() // app(objeto) que vai pegar no express(classe)

//Removendo por segurança
//para que outros não saibam se eu estou fazendo em .net, php ou express
app.disable('x-powered-by')
//toda vez que faço uma requisiçao, ele retorna a ferramenta que eu estou usando

//Porta defaut
const PORT = process.env.PORT
 //Vai em "process.env" e carrega a "PORT"

 /* Middleware do Express*/
 // Ficará entre a "requisição" e a "resposta" observando
 // next = É para ele continuar ou não
 app.use(function(req, res, next) {
    // Em produção, remova o * e atualize com o dominio/ip do seu app
    // * = permite que qualquer origem acesse o meu servidor
    res.setHeader('Access-Control-Allow-Origin', '*')//Consulta de qualquer origem
    //Cabeçalhos que serão permitodos
    //Exemplo: res.setHeader('Access-Control-Allow-Headers', "Content-Type, Accept, access-token")
    res.setHeader('Access-Control-Allow-Headers', "*")//De qualquer cabeçalho
    //Métodos que serão permitidos
    res.setHeader('Access-Control-Allow-Methods', 'Get, POST, PUT, DELETE, OPTIONS, PATCH')//Usando todos os métodos
    //Após passar por todos usa o "next()", para ele continuar 
    next()
 })

//Parse conteúdo JSON
app.use(express.json())//Verifica se o conteúdo que está sendo mandado, ele consegue interpretar como json

//##### Caminho inicial #####
//Caso venha alguma coisa via get() no diretório raiz. Vou ter o tratamento (requisição e resposta) **Sempre vem um (request, response)**
app.get('/', (req, res) => {
   // const idiomas = req.headers['accept-language'] //idiomas aceito no navegador
    res.json({mensagem: "API iComida 100% funcional! ",// res.status(200).json - por default o status já é 200
        versao: '1.0.1', //versão da nossa APi
     //   idiomas: idiomas //idiomas suportados
    })//minha resposta
})

/* Rota da Categoria */
app.use('/categorias', rotasCategoria)
/* Rota do Restaurante */
app.use('/restaurantes', rotasRestaurante)
/* Rotas do conteúdo público */
// Tudo que for ('/public'), vai ser um conteúdo estático que está na pasta (public)
// Por ser um arquivo (estático) é um arquivo que não pode ser mexido. O próprio express irá cuidar da segurança do arquivo
app.use('/public', express.static('public'))
/* Rota de upload */

app.use('/upload', rotaUpload)



/* Rota para tratar exceções - normalmente 404 - DEVE SER A ÚLTIMA ROTA (SEMPRE) */
app.use(function(req, res) {
    res.status(404).json({message: `A rota ${req.originalUrl} não existe.`})
})

app.listen(PORT, (req, res) => {
    console.log(`Servidor web inciado na porta ${PORT}`)
})