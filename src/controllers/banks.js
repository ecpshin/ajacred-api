const connection = require("../services/connection");
const message = require("../services/messages");

const getAllBanks = async (_, res) => {
	try {
        const rs = await connection("bancos").select("*");
        return message(res, 200, rs);
    } catch (error) {
        return message(res, 500, "Erro interno do servidor");
    }
};

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

const setNewBank = async (req, res) => {
	const { codigo, nome } = req.body;

	try {
		const rs = await connection('bancos').insert({codigo, nome}).returning('*');
		if(rs.length === 0){
			return res.status(400).json({"mensagem":"Não foi possível cadadstrar banco!"})
		}
		return res.status(201).json(rs);

	} catch (error) {
		return res.status(500).json(error);
	}
}

const updateBank = async (req, res) => {
	const bank = req.body;
	try {
		const rs = await connection('bancos')
			.update(bank).
			where('id', bank.id)
			.returning('*');
		if(rs.length === 0){
			return res.status(400).json({"mensagem":"Não foi possível cadadstrar banco!"})
		}
		return res.status(200).json(rs);

	} catch (error) {
		
	}
}

const deleteBank = async (req, res) => {
	const { codigo } = req.params;

	try {
		const rs = await connection("bancos").where({ codigo }).delete();
		
		return message(res, 200, rs[0]);
	} catch (error) {
		return message(res, 500, "Erro interno do servidor");
	}
};

module.exports = { getAllBanks, getBankByCode, setNewBank, updateBank, deleteBank };
