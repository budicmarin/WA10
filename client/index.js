import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import { showSuccess, showError } from "./util.js";

//pod headers mozes staviti i auth token -> preporuka za projekt
const movieService = axios.create({
	baseURL: `${process.env.baseURL}:${process.env.port}`,
	timeout: 600000,
	headers: { "X-Custom-Header": "banana" },
});

//Ako nekim slucajem izbrisete sve podatke u bazi, pozovite ovu rutu
function generateTestData() {
	movieService
		.post("/api/movie/test")
		.then(showSuccess(response))
		.catch(showError(error));
}

//property id je legacy koji cemo pustiti
//potrebno ga je zamijeniti s Mongovim ObjectId-jem - semantika
//umjesto id-ja to moze biti i neki drugi property, pr. year ili name
function getMovie() {
	const id = 8;
	movieService
		.get(`/api/movie/${id}`)
		.then((response) => {
			showSuccess(response);
		})
		.catch((error) => {
			showError(error);
		});
}

function getMovies() {
	const ids = [5, 6, 7, 8];
	movieService
		.get(`/api/movie/${ids.join(",")}`)
		.then((response) => {
			showSuccess(response);
		})
		.catch((error) => {
			showError(error);
		});
}

function addMovie() {
	const movie = {
		id: 12,
		title: "Interstellar",
		genres: ["Adventure", "Drama", "Sci-Fi"],
		year: 2014,
		rating: 8.7,
	};

	movieService
		.post("/api/movie", movie)
		.then((response) => {
			showSuccess(response);
		})
		.catch((error) => {
			showError(error);
		});
}

function addMovies() {
	const movies = [
		{
			id: 12,
			title: "Interstellar",
			genres: ["Adventure", "Drama", "Sci-Fi"],
			year: 2014,
			rating: 8.7,
		},
		{
			id: 11,
			title: "Se7en",
			genres: ["Crime", "Mystery", "Drama"],
			year: 1995,
			rating: 8.6,
		},
	];
	movieService
		.post("/api/movie", movies)
		.then((response) => {
			showSuccess(response);
		})
		.catch((error) => {
			showError(error);
		});
}

function updateMovie() {
	const movie = {
		rating: 8.6,
	};
	movieService
		.patch(`/api/movie?title=${"Pulp Fiction"}`, movie)
		.then((response) => {
			showSuccess(response);
		})
		.catch((error) => {
			showError(error);
		});
}

function deleteMovie() {
	const movieId = 12;
	movieService
		.delete(`/api/movie/${movieId}`)
		.then((response) => {
			showSuccess(response);
		})
		.catch((error) => {
			showError(error);
		});
}

function deleteMovies() {
	const ids = [12, 13];
	movieService
		.delete(`/api/movie/${ids.join(",")}`)
		.then((response) => {
			showSuccess(response);
		})
		.catch((error) => {
			showError(error);
		});
}

//Ekstra metode
function getGroupedMovies() {
	movieService
		.get(`/api/movie/group`)
		.then((response) => {
			showSuccess(response);
		})
		.catch((error) => {
			showError(error);
		});
}

function getSortedMovies() {
	movieService
		.get(`/api/movie/sort`)
		.then((response) => {
			showSuccess(response);
		})
		.catch((error) => {
			showError(error);
		});
}

function getMovieCount() {
	movieService
		.get(`/api/movie/count?title=${"The Dark Knight"}`)
		.then((response) => {
			showSuccess(response);
		})
		.catch((error) => {
			showError(error);
		});
}

function getDistinctMovies() {
	movieService
		.get(`/api/movie/distinct?property=${"genres"}`)
		.then((response) => {
			showSuccess(response);
		})
		.catch((error) => {
			showError(error);
		});
}

//getMovie();
//getMovies();
//addMovie();
//addMovies();
//updateMovie();
//deleteMovie();
//deleteMovies();

//getGroupedMovies();
//getSortedMovies();
//getMovieCount();
//getDistinctMovies();

//Primjer koji prikazuje kako poslati vise zahtjeva i kako pricekati sve odgovore
// Promise.all([
// 	getGroupedMovies(),
// 	getSortedMovies(),
// 	getMovieCount(),
// 	getDistinctMovies(),
// ]).then(function (results) {
// 	debugger;
// 	const groups = results[0];
// 	const sorted = results[1];
// 	const count = results[2];
// 	const distinct = results[3];
// 	console.log(groups, sorted, count, distinct);
// });
