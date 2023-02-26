const express = require('express');
const usuarios = require('./controllers/usuarios');
const clientes = require('./controllers/clients');
const { userAuthenticate } = require('./controllers/login');
const {
  isEmailExists,
  verifyLogin,
  emailUpdate,
} = require('./filters/filters');

const {
  getAllBanks,
  getBankByCode,
  setNewBank,
  updateBank,
  deleteBank,
} = require('./controllers/banks');
const {
  getSituacoes,
  getSituacaoById,
  setNewSituacao,
  updateSituacao,
  deleteSituacao,
} = require('./controllers/situations');
const {
  getAll,
  getContractsBySituation,
  getBySituation,
} = require('./controllers/contracts');

const routes = express();

routes.post('/login', userAuthenticate);
routes.post('/usuarios', isEmailExists, usuarios.createNewUser);

routes.use(verifyLogin);

routes.get('/cliente/:id', clientes.getClientProfile);
routes.get('/clientes', clientes.getAllClients);
routes.get('/clientes/contratos/:id', clientes.getClientContracts);

//Rotas de Contratos
routes.get('/contratos', getAll);
routes.get('/contratos/situacoes', getContractsBySituation);
routes.get('/contratos/situacao', getBySituation);

routes.get('/usuarios/profile', usuarios.getUserProfile);
routes.get('/usuarios', usuarios.getAllUsers);
routes.patch('/usuarios', emailUpdate, usuarios.updateUserData);
routes.delete('/usuarios', isEmailExists, usuarios.deleteUser);

routes.get('/bancos', getAllBanks);
routes.get('/banco/:codigo', getBankByCode);
routes.post('/banco', setNewBank);
routes.patch('/banco', updateBank);
routes.delete('/banco/:codigo', deleteBank);

routes.get('/situacoes', getSituacoes);
routes.get('/situacoes/:id', getSituacaoById);
routes.post('/situacoes', setNewSituacao);
routes.patch('/situacoes', updateSituacao);
routes.delete('/situacoes/:id', deleteSituacao);

module.exports = routes;
