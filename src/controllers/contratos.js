const query = require('../services/connection');
const messages = require('../services/messages');

const getAll = async (req, res) => {
  try {
    const rs = await query('view_contratos')
      .orderBy('finalizacao', 'desc')
      .select('*');
    return res.status(200).json(rs);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getContratosPainel = async (req, res) => {
  try {
    const rs = await query('view_contratos')
      .groupBy('situacao')
      .select('situacao')
      .count('situacao as quantidade');
    if (rs.length === 0) {
      return messages(res, 200, 'Náo há contratos registrados');
    }

    const aux = { situacao: 'TOTAL', quantidade: 0 };
    for (let item of rs) {
      aux.quantidade += Number(item.quantidade);
    }
    rs.push(aux);

    return res.status(200).json(rs);
  } catch (error) {}
};

const getBySituation = async (requisicao, responder) => {
  const { search } = requisicao.query;
  try {
    const rs = await query('view_contratos')
      .where({ situacao: search })
      .orderBy('finalizacao', 'desc')
      .select();
    responder.status(200).json(rs);
  } catch (error) {}
};

module.exports = {
  getAll,
  getContratosPainel,
  getBySituation,
};
