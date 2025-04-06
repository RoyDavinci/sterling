import React, { useCallback, useEffect, useState } from "react";
import { Image } from "./Image";
import FadeLoader from "react-spinners/FadeLoader";
import { Graph } from "./Graph";
import axios from "axios";

export const Airtime = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [values, setValues] = useState([]);
	const [transactions, setTransactions] = useState(
		new Date().toLocaleDateString()
	);
	const [date, setDate] = useState("");
	const [items, setItems] = useState([
		{
			successful: 0,
			pending: 0,
			failed: 0,
		},
	]);

	const calculatePercentages = (item) => {
		const updatedData = item.map((network) => {
			const total =
				Number(network.failed) +
				Number(network.successful) +
				Number(network.pending);
			const successPercentage = ((network.successful / total) * 100).toFixed(2);
			const failedPercentage = ((network.failed / total) * 100).toFixed(2);
			const pendingPercentage = ((network.pending / total) * 100).toFixed(2);

			return {
				...network,
				successPercentage,
				failedPercentage,
				pendingPercentage,
			};
		});

		return updatedData;
	};

	const onSubmit = async (e) => {
		e.preventDefault();

		if (new Date(date) > new Date()) {
			alert("Please Select a Date less than today's Date");
		} else {
			const from = `${date} 00:00:00`;
			const to = `${date} 23:59:59`;

			try {
				const { data } = await axios.post(
					`https://ubasms.approot.ng/php/airtimeSearch.php?from=${from}&to=${to}`
				);
				setValues(data);
				total(data);
				runCheck(data);
				setTransactions(date);
			} catch (error) {
				alert("An Error Occured, Please Retry");
			}
		}
	};

	const [fixTotal, setFixTotal] = useState([
		{
			totalCount: 0,
			percentageSuccessful: 0,
			percentagePending: 0,
			percentageFailed: 0,
		},
	]);
	const override = {
		display: "block",
		margin: "0 auto",
	};

	const runCheck = (data) => {
		// Initialize an object to store the aggregated values
		const aggregated = {
			successful: 0,
			pending: 0,
			failed: 0,
		};

		// Iterate through the 'check' array and aggregate the values
		data.forEach((item) => {
			aggregated.successful += item.successful;
			aggregated.pending += item.pending;
			aggregated.failed += item.failed;
		});

		// Create a new array with the aggregated values
		const aggregatedArray = [
			{
				pending: aggregated.pending,
				successful: aggregated.successful,
				failed: aggregated.failed,
			},
		];
		setItems(aggregatedArray);
	};

	const total = (data) => {
		// Initialize variables to store counts
		let totalCount = 0;
		let successfulCount = 0;
		let pendingCount = 0;
		let failedCount = 0;

		// Calculate counts and percentages
		data.forEach((item) => {
			totalCount += item.successful + item.pending + item.failed;
			successfulCount += item.successful;
			pendingCount += item.pending;
			failedCount += item.failed;
		});

		const successfulPercentage = (successfulCount / totalCount) * 100;
		const pendingPercentage = (pendingCount / totalCount) * 100;
		const failedPercentage = (failedCount / totalCount) * 100;

		// Create a new array with the calculated values
		const resultArray = [
			{
				totalCount: totalCount,
				percentageSuccessful: successfulPercentage.toFixed(2),
				percentagePending: pendingPercentage.toFixed(2),
				percentageFailed: failedPercentage.toFixed(2),
			},
		];

		setFixTotal(resultArray);
	};
	const getData = useCallback(async () => {
		setIsLoading(true);
		try {
			const { data } = await axios.get(
				"https://ubasms.approot.ng/php/airtime.php"
			);
			console.log(data);
			setIsLoading(false);
			const percentages = calculatePercentages(data);
			setValues(percentages);
			total(data);
			runCheck(data);
			setTransactions(new Date().toLocaleDateString());
		} catch (error) {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		// Call getItems initially when the component mounts
		getData();

		// Set up an interval to call getData every five seconds
		const interval = setInterval(() => {
			getData();
		}, 120000);

		// Clean up the interval when the component unmounts
		return () => {
			clearInterval(interval);
		};
	}, [getData]);

	return (
		<>
			{isLoading ? (
				<div className='flex justify-center items-center flex-col h-screen'>
					<FadeLoader
						loading={isLoading}
						cssOverride={override}
						size={300}
						aria-label='Loading Spinner'
						data-testid='loader'
					/>
				</div>
			) : (
				<div className='flex flex-col justify-center '>
					<header className='bg-blue-500 lg:p-4 p-2'>
						<div className='container mx-auto lg:flex block justify-between items-center'>
							<p className='text-white text-2xl font-bold'>
								Filter Transactions
							</p>

							<form
								action='#'
								method='POST'
								className='lg:flex block  items-center'
								onSubmit={onSubmit}
							>
								<input
									type='date'
									name='date'
									className='mr-2 px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300'
									value={date}
									onChange={(e) => setDate(e.target.value)}
									required
								/>

								<button
									type='submit'
									className='bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300'
								>
									Submit
								</button>
							</form>
						</div>
					</header>
					<div className='flex justify-center items-center my-2'>
						<h3> Transactions For {transactions}</h3>
					</div>

					<div className='lg:flex block   justify-center items-center'>
						{values.length > 0 ? (
							values
								.sort((a, b) => {
									if (a.network === "MTN") return -1;
									if (b.network === "MTN") return 1;
									if (a.network === "9MOBILE") return 1;
									if (b.network === "9MOBILE") return -1;
									return a.network.localeCompare(b.network);
								})
								.map((item, index) => {
									return (
										<div className='ml-2 mr-2 pb-3 lg:pb-0' key={index}>
											<div className='flex justify-center items-center my-2'>
												<Image name={item.network} />
											</div>
											<div>
												<section className='bg-green-600 p-2 text-center mb-2'>
													<>
														<h1 className='text-white uppercase text-sm mb-1'>
															successful count
														</h1>
														<h1 className='font-bold text-xl'>
															{item.successful}
														</h1>
													</>
												</section>
												<section className='bg-[#f55e43] p-2 text-center mb-2'>
													<>
														<h1 className='text-white uppercase text-sm mb-1'>
															failure count
														</h1>
														<h1 className='font-bold text-xl'>{item.failed}</h1>
													</>
												</section>
												<section className='bg-yellow-600 text-center mb-2'>
													<>
														<h1 className='text-white uppercase text-sm mb-1'>
															pending count
														</h1>
														<h1 className='font-bold text-xl'>
															{item.pending}
														</h1>
													</>
												</section>
												<section className=' text-center  bg-orange-500  text-white'>
													<p className='mb-[0.5px]'>
														Success ({item.successPercentage}%){" "}
													</p>
													<p className='mb-[0.5px]'>
														Failed ({item.failedPercentage}%){" "}
													</p>
													<p className='mb-[0.5px]'>
														Pending ({item.pendingPercentage}%){" "}
													</p>
												</section>
											</div>
										</div>
									);
								})
						) : (
							<>
								<div className='flex justify-center items-center h-screen'>
									<h1 className='font-bold bg-white rounded-md border border-gray-300 h-20 p-10'>
										An Error Occured
									</h1>
								</div>
							</>
						)}
					</div>
					<div className='lg:flex block  justify-between items-center'>
						<div className='flex flex-col justify-center items-center p-4'>
							<h1 className='text-center'>Airtime Summary</h1>
							<div className='flex flex-col flex-1  '>
								<section>
									<h4 className='mr-2'>Total : {fixTotal[0].totalCount} </h4>
								</section>
								<section>
									<h4 className='mr-2'>
										Success Rate : {fixTotal[0].percentageSuccessful}%
									</h4>
								</section>
								<section>
									<h4 className='mr-2'>
										Failure Rate : {fixTotal[0].percentageFailed}%
									</h4>
								</section>
								<section>
									<h4 className='mr-2'>
										Pending Rate : {fixTotal[0].percentagePending}%
									</h4>
								</section>
							</div>
						</div>
						<div className='flex-1'>
							<Graph
								pending={items[0].pending}
								success={items[0].successful}
								failed={items[0].failed}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
