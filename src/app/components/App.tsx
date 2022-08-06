import React, { useState } from "react"
import { useAppState } from "../AppState"
import { useEnvironment } from "../Environment"

export function App() {
	const environment = useEnvironment()
	const { app } = environment

	const tableDatabase = useAppState((data) => data.tableData)

	const showAddColumnButton = useAppState((data) => data.showAddColumnButton)
	const showAddRowButton = useAppState((data) => data.showAddRowButton)
	const showAddRowAndColumnButton = showAddColumnButton && showAddRowButton

	const [onAddColumnMouseHover, setOnAddColumnMouseHover] =
		useState<boolean>(false)

	const [onAddRowMouseHover, setOnAddRowMouseHover] = useState<boolean>(false)
	const [onAddColumnAndRowMouseHover, setOnAddColumnAndRowMouseHover] =
		useState<boolean>(false)

	//console.log("tableDatabase", tableDatabase)

	return (
		<>
			<div
				style={{
					padding: "0px 200px",
				}}
			>
				<div style={{ position: "relative" }}>
					<div style={{ display: "flex" }}>
						<div style={{ position: "relative" }}>
							<table
								style={{ margin: "8px 18px 18px 8px" }}
								onMouseLeave={() => app.dispatch.resetTableCellIndex()}
							>
								{tableDatabase.map((tableData, rowIndex: number) => {
									return (
										<tr key={rowIndex}>
											{tableData.map((item, columnIndex) => {
												return (
													<TableCell
														rowIndex={rowIndex}
														columnIndex={columnIndex}
														cellData={item}
													/>
												)
											})}
										</tr>
									)
								})}
							</table>

							{/* Add New Column */}
							<div
								onClick={() => app.dispatch.addNewColumn()}
								style={{
									position: "absolute",
									display: "flex",
									right: "0px",
									top: "8px",
									bottom: "18px",
								}}
							>
								<div
									onMouseEnter={() => setOnAddColumnMouseHover(true)}
									onMouseLeave={() => setOnAddColumnMouseHover(false)}
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										opacity:
											showAddColumnButton || onAddColumnMouseHover ? 1 : 0,
										height: "100%",
										width: "100%",
										transition: "opacity 150ms ease 50ms",
									}}
								>
									<div
										style={{
											userSelect: "none",
											cursor: "col-resize",
											width: "16px",
											borderRadius: "3px",
											height: "100%",
											transition: "background 20ms ease-in 0s",
											background: onAddColumnMouseHover
												? "rgba(55, 53, 47, 0.08)"
												: "transparent",
										}}
									>
										<div
											style={{
												borderRadius: "3px",
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												height: "100%",
												background: "rgba(55, 53, 47, 0.06)",
											}}
										>
											+
										</div>
									</div>
								</div>
							</div>

							{/* Add New Row */}
							<div
								style={{
									position: "absolute",
									display: "flex",
									left: "8px",
									bottom: "0px",
									right: "18px",
									flexDirection: "row",
								}}
							>
								<div
									onMouseEnter={() => setOnAddRowMouseHover(true)}
									onMouseLeave={() => setOnAddRowMouseHover(false)}
									onClick={() => app.dispatch.addNewRow()}
									style={{
										display: "flex",
										transition: "opacity 150ms ease 50ms",
										opacity: showAddRowButton || onAddRowMouseHover ? 1 : 0,
										height: "100%",
										width: "100%",
									}}
								>
									<div
										style={{
											flex: "1 1 0%",
											userSelect: "none",
											cursor: "row-resize",
											width: "100%",
											borderRadius: "3px",
											height: "16px",
											transition: "background 20ms ease-in 0s",
											background: onAddRowMouseHover
												? "rgba(55, 53, 47, 0.08)"
												: "transparent",
										}}
									>
										<div
											style={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												height: "100%",
												width: "100%",
												background: "rgba(55, 53, 47, 0.06)",
											}}
										>
											+
										</div>
									</div>
								</div>
							</div>

							{/* Add New Row and Coumn */}
							<div
								onClick={() => app.dispatch.addNewRowAndColumn()}
								style={{
									position: "absolute",
									display: "flex",
									bottom: "0px",
									right: "0px",
								}}
							>
								<div
									onMouseOver={() => setOnAddColumnAndRowMouseHover(true)}
									onMouseOut={() => setOnAddColumnAndRowMouseHover(false)}
									style={{
										display: "flex",
										width: "100%",
										height: "100%",
										borderRadius: "50%",
										opacity:
											showAddRowAndColumnButton || onAddColumnAndRowMouseHover
												? 1
												: 0,
									}}
								>
									<div
										style={{
											flex: "1 1 0%",
											userSelect: "none",
											cursor: "nwse-resize",
											width: "16px",
											borderRadius: "50%",
											height: "16px",
											transition: "background 20ms ease-in 0s",
											background: onAddColumnAndRowMouseHover
												? "rgba(55, 53, 47, 0.08)"
												: "transparent",
										}}
									>
										<div
											style={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												height: "100%",
												width: "100%",
												borderRadius: "50%",
												background: "rgba(55, 53, 47, 0.06)",
											}}
										>
											+
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

function TableCell({ cellData, rowIndex, columnIndex }) {
	const environment = useEnvironment()
	const { app } = environment

	return (
		<td
			onMouseOver={() => {
				app.dispatch.getTableCellIndexOnHover(columnIndex, rowIndex)
			}}
			style={{
				minHeight: "32px",
				minWidth: "120px",
				maxWidth: "240px",
				padding: "1px 2px",
				border: "1px solid rgb(233, 233, 231)",
				verticalAlign: "top",
				color: "inherit",
				fill: "inherit",
			}}
			contentEditable
			onInput={(e) =>
				app.dispatch.updateCell(
					e.currentTarget.textContent,
					columnIndex,
					rowIndex
				)
			}
		>
			<div>
				<div
					style={{
						maxWidth: "100%",
						whiteSpace: "pre-wrap",
						wordBreak: "break-word",
						caretColor: "rgb(55, 53, 47)",
						padding: "7px 9px",
						backgroundColor: "transparent",
						fontSize: "14px",
						lineHeight: "20px",
						minHeight: "1em",
						color: "rgb(55, 53, 47)",
					}}
				>
					{cellData}
				</div>
			</div>
		</td>
	)
}
