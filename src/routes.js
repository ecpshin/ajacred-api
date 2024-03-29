const express = require('express')
const routes = express()

const authenticate = require('./controllers/login')
const banks = require('./controllers/banks')
const clientes = require('./controllers/clients')
const contratos = require('./controllers/contratos')
const finn = require('./controllers/financeiras')
const situacoes = require('./controllers/situations')
const usuarios = require('./controllers/usuarios')
const operacoes = require('./controllers/operacoes');
const orgaos = require('./controllers/orgaos')
const enums = require('./controllers/enumerators')
const filtros = require('./filters/filters')

routes.post('/login', authenticate.userAuthenticate)
routes.post('/usuarios', filtros.isEmailExists, usuarios.createNewUser)

routes.get('/tipos', enums.getTipos)
routes.post('/tipos', enums.addTipos)
routes.patch('/tipos/edit', enums.updateTipos)



routes.use(filtros.verifyLogin)

//Rotas de Clientes
routes.get('/cliente/:id', clientes.getClientProfile)
routes.get('/clientes', clientes.getAllClients)
routes.get('/clientes/contratos/:id', clientes.getClientContracts)
routes.post('/clientes', clientes.createNewClient)

//Rotas de Contratos
routes.get('/contratos', contratos.getAll)
routes.get('/contratos/:situacao/situacao', contratos.getContratosPorSituacao)
routes.get('/contratos/painel', contratos.getContratosPainel)
routes.post('/contratos/create', contratos.createNewContract)


//Rotas users
routes.get('/usuarios/profile', usuarios.getUserProfile)
routes.get('/usuarios', usuarios.getAllUsers)
routes.patch('/usuarios', filtros.emailUpdate, usuarios.updateUserData)
routes.delete('/usuarios', filtros.isEmailExists, usuarios.deleteUser)

routes.get('/bancos', banks.getAllBanks)
routes.get('/banco/:codigo', banks.getBankByCode)
routes.post('/banco', banks.setNewBank)
routes.patch('/banco', banks.updateBank)
routes.delete('/banco/:codigo', banks.deleteBank)

routes.get('/financeiras', finn.allFinanceiras)
routes.post('/financeiras', finn.createFinanceira)
routes.patch('/financeiras/:id', finn.patchFinanceira)
routes.delete('/financeiras/:id', finn.deleteFinanceira)

routes.get('/situacoes', situacoes.getSituacoes)
routes.get('/situacoes/:id', situacoes.getSituacaoById)
routes.post('/situacoes', situacoes.setNewSituacao)
routes.patch('/situacoes', situacoes.updateSituacao)
routes.delete('/situacoes/:id', situacoes.deleteSituacao)

routes.get('/orgaos', orgaos.getAll)
routes.post('/orgaos/create', orgaos.newOrgao);

routes.get('/operacoes', operacoes.getAll)
routes.post('/operacoes/create', operacoes.newOperacao);
routes.patch('/operacoes/:id', operacoes.updateOperacao);
routes.delete('/operacoes/:id', operacoes.deleteOperacao);

module.exports = routes
