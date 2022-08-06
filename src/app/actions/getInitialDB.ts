import { Environment } from "../Environment"

import { openDB } from "idb"

const initDb = {
	tableData: [
		["Chet ", "Coros"],
		["Tanvir", "Raj"],
		["", ""],
	],
}

let db
async function setInitialDB() {
	db = await openDB("table_DB", 1, {
		upgrade(db) {
			db.createObjectStore("table_DB", { keyPath: "table_DB" })
		},
	})

	await db.add("table_DB", initDb)
}

async function getTableValue() {
	let tx = db.transaction("table_DB")
	let bookStore = tx.objectStore("table_DB")

	let books = await bookStore.getAll()
	return books
}

export async function getInitialData(environment: Environment) {
	await setInitialDB()
	const data = await getTableValue()

	environment.app.dispatch.setInitTableData(data)
}
