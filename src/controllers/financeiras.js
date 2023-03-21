const knex = require('../services/connection');
const message = require('../services/messages');

async function allFinanceiras(_req, res) {
  try {
    const rs = await knex('financeiras').orderBy('nome', 'asc').select('*');
    return message(res, 200, rs);
  } catch (error) {
    return message(res, 200, error.message);
  }
}

const createFinanceira = async (req, res) => {
  const data = req.body;
  try {
    const rs = await knex('financeiras').insert(data, '*');
    return message(res, 201, rs);
  } catch (error) {
    return message(res, 500, error.message);
  }
};

const patchFinanceira = async (req, res) => {
  const { id } = req.params;
  delete req.body.id;
  try {
    const rs = await knex('financeiras').where({ id }).update(req.body);
    return message(res, 201, rs);
  } catch (error) {
    return message(res, 500, 'Erro ao tentar realizar atualização de dados.');
  }
};
const deleteFinanceira = async (req, res) => {
  const { id } = req.params;

  try {
    await knex('financeiras').where({ id }).delete();
    return message(res, 204, 'Excluído com sucesso!');
  } catch (error) {
    return message(res, 500, 'Erro ao tentar realizar atualização de dados.');
  }
};

module.exports = {
  allFinanceiras,
  createFinanceira,
  patchFinanceira,
  deleteFinanceira,
};
