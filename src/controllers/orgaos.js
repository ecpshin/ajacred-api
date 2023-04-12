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

module.exports = {
  getAll,
};
