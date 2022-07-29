import { useEffect, useMemo, useState } from "react"
import { useEnvironment } from "./Environment"
import { shallowEqual } from "./helpers/shallowEqual"
import { useRefCurrent } from "./hooks/useRefCurrent"
import { StateMachine } from "./StateMachine"
import { cloneDeep } from "lodash"

const initialTableData = [
	["Chet ", "Coros"],
	["Tanvir", "Raj"],
	["", ""],
]

const tableState = {
	tableData: initialTableData,

	lastColumnIndex: Number(initialTableData[0].length - 1),
	lastRowIndex: Number(initialTableData.length - 1),

	showAddColumnButton: false,
	showAddRowButton: false,
}

export type TableData = typeof tableState

export function newTableData(): TableData {
	return tableState
}

const reducers = {
	getTableCellIndexOnHover(
		tableDatabase: TableData,
		columnIndex: number,
		rowIndex: number
	) {
		if (
			tableDatabase.lastColumnIndex === columnIndex &&
			tableDatabase.lastRowIndex === rowIndex
		) {
			return {
				...tableDatabase,
				showAddColumnButton: true,
				showAddRowButton: true,
			}
		} else if (
			tableDatabase.lastColumnIndex !== columnIndex &&
			tableDatabase.lastRowIndex === rowIndex
		) {
			return {
				...tableDatabase,
				showAddColumnButton: false,
				showAddRowButton: true,
			}
		} else if (
			tableDatabase.lastColumnIndex === columnIndex &&
			tableDatabase.lastRowIndex !== rowIndex
		) {
			return {
				...tableDatabase,
				showAddColumnButton: true,
				showAddRowButton: false,
			}
		} else if (
			tableDatabase.lastColumnIndex !== columnIndex &&
			tableDatabase.lastRowIndex !== rowIndex
		) {
			return {
				...tableDatabase,
				showAddColumnButton: false,
				showAddRowButton: false,
			}
		} else if (tableDatabase.lastColumnIndex === columnIndex) {
			return { ...tableDatabase, showAddColumnButton: true }
		} else if (tableDatabase.lastColumnIndex !== columnIndex) {
			return { ...tableDatabase, showAddColumnButton: false }
		} else if (tableDatabase.lastRowIndex === rowIndex) {
			return { ...tableDatabase, showAddRowButton: true }
		} else if (tableDatabase.lastRowIndex !== rowIndex) {
			return { ...tableDatabase, showAddRowButton: false }
		}

		return { ...tableDatabase }
	},

	resetTableCellIndex(tableDatabase: TableData) {
		return {
			...tableDatabase,
			showAddColumnButton: false,
			showAddRowButton: false,
		}
	},

	addNewColumn(tableDatabase: TableData) {
		const { tableData } = tableDatabase

		const currentTableState = cloneDeep(tableData)
		currentTableState.map((item) => item.push(""))

		const newLastColumnIndex = Number(currentTableState[0].length - 1)

		const newState = {
			...tableDatabase,
			tableData: currentTableState,
			lastColumnIndex: newLastColumnIndex,
		}

		return newState
	},

	addNewRow(tableDatabase: TableData) {
		const { tableData } = tableDatabase

		const currentTableState = cloneDeep(tableData)
		const totalColumn = tableDatabase.tableData[0].length
		currentTableState.push(Array(totalColumn).fill(""))

		const newLastRowIndex = Number(currentTableState.length - 1)

		return {
			...tableDatabase,
			tableData: currentTableState,
			lastRowIndex: newLastRowIndex,
		}
	},

	addNewRowAndColumn(tableDatabase: TableData) {
		const { tableData } = tableDatabase
		const currentTableState = cloneDeep(tableData)

		currentTableState.map((item) => item.push(""))

		const totalColumn = currentTableState[0].length
		currentTableState.push(Array(totalColumn).fill(""))

		const newLastColumnIndex = Number(currentTableState[0].length - 1)
		const newLastRowIndex = Number(currentTableState.length - 1)

		return {
			...tableDatabase,
			tableData: currentTableState,
			lastRowIndex: newLastRowIndex,
			lastColumnIndex: newLastColumnIndex,
		}
	},

	updateCell(
		tableDatabase: TableData,
		text: string | null,
		columnIndex: number,
		rowIndex: number
	) {
		const { tableData } = tableDatabase

		tableData[rowIndex][columnIndex] = text ? text : ""

		return { ...tableDatabase }
	},
}

export class AppState extends StateMachine<TableData, typeof reducers> {
	constructor(initialTable: TableData) {
		super(initialTable, reducers)
	}
}

export function useAppState<T>(selector: (state: TableData) => T) {
	const { app } = useEnvironment()
	const initialState = useMemo(() => {
		return selector(app.state)
	}, [])

	const [state, setState] = useState(initialState)
	const currentStateRef = useRefCurrent(state)

	useEffect(() => {
		return app.addListener(() => {
			const nextState = selector(app.state)
			if (shallowEqual(currentStateRef.current, nextState)) return
			setState(nextState)
		})
	}, [])

	return state
}
