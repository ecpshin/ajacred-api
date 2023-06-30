const knex = require('../services/connection');
const messages = require('../services/messages');
const uuid = require('uuid');

const getAll = async (__, res) => {
  try {
    const rs = await knex('view_contratos')
      .orderBy('finalizacao', 'desc')
      .select('*');
    return res.status(200).json(rs);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getContratosPainel = async (_, res) => {
  try {
    const rs = await knex('view_contratos')
      .groupBy('situacao')
      .select('situacao')
      .count('situacao as quantidade');

    if (rs.length === 0) {
      return messages(res, 204, []);
    }

    const aux = { situacao: 'TOTAL', quantidade: 0 };
    for (let item of rs) {
      aux.quantidade += Number(item.quantidade);
    }
    rs.push(aux);

    return res.status(200).json(rs);
  } catch (error) {}
};

const getContratosPorSituacao = async (req, res) => {
  const { situacao } = req.params;
  let rs = [];
  try {
    if (req.params) {
      rs = await knex('view_contratos')
        .where({ situacao })
        .orderBy('finalizacao', 'desc')
        .select();
      return messages(res, 200, rs);
    }
    rs = await knex('view_contratos').orderBy('finalizacao', 'desc').select();
    return messages(res, 200, rs);
  } catch (error) {}
};

const createNewContract = async (req, res) => {
  const data = req.body;
  data.prazo = converteNumero(data.prazo);
  data.total = converteNumero(data.total);
  data.parcela = converteNumero(data.parcela);
  data.liquido = converteNumero(data.liquido);
  data.percentual = converteNumero(data.percentual);
  data.nrcontrole = uuid.v4();

  try {
    const rs = await knex('contratos').insert(data).returning('*');
    if (rs.length === 0) {
      return res.status(400).json('Erro ao tentar cadastar contrato!');
    }
     console.log(rs);
     return messages(res, 201, rs);
    
  } catch (error) {
     return messages(res, 500, 'Erro ao tentar adicionar contrato');
  }

}

const converteNumero = (valor) => {
  return Number(valor);
}


module.exports = {
  createNewContract,
  getAll,
  getContratosPainel,
  getContratosPorSituacao,
};
