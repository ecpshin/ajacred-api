const query = require('../services/connection');
const message = require('../services/messages');
const cliente = require('../helpers/cliente');

const getAllClients = async (_, res) => {
  try {
    cliente.all = await query('clientes').select('*').orderBy('nome', 'asc');
    if (cliente.all.length === 0) {
      return message(res, 404, 'Nenhum cliente encontrado');
    }
    return message(res, 200, cliente.all);
  } catch (error) {
    return message(res, 500, error);
  }
};

const getClientProfile = async (req, res) => {
  const { id } = req.params;

  try {
    cliente.residenciais = await query('inforesidenciais')
      .select('cep', 'logradouro', 'complemento', 'bairro', 'municipio', 'uf')
      .where({
        cliente: id,
      });

    cliente.funcionais = await query('infofuncionais')
      .select(
        'id',
        'nrbeneficio',
        'phone1',
        'phone2',
        'phone3',
        'phone4',
        'emails',
        'senhas'
      )
      .where({
        cliente: id,
      });

    cliente.bancarias = await query('infobancarias')
      .select('id', 'banco', 'agencia', 'conta', 'tipo', 'operacao')
      .where({
        cliente: id,
      });

    return message(res, 200, {
      bancarias: cliente.bancarias.length !== 0 ? cliente.bancarias[0] : {},
      funcionais: cliente.funcionais.length !== 0 ? cliente.funcionais[0] : {},
      residenciais:
        cliente.residenciais.length !== 0 ? cliente.residenciais[0] : {},
    });
  } catch (error) {
    return message(res, 400, error.message);
  }
};

async function getClientContracts(req, res) {
  const { id } = req.params;
  try {
    const rs = await query('view_contratos')
      .where('cliente_id', id)
      .orderBy('pid', 'desc')
      .select();
    if (rs.length === 0) {
      return message(res, 400, 'Não há registro!');
    }
    return message(res, 200, rs);
  } catch (error) {
    return message(res, 500, 'Erro do servidor!');
  }
}

const createNewClient = async (req, res) => {
  const {
    form: cliente,
    address: residenciais,
    funcao: funcionais,
    finance: bancarias,
  } = req.body;

  console.log(cliente, bancarias, funcionais, residenciais);
  try {
    const rs = await query('clientes').insert(cliente).returning('id');

    if (rs.length === 0) {
      return res.status(400).json('Erro ao tentar cadastar cliente!');
    }

    const id = rs[0].id;

    const rs1 = await linkTables('infobancarias', bancarias, id);

    if (rs1.length === 0) {
      return res.status(400).json('Erro bancarias');
    }

    const rs2 = await linkTables('inforesidenciais', residenciais, id);

    if (rs2.length === 0) {
      return res.status(400).json('Erro residenciais');
    }

    const rs3 = await linkTables('infofuncionais', funcionais, id);

    if (rs3.length === 0) {
      return res.status(400).json('Erro funcionais');
    }
    return message(res, 201, 'Cliente cadastrado com sucesso!');
  } catch (error) {
    return message(res, 500, 'Erro no servidor');
  }
};

const patchClient = async (req, res) => {
  const person = { ...req.body };
  person.expedicao = person.expedicao.split('T')[0];
  person.nascimento = person.nascimento.split('T')[0];
  const {
    nome,
    cpf,
    rg,
    expedicao,
    nascimento,
    naturalidade,
    genitora,
    genitor,
    sexo,
    estado_civil,
    observacoes,
  } = person;

  const person_id = req.params.id;

  try {
    const resource = await query('clientes')
      .update({
        nome,
        cpf,
        rg,
        expedicao,
        nascimento,
        naturalidade,
        genitora,
        genitor,
        sexo,
        estado_civil,
        observacoes,
      })
      .where('id', Number(person_id));
    return res.status(200).json(resource);
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};

const updateClientResidencial = async (req, res) => {
  const { id } = req.params;
  const { cep, logradouro, complemento, bairro, municipio, uf } = req.body;

  if (!cep || !logradouro || !complemento || !bairro || !municipio || !uf) {
    return message(
      res,
      400,
      'Sem informações suficientes para atualizar o cadastro!'
    );
  }

  try {
    const rs = await query('inforesidenciais')
      .update({
        cep,
        logradouro,
        complemento,
        bairro,
        municipio,
        uf,
      })
      .where({
        cliente_id: id,
      })
      .returning('*');

    if (rs.length === 0) {
      return message(res, 400, 'Não foi possível atualizar os dados!');
    }

    return message(res, 204, 'Dados atualizados com sucesso!');
  } catch (error) {
    return message(res, 400, error.message);
  }
};

const updateClientFunctional = async (req, res) => {};

const updateClientBank = async (req, res) => {};

const linkTables = async (table, data, id) => {
  data.cliente = id;
  try {
    const rs = await query(table).insert(data).returning('id');
    return rs;
  } catch (error) {
    return [];
  }
};

module.exports = {
  getAllClients,
  getClientProfile,
  getClientContracts,
  createNewClient,
  patchClient,
  updateClientBank,
  updateClientFunctional,
  updateClientResidencial,
};
