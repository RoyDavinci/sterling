import React, { useEffect, useState } from "react";
import { Image } from "./Image";
import { Lined } from "./Lined";

export const Delivery = ({ datum, paragraph, computeData }) => {
	const [updatedData, setUpdatedData] = useState([]);

	useEffect(() => {
		if (computeData.length === 8) {
			const filteredArray = computeData.filter(
				(item, index) => index % 2 === 0
			);
			setUpdatedData(filteredArray);
		} else if (computeData.length === 6) {
			// Define the indices to filter out (1, 2, 4, and 5)
			const indicesToFilter = [1, 2, 4, 5];

			// Use the filter method to filter out computeData at specific indices
			const filteredArray = computeData.filter(
				(item, index) => !indicesToFilter.includes(index)
			);
			setUpdatedData(filteredArray);
		} else {
			setUpdatedData(computeData);
		}
	}, [computeData, paragraph]);
	// console.log(paragraph, otp);
	return (
		<div>
			<div>
				<div className='grid lg:grid-cols-6 grid-cols-1 lg:gap-0 gap-10 items-center border border-solid border-gray-400'>
					<div className=''>
						<p className='my-0 text-gray-400 bg-gray-200 h-8 p-2 border border-solid border-gray-400'></p>
						<p className='my-0 h-10 p-2 border border-solid text-sm border-gray-400'>
							Delivered
						</p>
						<p className='my-0 h-10 p-2 border border-solid text-sm border-gray-400'>
							Undelivered
						</p>
						<p className='my-0 h-10 p-2 border border-solid text-sm border-gray-400'>
							Expired
						</p>
						<p className='my-0 h-10 p-2 border border-solid text-sm border-gray-400'>
							Rejected
						</p>
						<p className='my-0 h-10 p-2 border border-solid text-sm border-gray-400'>
							Pending
						</p>
					</div>

					{updatedData.map((item, index) => {
						let total =
							Number(item.delivered) +
							Number(item.expired) +
							Number(item.undelivered) +
							Number(item.pending) +
							Number(item.issues);

						let sms =
							Number(item.ack) +
							Number(item.issues) +
							Number(item.pending) +
							Number(item.expired);

						let pending = 0;
						pending += Number(item.pending);
						// console.log(sms, total);

						total += pending;

						return (
							<div key={item.name} className=' '>
								<div className='font-bold text-sm h-8 p-2 border border-solid border-gray-400 flex items-center bg-gray-200'>
									<Image name={item.name} />
									<span className='ml-2'>{item.name}</span>
								</div>
								<div className='bg-green-700 border text-sm h-10 p-2 text-white'>
									{item.delivered} (
									{isNaN(((Number(item.delivered) / total) * 100).toFixed(2))
										? `0`
										: ((Number(item.delivered) / total) * 100).toFixed(2)}
									%)
								</div>
								<div className='bg-blue-500 border text-sm h-10 p-2  text-white'>
									{item.undelivered} (
									{isNaN(((Number(item.undelivered) / total) * 100).toFixed(2))
										? `0`
										: ((Number(item.undelivered) / total) * 100).toFixed(2)}
									%)
								</div>
								<div className='bg-yellow-500 border text-sm h-10 p-2 text-white'>
									{item.expired} (
									{isNaN(((Number(item.expired) / total) * 100).toFixed(2))
										? `0`
										: ((Number(item.expired) / total) * 100).toFixed(2)}
									%)
								</div>
								<div className='bg-red-500 border text-sm h-10 p-2 text-white'>
									{item.rejected} (
									{isNaN(((Number(item.rejected) / total) * 100).toFixed(2))
										? `0`
										: ((Number(item.rejected) / total) * 100).toFixed(2)}
									%)
								</div>
								<div className='bg-[#654321CC] border text-sm h-10 p-2 text-white'>
									{pending} (
									{isNaN(((Number(pending) / total) * 100).toFixed(2))
										? `0`
										: ((Number(pending) / total) * 100).toFixed(2)}
									%)
								</div>
							</div>
						);
					})}
					{/* <div>
						<div className='font-bold text-sm h-8 p-2 border border-solid border-gray-400 flex items-center bg-gray-200'>
							<span className='ml-2'>International SMS</span>
						</div>
						<div className='bg-green-700 border text-sm h-10 p-2 text-white'>
							{datum.delivered} (
							{isNaN(
								((Number(datum.delivered) / datum.total_count) * 100).toFixed(2)
							)
								? `0`
								: ((Number(datum.delivered) / datum.total_count) * 100).toFixed(
										2
								  )}
							%)
						</div>
						<div className='bg-blue-500 border text-sm h-10 p-2  text-white'>
							{datum.undelivered} (
							{isNaN(
								((Number(datum.undelivered) / datum.total_count) * 100).toFixed(
									2
								)
							)
								? `0`
								: (
										(Number(datum.undelivered) / datum.total_count) *
										100
								  ).toFixed(2)}
							%)
						</div>
						<div className='bg-yellow-500 border text-sm h-10 p-2 text-white'>
							{datum.expired} (
							{isNaN(
								((Number(datum.expired) / datum.total_count) * 100).toFixed(2)
							)
								? `0`
								: ((Number(datum.expired) / datum.total_count) * 100).toFixed(
										2
								  )}
							%)
						</div>
						<div className='bg-red-500 border text-sm h-10 p-2 text-white'>
							{datum.rejected} (
							{isNaN(
								((Number(datum.rejected) / datum.total_count) * 100).toFixed(2)
							)
								? `0`
								: ((Number(datum.rejected) / datum.total_count) * 100).toFixed(
										2
								  )}
							%)
						</div>
						<div className='bg-[#654321CC] border text-sm h-10 p-2 text-white'>
							{datum.pending} (
							{isNaN(
								((Number(datum.pending) / datum.total_count) * 100).toFixed(2)
							)
								? `0`
								: ((Number(datum.pending) / datum.total_count) * 100).toFixed(
										2
								  )}
							%)
						</div>
					</div>*/}
				</div>
				<div className='my-10'>
					<Lined check={updatedData} />
				</div>
			</div>
		</div>
	);
};
