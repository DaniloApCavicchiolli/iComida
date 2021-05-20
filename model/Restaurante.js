const mongoose = require('mongoose')
const Schema = mongoose.Schema

//Criando o schema do restaurante
const RestauranteSchema = mongoose.Schema ({
    nome: {type: String, unique: true},
    status: {type: String, enum: ['ativo', 'inativo'], default: 'ativo'},
    foto: {
        originalname: {type: String},//nome
        path: {type: String},        //caminho
        size: {type: Number},        //tamanho
        mimetype: {type: String}     //tipo: pnj, jpeg...
    },
    notaMedia: {type: Number},
    categoria: {type: Schema.Types.ObjectId, ref: 'categoria'},
    faixaPreco: {type: String, enum: ['barato', 'médio', 'luxo']},
    tempoEntrega: {type: String},
    endereco: {
        logradouro: {type: String},
        bairro: {type: String},
        cep: {type: String},
        municipio: {type: String},
        estado: {type: String},
        complemento: {type: String}
    },
    geolocalizacao: {
        latitude: {type: Number},
        longitude: {type: Number}
    }
},{timestamps: true})
module.exports = mongoose.model('restaurante', RestauranteSchema)