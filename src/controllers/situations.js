const query = require('../services/connection');

const getSituations = async (req, res) => {
    try {
        const rs = await query('situacoes').select("*").orderBy('descricao');
    } catch (error) {
        console.log(error);
        res.status(500).json({"mensagem": "Erro do servidor!"});
    }
}

const setSituation = async (req, res) => {
    const id = req.params.id;
    try {
        const rs = await query('situacoes').insert(req.body);
    } catch (error) {
        console.log(error);
        return res.status(500).json({"mensagem": "Erro do servidor!"});
    }
}

const updateSituation = async (req, res) => {
    const id = req.params.id;
    try {
        const rs = await query('situacoes').update(req.body);
    } catch (error) {
        res.status(500).json({"mensagem": "Erro do servidor!"});
    }
}

const deleteSituation = async (req, res) => {
    const id = req.params.id;
    try {
        const rs = await query('situacoes').delete(id);
        return res.status(200).json({"mensagem": "Excluído com sucesso!"});
    } catch (error) {
        return res.status(500).json({"mensagem": "Erro do servidor!"});
    }
}

module.exports = {
    getSituations,
    setSituation,
    updateSituation,
    deleteSituation
}