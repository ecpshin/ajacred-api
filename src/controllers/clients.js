const connection = require("../services/connection");
const message = require("../services/messages");

const getAllClients = async (_, res) => {
	try {
		const rs = await connection("clientes")
			.select("*")
			.orderBy("nome", "asc");
		if (rs.length === 0) {
			return message(res, 404, "Nenhum cliente encontrado");
		}

		return message(res, 200, rs);
	} catch (error) {
		return message(res, 400, "Erro");
	}
};

const getClientProfile = async (req, res) => {
	const { id } = req.params;

	try {
		const rs = await connection("clientes").select("*").where({ id });

		if (rs.length === 0) {
			return message(res, 404, "Cliente não encontrado");
		}

		return message(res, 200, rs);
	} catch (error) {
		return message(res, 400, "Erro");
	}
};

const createNewClient = async (req, res) => {
	const { nome, email, telefone, cpf, endereco, cidade, estado } = req.body;

	try {
		const rs = await connection("clientes")
			.insert({
				nome,
				email,
				telefone,
				cpf,
				endereco,
				cidade,
				estado,
			})
			.returning("*");

		if (rs.length === 0) {
			return message(res, 400, "Não foi possível cadastrar o cliente!");
		}

		return message(res, 200, "Cadastro realizado com sucesso!");
	} catch (error) {
		return message(res, 400, error.message);
	}
};

module.exports = {
	getAllClients,
	getClientProfile,
	createNewClient,
};
