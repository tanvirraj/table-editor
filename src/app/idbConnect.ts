export const DATABASE = "tableDB"
export const DB_VERSION = 1

// export function idbConnect() {
// 	return new Promise((resolve, reject) => {
// 		const request = indexedDB.open(DATABASE, DB_VERSION)

// 		request.onsuccess = (ev) => {
// 			resolve(request.result)
// 		}

// 		request.onupgradeneeded = (ev: any) => {
// 			//Is fired when version changes. Create data tables
// 			const db = ev?.target?.result
// 			const objectStore = db.createObjectStore("tableDB", {
// 				keyPath: "tableData",
// 			})
// 		}

// 		request.onerror = () => {
// 			reject("Error occured")
// 		}
// 		request.onblocked = () => {
// 			reject("Blocked!")
// 		}
// 	})
// }
