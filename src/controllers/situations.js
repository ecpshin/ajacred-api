const query = require("../services/connection");
const message = require("../services/messages");

const getSituacoes = async (__, res) => {
  try {
    const rs = await query("situacoes").select("*").orderBy("descricao");
    if (rs.length === 0) {
      return message(res, 400, "Não há situações cadastradas!");
    }
    return message(res, 200, rs);
  } catch (error) {
    return message(res, 500, error);
  }
};

const getSituacaoById = async (req, res) => {
  const { id } = req.params;

  try {
    const rs = await query("situacoes").where({ id }).select();
    if (rs.length === 0) {
      return message(res, 404, "Não encontrada!");
    }
    return message(res, 200, rs);
  } catch (error) {
    return message(res, 500, error);
  }
};

const setNewSituacao = async (req, res) => {
  const { descricao } = req.body;
  try {
    const rs = await query("situacoes").insert({ descricao }).returning("*");
    if (rs.length === 0) {
      return message(res, 404, "Não há situações cadastradas!");
    }
    return message(res, 201, rs);
  } catch (error) {
    return message(res, 500, error);
  }
};

const updateSituacao = async (req, res) => {
  const { id, descricao } = req.body;
  try {
    const rs = await query("situacoes").where({ id }).update({ descricao });
    if (rs.length === 0) {
      return message(res, 400, "Não foi possível realizar atualização!");
    }
    return message(res, 200, "");
  } catch (error) {
    return message(res, 500, error);
  }
};

const deleteSituacao = async (req, res) => {
  const { id } = req.params;
  try {
    await query("situacoes").where({ id }).delete();
    return message(res, 204, "");
  } catch (error) {
    console.log(error);
    return message(res, 500, "Erro do servidor.");
  }
};

module.exports = {
  getSituacoes,
  getSituacaoById,
  setNewSituacao,
  updateSituacao,
  deleteSituacao,
};
