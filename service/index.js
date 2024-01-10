import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import * as movie from "./handlers/movieHandlers.js";
import * as users from "./handlers/userHandlers.js";
import { checkNumericInput } from "./middlewares/checkNumericInput.js";
import { parseToNumeric } from "./middlewares/parseToNumeric.js";
import { requestTime } from './middlewares/getRequestTime.js'
import { checkHeader } from './middlewares/checkAuthHeader.js'
import { authenticateToken } from './middlewares/authenticateToken.js'
import { error } from "console";

dotenv.config();
const app = express();
const router = express.Router();
const port = 5000 || process.env.SERVICE_PORT;
let loginPodaci;
app.use(express.json());
app.use("/api", router);

router.route("/movie/test").post(async (req, res) => {
	const respData = await movie.generateTestData(reqData);
	res.json(respData);
});

router.route("/movie/group").get(async (req, res) => {
	const respData = await movie.groupMovies();
	res.json(respData);
});

router.route("/movie/sort").get(async (req, res) => {
	const respData = await movie.sortMovies();
	res.json(respData);
});

router.route("/movie/count").get(async (req, res) => {
	const reqData = req.query;
	const respData = await movie.countMovies(reqData);
	res.json(respData);
});

router.route("/movie/distinct").get(async (req, res) => {
	const reqData = req.query;
	const respData = await movie.getDistinctMovies(reqData);
	res.json(respData);
});

router
	.route("/movie/:id")
	.get(checkNumericInput, parseToNumeric, async (req, res) => {
		const reqData = req.params.id;
		const respData = await movie.get(reqData);
		res.json(respData);
	})
	.delete(checkNumericInput, parseToNumeric, async (req, res) => {
		const reqData = req.params.id;
		const respData = await movie.remove(reqData);
		res.json(respData);
	});

router
	.route("/movie")
	.post(async (req, res) => {
		const respData = await movie.add(req.body);
		res.json(respData);
	})
	.patch(async (req, res) => {
		const query = req.query;
		const change = req.body;
		const respData = await movie.update(query, change);
		res.json(respData);
	});

//register
router.route("/user/register").post(async (req, res) => {
	try {


		const result = await users.registerUser(req.body);
		res.status(200).json(result);
	} catch (error) {

		res.status(500).json({});

	}
});
//login
router.route("/user/login").post(async (req, res) => {


	try {
		debugger
		const result = await users.loginUser(req.body);

		res.status(200).json(result);
		loginPodaci = result.localStorage;
	} catch (error) {
		res.status(500).json({});
	}
});
router.route('/user/profile').patch(async (req, res) => {

	const updatedData = req.body;

	try {
		debugger;
		const result = await users.changeUserProfile(loginPodaci, updatedData);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
//delete
router.route('/user').delete(async (req, res) => {
	try {
		debugger
		const result = await users.deleteUser(req.body);
		res.status(200).json(result);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
})

app.listen(port, () => {
	console.log(`Service radi na portu ${port}`);
});
