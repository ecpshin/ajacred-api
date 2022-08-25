const message = (res, number, text) => {
    return res.status(number).json(text);
}

module.exports = message;