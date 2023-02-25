const connection = require("../services/connection");
const message = require("../services/messages");

const getAllClients = async (_, res) => {
  try {
    const rs = await connection("clientes").select("*").orderBy("nome", "asc");
    if (rs.length === 0) {
      return message(res, 404, "Nenhum cliente encontrado");
    }

    return message(res, 200, rs);
  } catch (error) {
    return message(res, 400, "Erro");
  }
};

const getClientProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const infoResidenciais = await connection("inforesidenciais")
      .select("cep", "logradouro", "complemento", "bairro", "municipio", "uf")
      .where({
        cliente: id,
      });

    const infoFuncionais = await connection("infofuncionais")
      .select(
        "id",
        "nrbeneficio",
        "phone1",
        "phone2",
        "phone3",
        "phone4",
        "emails",
        "senhas"
      )
      .where({
        cliente: id,
      });

    const infoBancarias = await connection("infobancarias")
      .select("id", "banco", "agencia", "conta", "tipo", "operacao")
      .where({
        cliente: id,
      });

    return message(res, 200, {
      residenciais: infoResidenciais ? infoResidenciais[0] : {},
      funcionais: infoFuncionais ? infoFuncionais[0] : {},
      bancarias: infoBancarias ? infoBancarias[0] : {},
    });
  } catch (error) {
    return message(res, 400, error.message);
  }
};

const getClientContracts = async (req, res) => {
  const { id } = req.params;
  try {
    const rs = await connection("view_contratos")
      .where({ cliente_id: id })
      .orderBy("pid", "desc")
      .select(
        "pid",
        "nome_orgao",
        "prazo",
        "total",
        "parcela",
        "liquido",
        "operacao",
        "situacao",
        "nome_financeira",
        "nome_correspondente"
      );
    if (rs.length === 0) {
      return message(res, 400, "Não há registro!");
    }
    return message(res, 200, rs);
  } catch (error) {
    return message(res, 500, "Erro do servidor!");
  }
};

const createNewClient = async (req, res) => {
  const { nome, email, telefone, cpf, endereco, cidade, estado } = req.body;

  try {
    const rs = await connection("clientes")
      .insert({
        nome,
        email,
        telefone,
        cpf,
        endereco,
        cidade,
        estado,
      })
      .returning("*");

    if (rs.length === 0) {
      return message(res, 400, "Não foi possível cadastrar o cliente!");
    }

    return message(res, 200, "Cadastro realizado com sucesso!");
  } catch (error) {
    return message(res, 400, error.message);
  }
};

const updateClientResidencial = async (req, res) => {
  const { id } = req.params;
  const { cep, logradouro, complemento, bairro, municipio, uf } = req.body;

  if (!cep || !logradouro || !complemento || !bairro || !municipio || !uf) {
    return message(
      res,
      400,
      "Sem informações suficientes para atualizar o cadastro!"
    );
  }

  try {
    const rs = await connection("inforesidenciais")
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
      .returning("*");

    if (rs.length === 0) {
      return message(res, 400, "Não foi possível atualizar os dados!");
    }

    return message(res, 204, "Dados atualizados com sucesso!");
  } catch (error) {
    return message(res, 400, error.message);
  }
};

const updateClientFunctional = async (req, res) => {};

const updateClientBank = async (req, res) => {};

module.exports = {
  getAllClients,
  getClientProfile,
  getClientContracts,
  createNewClient,
  updateClientBank,
  updateClientFunctional,
  updateClientResidencial,
};
