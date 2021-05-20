const express = require('express') //eu preciso ter o 'express'
require('dotenv').config() // Carrega as variáveis de ambiemte
const InicializaMongoServer = require('./config/Db')
//Definindo as rotas da aplicação
const rotasCategoria = require('./routes/Categoria')
const rotasRestaurante = require('./routes/Restaurante')

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

//Parse conteúdo JSON
app.use(express.json())//Verifica se o conteúdo que está sendo mandado, ele consegue interpretar como json

//##### Caminho inicial #####
//Caso venha alguma coisa via get() no diretório raiz. Vou ter o tratamento (requisição e resposta) **Sempre vem um (request, response)**
app.get('/', (req, res) => {
   // const idiomas = req.headers['accept-language'] //idiomas aceito no navegador
    res.json({mensagem: "API iComida 100% funcional! ", 
        versao: '1.0.1', //versão da nossa APi
     //   idiomas: idiomas //idiomas suportados
    })//minha resposta
})

/* Rotas da Categoria */
app.use('/categorias', rotasCategoria)

/* Rotas do Restaurante */
app.use('/restaurantes', rotasRestaurante)


app.listen(PORT, (req, res) => {
    console.log(`Servidor web inciado na porta ${PORT}`)
})