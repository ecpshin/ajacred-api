const knex = require('../services/connection');

const getAll = async (__, res) => {
  try {
    const rs = await knex('orgaos').orderBy('nome').select();
    if (rs.length === 0) {
      return res.json(404).json({});
    }
    return res.status(200).json(rs);
  } catch (error) {
    console.log(error.message);
  }
};

const newOrgao = async (req, res) => {
  const data = req.body
  try {
    await knex('orgaos').insert(data)
    return res.status(201).json({})    
  } catch (error) {
    return res.status(500).json({"mensagem":"Erro do servidor"})
  }
}

module.exports = {
  getAll,
  newOrgao
};
