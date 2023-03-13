const connection = require('../services/connection');
const message = require('../services/messages');
const bcrypt = require('bcrypt');
const yup = require('yup');
const { setLocale } = require('yup');
const { pt } = require('yup-locales');

setLocale(pt);

const getAllUsers = async (_, res) => {
  try {
    const rs = await connection('usuarios');
    return message(res, 200, rs);
  } catch (error) {
    return message(res, 400, 'Erro');
  }
};

const getUserProfile = async (req, res) => {
  const { id } = req.user;

  try {
    const rs = await connection('usuarios').where({ id });

    if (rs.length === 0) {
      return message(res, 400, 'Usuário não encontrado!');
    }
    const { senha: _, ...user } = rs[0];
    return message(res, 200, user);
  } catch (error) {
    return message(res, 400, error.message);
  }
};

const createNewUser = async (req, res) => {
  const { nome, email, senha, nivel, avatar } = req.body;

  console.log('Chegou aqui');
  try {
    const schema = yup.object().shape({
      nome: yup.string().required(),
      senha: yup
        .string()
        .min(6)
        .required('Senha deve ter entre 6 e 8 caracteres'),
    });

    await schema.validate(req.body);

    const hash = await bcrypt.hash(senha.toString(), 12);

    const rs = await connection('usuarios')
      .insert({
        nome,
        email,
        senha: hash,
        nivel,
        avatar,
      })
      .returning('*');

    if (rs.length === 0) {
      return message(res, 400, 'Não foi possível cadastrar o usuário!');
    }

    return message(res, 200, 'Cadastro realizado com sucesso!');
  } catch (error) {
    return message(res, 400, error.message);
  }
};

const updateUserData = async (req, res) => {
  const { id } = req.user;
  const data = req.body;
  try {
    if (data.senha) {
      const schema = yup.object().shape({
        senha: yup
          .string()
          .min(6)
          .max(8)
          .required('Senha deve ter entre 6 e 8 caracteres'),
      });
      await schema.validate({ senha: data.senha });
    }

    if (data.senha) {
      const search = await connection('usuarios')
        .select('*')
        .where({ id })
        .first();

      const hash = await bcrypt.hash(data.senha.toString(), 12);

      const result = await bcrypt.compare(data.senha, search.senha);
      if (!result) data.senha = hash;
    }

    const rs = await connection('usuarios')
      .where({ id })
      .update(data)
      .returning('*');

    if (rs.length === 0) {
      return message(res, 400, 'Não foi possível atualizar os dados!');
    }

    return message(res, 201, 'Dados atualizados com sucesso!');
  } catch (error) {
    console.error(error);
    return message(res, 400, error.message);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    if (user.id === Number(id)) {
      return message(res, 400, 'Não é possível excluir o próprio usuário!');
    }

    const rs = await connection('usuarios').where({ id }).del();

    if (rs === 0) {
      return message(res, 400, 'Não foi possível deletar o usuário!');
    }

    return message(res, 200, 'Usuário deletado com sucesso!');
  } catch (error) {
    return message(res, 400, error.message);
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
  createNewUser,
  updateUserData,
  deleteUser,
};
