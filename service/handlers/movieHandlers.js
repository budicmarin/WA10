import { movies } from "../models/movieModel.js";
import { ObjectId } from "mongodb";
import db from "../db/connection.js";
let moviesCollection = db.collection("Movies");

async function generateTestData() {
	_addMovies(movies);
}

async function add(movieData) {
	var result = null;
	if (Array.isArray(movieData)) {
		result = await _addMovies(movieData);
	} else if (typeof movieData === "object") {
		result = await _addMovie(movieData);
	}
	return result;
}

//mongo ne vraca novo dodani podatak, pa je ovo jedno od rjesenja
async function _addMovie(movieData) {
	let result = await moviesCollection.insertOne(movieData);
	if (result.acknowledged === true) {
		movieData._id = result.insertedId;
	}
	return movieData;
}

//mozete i sami dodati ObjectId u servisu, onda se dodaje options i flag forceServerObjectId
//na taj nacin mozete znati koji objekt je dodan i spojiti ga s id-jem
//ako vam gore opisano nije potrebno, onda mozete i pustiti ovako - vratit ce x insertanih id-jeva
async function _addMovies(movieData) {
	const result = await moviesCollection.insertMany(movieData);
	return result;
}

async function get(movieData) {
	const result =
		movieData.length === 1
			? await _getMovie(movieData)
			: await _getMovies(movieData);
	return result;
}

async function _getMovie(movieData) {
	const result = await moviesCollection.findOne({ id: movieData[0] });
	return result;
}

async function _getMovies(movieData) {
	const result = await moviesCollection
		.find({ id: { $in: movieData } })
		.toArray();
	return result;
}

//prouci razlike u dokumentaciji za metode:
//updateOne, updateMany, replaceOne, findOneAndUpdate, findOneAndReplace
//patch vise kao update, a put je vise kao replace, ali nije potpuni istovjetno
async function update(query, delta) {
	const result = await _updateMovies(query, delta);
	return result;
}

//Zasto se ne koristi updateMovie?
//proci metode
async function _updateMovie(query, delta) {
	const result = await moviesCollection.updateOne();
	return result;
}

async function _updateMovies(query, delta) {
	const result = await moviesCollection.updateMany(query, { $set: delta });
	return result;
}

async function remove(movieData) {
	const result =
		movieData.length === 1
			? await _removeMovie(movieData)
			: await _removeMovies(movieData);
	return result;
}

async function _removeMovie(movieData) {
	const result = await moviesCollection.deleteOne({ id: movieData[0] });
	return result;
}

async function _removeMovies(movieData) {
	const result = await moviesCollection.deleteMany({
		id: { $in: movieData },
	});
	return result;
}

async function groupMovies() {
	const aggregationPipeline = [
		{
			$unwind: "$genres", // Deconstruct genres array to individual documents
		},
		{
			$group: {
				_id: "$genres", // Group by genres
				count: { $sum: 1 }, // Count movies in each genre
			},
		},
	];
	const result = await moviesCollection
		.aggregate(aggregationPipeline)
		.toArray();
	return result;
}

async function sortMovies() {
	const aggregationPipeline = [
		{
			$sort: { year: 1 },
		},
	];
	const result = await moviesCollection
		.aggregate(aggregationPipeline)
		.toArray();
	return result;
}

async function countMovies(query) {
	const result = await moviesCollection.countDocuments(query);
	return result;
}

async function getDistinctMovies(query) {
	const result = await moviesCollection.distinct(
		query[Object.keys(query)[0]]
	);
	return result;
}

export {
	add,
	get,
	update,
	remove,
	groupMovies,
	sortMovies,
	countMovies,
	getDistinctMovies,
	generateTestData,
};
