import React from "react";

export const Sidebar = ({ setElement, logo, logout, element }) => {
	return (
		<div>
			<div className='bg-gray-900 text-white hidden h-full  p-4 lg:flex flex-col items-center'>
				<div className='flex items-center space-x-2 mb-8 w-20 h-20'>
					<img
						src={logo}
						alt='Logo'
						className='w-20 h-20 object-fill rounded-full'
					/>
				</div>
				<ul className='space-y-2'>
					<li
						className='hover:text-blue-500 cursor-pointer'
						onClick={() => setElement("Dashboard")}
					>
						<i className='fa-solid fa-bars mx-2 w-6 h-6'></i>Dashboard
					</li>
					{/* <li
						className='hover:text-blue-500 cursor-pointer'
						onClick={() => setElement("Airtime")}
					>
						<i className='fa-solid fa-mobile-retro mx-2 w-6 h-6'></i>Airtime
					</li> */}
					{/* <li
						className='hover:text-blue-500 cursor-pointer'
						onClick={() => setElement("Data")}
					>
						<i className='fa-solid fa-network-wired mx-2 w-6 h-6'></i>Data
					</li> */}
					<li
						className='hover:text-blue-500 cursor-pointer'
						onClick={() => setElement("Transactions")}
					>
						<i className='fa-solid fa-message mx-2 w-6 h-6'></i>Messages
					</li>
					{/* <li
						className='hover:text-blue-500 cursor-pointer'
						onClick={() => setElement("International")}
					>
						<i className='fa-solid fa-message mx-2 w-6 h-6'></i>
						International
					</li> */}
					{/* <li
						className='hover:text-blue-500 cursor-pointer'
						onClick={() => setElement("Logs")}
					>
						<i className='fa-solid fa-file-export mx-2 w-6 h-6'></i>Logs
					</li> */}
					{/* <li
						className='hover:text-blue-500 cursor-pointer'
						onClick={() => setElement("Para")}
					>
						<i className='fa-solid fa-file-export mx-2 w-6 h-6'></i>LogsP
					</li> */}
					<li className='hover:text-red-500 cursor-pointer' onClick={logout}>
						<i className='fa-solid fa-power-off mx-2 w-6 h-6'></i>Logout
					</li>
				</ul>
			</div>
			<div className='lg:hidden  bg-red-600  text-white w-full p-0 absolute bottom-0 pb-20 z-10'>
				<ul className=' flex justify-between items-center p-0 m-0'>
					<li
						className={
							element === "Airtime"
								? ` p-1 text-[10px] text-center mx-2 cursor-pointer bg-white text-black`
								: ` p-1 text-[10px] text-center mx-2 cursor-pointer`
						}
						onClick={() => setElement("Airtime")}
					>
						<i className='fa-solid fa-mobile-retro mx-2 w-6 h-6'></i>
						Airtime
					</li>
					<li
						className={
							element === "Data"
								? ` p-1 text-[10px] text-center mx-2 cursor-pointer bg-white text-black`
								: ` p-1 text-[10px] text-center mx-2 cursor-pointer`
						}
						onClick={() => setElement("Data")}
					>
						<i className='fa-solid fa-network-wired mx-2 w-6 h-6'></i>Data
					</li>
					<li
						className={
							element === "Dashboard"
								? ` p-1 text-[10px] text-center mx-2 cursor-pointer bg-white text-black`
								: ` p-1 text-[10px] text-center mx-2 cursor-pointer`
						}
						onClick={() => setElement("Dashboard")}
					>
						<i className='fa-solid fa-bars mx-2 w-6 h-6 text-center'></i>
						Dashboard
					</li>
					<li
						className={
							element === "Transactions"
								? ` p-1 text-[10px] text-center mx-2 cursor-pointer bg-white text-black`
								: ` p-1 text-[10px] text-center mx-2 cursor-pointer`
						}
						onClick={() => setElement("Transactions")}
					>
						<i className='fa-solid fa-message mx-2 w-6 h-6'></i>Messages
					</li>

					<li
						className={
							element === "Messages"
								? ` p-1 text-[10px] text-center mx-2 cursor-pointer bg-white text-black`
								: ` p-1 text-[10px] text-center mx-2 cursor-pointer`
						}
						onClick={logout}
					>
						<i className='fa-solid fa-power-off mx-2 w-6 h-6'></i>Logout
					</li>
				</ul>
			</div>
		</div>
	);
};
