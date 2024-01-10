const requestTime = function(req, res, next) {
    req.requestTime = Date.now();
    console.log(req.requestTime);
    next();
}

export { requestTime }