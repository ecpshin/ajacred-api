const connection = require('../services/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const yup = require('yup');
const { pt } = require('yup-locales');
const { setLocale } = require('yup');
const message = require('../services/messages');
setLocale(pt);

const userAuthenticate = async (req, res) => {

    const { email, senha } = req.body;

    const pattern = yup.object().shape({
        email: yup.string().required(),
        senha: yup.string().required().min(6).max(8)
    });

    try {
        await pattern.validate(req.body);

        const rs = await connection('usuarios')
            .select('id', 'nome', 'email', 'senha')
            .where({ email });
        if (rs.length === 0) {
            return message(res, 404, 'E-mail ou senha inválidos');
        }
        const match = await bcrypt.compare(senha, rs[0].senha);

        if (!match) {
            return message(res, 400, 'E-mail... ou senha inválidos')
        }
        const { senha: _, ...usuario } = rs[0];

        const token = jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '2h' });

        const session = {
            usuario,
            token
        };

        return message(res, 200, session);
    } catch (error) {
        return message(res, 400, error.message);
    }

}

module.exports = { userAuthenticate }