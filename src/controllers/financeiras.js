const knex = require('../services/connection');
const message = require('../services/messages');

async function allFinanceiras(__, res) {
  console.log('entrou aqui');
  try {
    const rs = await knex('financeiras').orderBy('nome', 'asc').select('*');
    return message(res, 200, rs);
  } catch (error) {
    return message(res, 200, error.message);
  }
}

async function createFinanceira(req, res) {
  const data = req.body;
  //   try {
  //     const rs = await knex('financeiras').insert(data, '*');
  //     return message(res, 201, rs);
  //   } catch (error) {
  //     return message(res, 201, error.message);
  //   }
  return message(res, 200, data);
}

module.exports = {
  allFinanceiras,
  createFinanceira,
};
