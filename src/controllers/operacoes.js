const knex = require('../services/connection');

const getAll = async (__, res) => {
  try {
    const rs = await knex('operacoes').orderBy('descricao').select();
    if (rs.length === 0) {
      return res.json(404).json({});
    }
    return res.status(200).json(rs);
  } catch (error) {
    console.log(error.message);
  }
};

const newOperacao = async (req, res) => {
  const data = req.body
  try {
    await knex('operacoes').insert(data)
    return res.status(201).json({})    
  } catch (error) {
    return res.status(500).json({"mensagem":"Erro do servidor"})
  }
}

const deleteOperacao = async (req, res) => {
  const { id } = req.params
  try {
    await knex('oeracoes').where({ id }).delete()
    return res.status(201).json({})    
  } catch (error) {
    return res.status(500).json({"mensagem":"Erro do servidor"})
  }
}

const updateOperacao = async (req, res) => {
  const data = req.body
  const {id} = req.params

  try {
    await knex('oeracoes').where({ id }).update(data)
    return res.status(200).json({})    
  } catch (error) {
    return res.status(500).json({"mensagem":"Erro do servidor"})
  }
}

module.exports = {
  getAll,
  newOperacao,
  deleteOperacao,
  updateOperacao,
};
