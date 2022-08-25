const knex = require('../services/connection');
const message = require('../services/messages');
const yup = require('yup');
const { pt } = require('yup-locales');
const { setLocale } = require('yup');
setLocale(pt);


const isEmailExists = async (req, res, next) => {

    const { email } = req.body;

    try {
        const pattern = yup.object().shape({
            email: yup.string().email().required()
        });

        await pattern.validate(req.body);

        const search = await knex('usuarios').select('email').where({ email });

        if (search.length > 0) {
            return message(res, 400, 'Já existe usuário cadastrado com o email informado!')
        }
        next();
    } catch (error) {
        return message(res, 400, error.message);
    }
}

module.exports = { isEmailExists }