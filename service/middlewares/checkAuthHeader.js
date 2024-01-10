const checkHeader = function(req, res, next) {
    const authHeader = req.get('authenticated-user');
    if(!authHeader) {
        return res.status(403).json({data: {}, message: 'Acces denied.'})
    }
    next();
}

export {
    checkHeader
}