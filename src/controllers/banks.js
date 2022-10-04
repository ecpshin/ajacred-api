const connection = require("../services/connection");
const message = require("../services/messages");

const getAllBanks = async (_, res) => {};

const getBankByCode = async (req, res) => {
	const { codigo } = req.params;

	try {
		const rs = await connection("bancos").select("*").where({ codigo });
		if (rs.length === 0) {
			return message(res, 404, "Banco não encontrado");
		}
		return message(res, 200, rs[0]);
	} catch (error) {
		return message(res, 500, "Erro interno do servidor");
	}
};

module.exports = { getAllBanks, getBankByCode };
