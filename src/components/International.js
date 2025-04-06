import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";

export const International = () => {
	const [initialData, setinitialData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [filterValue, setFilterValue] = useState("");
	const filterTable = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(
				`https://messaging.approot.ng/internationalSearch.php?phone=${filterValue}`
			);
			setinitialData(
				data.sort((a, b) => {
					const dateA = new Date(a.created_at);
					const dateB = new Date(b.created_at);
					return dateB - dateA;
				})
			);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	const override = {
		display: "block",
		margin: "0 auto",
	};

	const newColumns = [
		{
			field: "id",
			headerName: "ID",
			type: "number",
			width: 90,
			headerAlign: "left",
			align: "left",
		},
		{
			field: "message_request_id",
			headerName: "Message Id",
			type: "number",
			width: 90,
			headerAlign: "left",
			align: "left",
		},
		{
			field: "messages",
			headerName: "Message",
			type: "number",
			width: 100,
			headerAlign: "left",
			align: "left",
		},
		{
			field: "phone",
			headerName: "Recipient",
			width: 100,
			headerAlign: "left",
			align: "left",
		},
		{
			field: "sender_id",
			headerName: "Sender Id",
			width: 100,
			headerAlign: "left",
			align: "left",
		},
		{
			field: "created_at",
			headerName: "Date Time",
			width: 200,
			headerAlign: "left",
			align: "left",
		},
		{
			field: "updated_at",
			headerName: "Delivery Time",
			width: 200,
			headerAlign: "left",
			align: "left",
		},

		{
			field: "status",
			headerName: "Status",
			sortable: false,
			width: 100,
			headerAlign: "left",
			align: "left",
			renderCell: (params) => {
				if (params.value === null || !params.value) {
					return (
						<p className='p-[0.5px] bg-yellow-300 text-yellow-400'>Pending</p>
					);
				} else if (params.value === "DELIVRD") {
					return (
						<p className='p-[1.5px] rounded-sm bg-green-500 text-white'>
							Delivered
						</p>
					);
				} else if (params.value === "EXPIRD") {
					return (
						<p className='p-[1.5px] bg-gray-300 rounded-sm text-black'>
							Expired
						</p>
					);
				} else if (params.value === "UNDELIV") {
					return (
						<p className='p-[1.5px] bg-gray-300 rounded-sm text-red-500'>
							Undelivered
						</p>
					);
				} else if (params.value === "REJECTED") {
					return (
						<p className='p-[1.5px] bg-red-500 rounded-sm text-white'>
							Rejected
						</p>
					);
				} else {
					return (
						<p className='p-[1.5px] bg-red-500 rounded-sm text-white'>Sent</p>
					);
				}
			},
		},
	];

	const getItems = async () => {
		setLoading(true);
		try {
			const { data } = await axios.get(
				"https://messaging.approot.ng/international.php"
			);
			setinitialData(
				data.sort((a, b) => {
					const dateA = new Date(a.created_at);
					const dateB = new Date(b.created_at);
					return dateB - dateA;
				})
			);
			setLoading(false);
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	useEffect(() => {
		getItems();

		return () => {
			console.log("cleared data");
		};
	}, []);
	return (
		<div>
			{loading ? (
				<div className='flex justify-center items-center h-screen'>
					<FadeLoader
						loading={loading}
						cssOverride={override}
						size={250}
						aria-label='Loading Spinner'
						data-testid='loader'
					/>
				</div>
			) : (
				<div>
					<div className='border-b-[0.5px] px-2 my-4 border-gray-400 border-solid'>
						<p>Messages</p>
					</div>
					<div className='border-b-[0.5px] justify-between items-center flex px-2 border-gray-400 border-solid h-8'>
						<p className='border-b-[0.5px] pb-6 font-bold text-red-500 border-red-500 border-solid'>
							Logs
						</p>
					</div>
					<div className='flex justify-center flex-col items-center overflow-auto'>
						<div className='flex justify-between items-center my-2 w-full p-4'>
							{/* Form 1 */}
							<form
								className='flex items-center justify-center text-center  space-x-2'
								onSubmit={filterTable}
							>
								<input
									type='search'
									placeholder='Search Phone Number'
									className='border-[0.8px] border-solid text-sm focus:outline-none border-gray-500 p-1 rounded-sm'
									value={filterValue}
									required
									onChange={(e) => setFilterValue(e.target.value)}
								/>
								<button className='border-[0.8px] border-solid  focus:outline-none border-gray-500 p-1 rounded-sm text-sm text-black  hover:bg-gray-400 hover:text-white'>
									Filter
								</button>
							</form>

							{/* Form 2 */}
						</div>
						<div className=' w-full  p-2'>
							<DataGrid
								rows={initialData.map((item, index) => ({
									id: index + 1,
									...item,
								}))}
								rowHeight={80}
								columns={newColumns}
								initialState={{
									pagination: {
										paginationModel: { page: 0, pageSize: 10 },
									},
								}}
								sx={{
									boxShadow: 2,
									border: 0.5,

									padding: 0.5,
								}}
								pageSizeOptions={[10, 20]}
								checkboxSelection
								// getRowId={(row) => row?.id}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
