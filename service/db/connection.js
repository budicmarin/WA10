import { MongoClient } from "mongodb";
const connectionString =
	"mongodb+srv://mbudic:mbudic@cluster0.aeaofts.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(connectionString);
let conn = null;
try {
	console.log("Trying to establish connection...");
	conn = await client.connect();
	console.log(conn);
} catch (e) {
	console.error(e);
}
let db = conn.db("testDB");
export default db;
