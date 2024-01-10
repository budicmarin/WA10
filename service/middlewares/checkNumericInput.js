const checkNumericInput = function (req, res, next) {
	if (!req?.params) {
		res.json({}).status(404);
	}

	const numbers = req.params.id.split(",");
	for (let i = 0; i < numbers.length; i++) {
		const trimmed = numbers[i].trim();
		if (!trimmed || isNaN(Number(trimmed))) {
			res.json({}).status(404);
		}
	}

	next();
};

export { checkNumericInput };
