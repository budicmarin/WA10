export function showSuccess(response) {
	console.log("Success Data: ", response.data);
}

export function showError(error) {
	console.log("Error Code: ", error.response.status);
	console.log("Error Status: ", error.response.statusText);
}
