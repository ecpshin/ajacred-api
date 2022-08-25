const connection = require('../services/connection');
const message = require('../services/messages');
const bcrypt = require('bcrypt');
const yup = require('yup');
const { setLocale } = require('yup');
const { pt } = require('yup-locales');
setLocale(pt);

const getAllUsers = async (_, res) => {
    try {
        const rs = await connection('tb_usuarios');
        return message(res, 200, rs)
    } catch (error) {
        return message(res, 400, 'Erro');
    }
}

const createNewUser = async (req, res) => {

    const { nome, email, senha, nivel, avatar } = req.body;

    try {


        const schema = yup.object().shape({
            nome: yup.string().required(),
            email: yup.string().email().required(),
            senha: yup.string().required().min(6).max(8),
            nivel: yup.string().required()
        });

        await schema.validate(req.body);

        const hash = await bcrypt.hash(senha, 12);

        const rs = await connection('usuarios                                                                                                                                                                                   ').insert({
            nome,
            email,
            senha: hash,
            nivel,
            avatar
        }).returning('*');

        if (rs.length === 0) {
            return message(res, 400, 'Não foi possível cadastrar o usuário!');
        }

        return message(res, 200, 'Cadastro realizado com sucesso!');

    } catch (error) {
        return message(res, 400, error.message);
    }
}

module.exports = {
    getAllUsers,
    createNewUser
}