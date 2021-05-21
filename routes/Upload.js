const express = require('express')
const router = express.Router()
const multer = require('multer')

//Definindo a pasta padrão
const upload = multer ({
    dest: './public/uploads'
})

/************************************************** 
 * Processo de upload de uma imagem
 * POST / 
***************************************************/
router.post('/', upload.array('file'), // pega o array que vem do arquivo
                 async(req, res) => {
                     console.log(`Arquivos recebidos:${req.file.length}`)
                     const statusUpload = req.file.length > 0 ? true : false
                     res.send({
                         upload: statusUpload, // Retorna um array vazio, em caso de erro
                         files: req.file //Retorna as informações do arquivo para o usuário: Tamanho, tipo, caminho....
                     })
                 })

module.exports = router