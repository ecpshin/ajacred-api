const connection = require("../services/connection");
const message = require("../services/messages");

const getAllBanks = async (_, res) => {
  try {
    const rs = await connection("bancos").select("*");
    if (rs.length === 0) {
      return message(res, 404, "Não existe bancos cadastrados!");
    }
  } catch (error) {
    return message(res, 500, "Erro interno do servidor");
  }
};

const getBankByCode = async (req, res) => {
  const { codigo } = req.params;

  try {
    const rs = await connection("bancos").select("*").where({
      codigo,
    });
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
    const rs = await connection("bancos")
      .insert({
        codigo,
        nome,
      })
      .returning("*");
    if (rs.length === 0) {
      return message(res, 400, "Não foi possível cadastrar banco!");
    }
    return message(res, 201, "");
  } catch (error) {
    return message(res, 500, "Erro do servidor.");
  }
};

const updateBank = async (req, res) => {
  const bank = req.body;
  try {
    const rs = await connection("bancos")
      .update(bank)
      .where("id", bank.id)
      .returning("*");
    if (rs.length === 0) {
      return message(res, 400, "Não foi possível realizar atualização!");
    }
    return message(res, 204, "");
  } catch (error) {
    return message(res, 500, error);
  }
};

const deleteBank = async (req, res) => {
  const { codigo } = req.params;

  try {
    const rs = await connection("bancos").where({ codigo }).delete();
    return message(res, 200, "Deletado com sucesso!");
  } catch (error) {
    return message(res, 500, "Erro interno do servidor");
  }
};

module.exports = {
  getAllBanks,
  getBankByCode,
  setNewBank,
  updateBank,
  deleteBank,
};
