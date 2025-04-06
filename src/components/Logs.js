import React, { useState } from "react";
import axios from "axios";

export const Logs = () => {
	const [fromDateTransaction, setFromDateTransaction] = useState("");
	const [toDateTransaction, setToDateTransaction] = useState("");
	const [error, setError] = useState(null);

	const handleDownload = async () => {
		try {
			// Send a request to the server with the selected date range
			const fromDateTime = new Date(fromDateTransaction);
			const toDateTime = new Date(toDateTransaction);
			if (!fromDateTime || !toDateTime) {
				alert("Please select both From and To dates");
			} else if (fromDateTime.toDateString() !== toDateTime.toDateString()) {
				alert("from and To dates should be on the same day");
			} else if (toDateTime.getTime() > fromDateTime.getTime()) {
				alert("To date cannot be higher than from date");
			} else if (toDateTime.getTime() < fromDateTime.getTime()) {
				alert("from date cannot be higher than To date");
			} else {
				const fromDateTime = `${fromDateTransaction} 00:00:00`;
				const toDateTime = `${toDateTransaction} 23:59:59`;

				const { data } = await axios.get(
					"https://ubasms.approot.ng/php/sterlingdownload.php",
					{
						params: { fromDate: fromDateTime, toDate: toDateTime },
						responseType: "blob",
					}
				);

				// Check for a successful response
				if (data) {
					const blob = new Blob([data], { type: "text/csv" });
					const url = window.URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = `${fromDateTime}-${toDateTime}-sms_data.csv`;
					a.click();
					// setCsvData(""); // Clear CSV data
					setError(null); // Clear any previous errors
				} else {
					setError("Error downloading CSV");
				}
			}
		} catch (err) {
			setError("An error occurred while downloading the CSV.");
			console.error(err);
		}
	};

	return (
		<div>
			<div>
				<h2>
					<span className='border-b-[1px] border-red-400 pb-2'>Logs</span>
				</h2>
			</div>
			<div className='flex items-center my-8'>
				<span
					className={"mr-4 border-b-[2px] border-blue-400 pb-2 cursor-pointer"}
				>
					Download Logs
				</span>
			</div>
			<div>
				<div className='flex items-center my-6  justify-center '>
					<div>
						<label
							htmlFor='fromDate'
							className='block text-sm font-medium text-gray-700'
						>
							From Date:
						</label>
						<input
							type='date'
							id='fromDate'
							value={fromDateTransaction}
							onChange={(e) => setFromDateTransaction(e.target.value)}
							className='mt-1 p-2 border rounded focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400'
							required
						/>
					</div>
					<div className='ml-8'>
						<label
							htmlFor='toDate'
							className='block text-sm font-medium text-gray-700 '
						>
							To Date:
						</label>
						<input
							type='date'
							id='toDate'
							value={toDateTransaction}
							onChange={(e) => setToDateTransaction(e.target.value)}
							className='mt-1 p-2 border rounded focus:ring focus:ring-opacity-50 focus:ring-blue-400 focus:border-blue-400'
							required
						/>
					</div>
				</div>

				<div className='flex flex-col justify-center items-center'>
					{error && <div className='text-red-500 mt-4'>{error}</div>}
					<button
						onClick={handleDownload}
						className='mt-4 bg-blue-500 block hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-blue-400'
					>
						Download CSV
					</button>
				</div>
			</div>
		</div>
	);
};
