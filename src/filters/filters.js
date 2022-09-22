const knex = require("../services/connection");
const message = require("../services/messages");
const jwt = require("jsonwebtoken");
const yup = require("yup");
const { pt } = require("yup-locales");
const { setLocale } = require("yup");
const connection = require("../services/connection");
setLocale(pt);

const isEmailExists = async (req, res, next) => {
	const { email } = req.body;

	try {
		const pattern = yup.object().shape({
			email: yup.string().email().required("Email inválido"),
		});

		await pattern.validate(req.body);

		const search = await knex("usuarios").select("email").where({ email });

		if (search.length > 0) {
			return message(
				res,
				400,
				"Já existe usuário cadastrado com o email informado!"
			);
		}
		next();
	} catch (error) {
		return message(res, 400, error.message);
	}
};

const verifyLogin = async (req, res, next) => {
	const { authorization } = req.headers;
	if (!authorization) {
		return message(res, 401, "Usuário não autenticado!");
	}
	const token = authorization.replace("Bearer ", "");

	try {
		const decoded = await jwt.verify(token, process.env.JWT_SECRET);
		const { id } = decoded;

		const result = await connection("usuarios")
			.select("*")
			.where({ id })
			.first();

		if (!result) {
			return message(res, 404, "Usuário não encontrado");
		}
		const { senha: _, ...user } = result;
		req.user = user;
		next();
	} catch (error) {
		return message(res, 400, "Token inválido");
	}
};

const emailUpdate = async (req, res, next) => {
	const { email } = req.body;
	const user = req.user;

	try {
		if (email === user.email) {
			return message(res, 400, "Forneça um e-mail que não seja o atual");
		}

		if (email && email !== user.email) {
			const schema = yup.object().shape({
				email: yup.string().email().required("Email inválido"),
			});

			await schema.validate({ email });

			const search = await knex("usuarios")
				.select("email")
				.where({ email })
				.whereNot({ id: user.id });
			if (search.length > 0) {
				return message(
					res,
					400,
					"Já existe usuário cadastrado com o email informado!"
				);
			}
		}
		next();
	} catch (error) {
		return message(res, 400, error.message);
	}
};

module.exports = { isEmailExists, emailUpdate, verifyLogin };
