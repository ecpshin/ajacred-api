import connection from "../services/connection";
import message from "../services/messages";

const getAllClients = async (_, res) => {
	try {
		const rs = await connection("clientes");
		if (rs.length === 0) {
			return message(res, 404, "Nenhum cliente encontrado");
		}
		return messages(res, 200, rs);
	} catch (error) {
		return messages(res, 400, "Erro");
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
	createNewClient,
};
