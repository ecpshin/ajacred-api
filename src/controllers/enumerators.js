const fs = require('fs/promises');
const path_tipos = './src/lists/tipos.json';
const path_types = './src/lists/types.json';

const addTipos = async (req, res) => {
  const { tipo } = req.body;
  try {
    const tipos = JSON.parse(await fs.readFile(path_tipos, 'utf-8'));
    tipos.push(tipo);
    const fileJSON = JSON.stringify(tipos);
    await fs.writeFile(path_tipos, fileJSON);

    return res
      .status(200)
      .json({ mensagem: 'Cadastro realizado com sucesso!' });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getTipos = async (_req, res) => {
  try {
    const tipos = JSON.parse(await fs.readFile(path_tipos, 'utf-8'));
    return res.status(200).json(tipos);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateTipos = async (req, res) => {
  const { local } = req.body;
  const listaString = JSON.stringify(local);
  try {
    await fs.writeFile(path_tipos, listaString);
    return res.status(200).json({ mensagem: 'Atualizado com sucesso!' });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro no servidor!' });
  }
};

const deleteTipo = async (req, res) => {
  return res.status(202).json('Excluído com sucesso!');
};

const getTypesOrgaos = async (req, res) => {
  try {
    const arquivo = await fs.readFile('./src/lists/types.json', 'utf-8');
    const tipos = JSON.parse(arquivo);
    return res.status(200).json(tipos);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json(error);
  }
};

const setTypesOrgaos = async (req, res) => {};

const patchTypesOrgaos = async (req, res) => {};

const deleteTypesOrgaos = async (req, res) => {};

module.exports = {
  addTipos,
  getTipos,
  updateTipos,
  deleteTipo,
  setTypesOrgaos,
  getTypesOrgaos,
  deleteTypesOrgaos,
  patchTypesOrgaos,
};
