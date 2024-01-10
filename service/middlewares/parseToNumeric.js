const parseToNumeric = function (req, res, next) {
	const numbers = req.params.id.split(",");
	req.params.id = numbers.map((x) => Number(x.trim()));
	next();
};

export { parseToNumeric };
