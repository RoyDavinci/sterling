import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Image from "./assets/Sterling-Bank-Brandessence2-1024x724.png";
import axios from "axios";

import { Login } from "./components/Login";
import { Sidebar } from "./components/Sidebar";
import { Transactions } from "./components/Transactions";
import { Airtime } from "./components/Airtime";
import { Data } from "./components/Data";
import { Design } from "./components/Design";
// import { Paginate } from "./components/Paginate";
// import MaintenanceMode from "./components/Maintenance";
import { Logs } from "./components/Logs";
import { International } from "./components/International";
// import { Para } from "./components/Para";

function App() {
	const [items, setItems] = useState([]);
	const [otpItems, setOtpItems] = useState([]);
	const [internationalData, setInternationalData] = useState({});
	const [showSideBar, setShowSidebar] = useState(false);
	// const [maintenance, setMaintenance] = useState(true);

	const [isLoading, setIsLoading] = useState(false);
	const [loginState, setLoginState] = useState(false);
	const [element, setElement] = useState("Dashboard");

	const logout = () => {
		localStorage.clear();
		setLoginState(true);
	};

	// const getInternational = async () => {
	// 	try {
	// 		const { data } = await axios.get(
	// 			"https://messaging.approot.ng/dashboard.php"
	// 		);

	// 		setInternationalData(data);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	const getItems = useCallback(async () => {
		const checkLocalStorage = localStorage.getItem("token");
		console.log(checkLocalStorage);

		if (checkLocalStorage) {
			setLoginState(false);
			setIsLoading(true);

			try {
				// Set loading to true while fetching data
				const { data } = await axios.get(
					"https://sterlingsms.approot.ng/normal.php"
				);
				// countData(data);
				console.log(data);

				setItems(data);
				setIsLoading(false); // Set loading back to false after data is fetched
			} catch (error) {
				setIsLoading(false); // Set loading to false in case of an error
			}
		} else {
			setLoginState(true);
		}
	}, []);

	useEffect(() => {
		// Call getItems initially when the component mounts
		getItems();
		// getInternational();
		// getOtpItems();

		// Set up an interval to call getItems every five seconds
		const interval = setInterval(() => {
			getItems();
			// getInternational();
			// getOtpItems();
		}, 200000);

		// Clean up the interval when the component unmounts
		return () => {
			clearInterval(interval);
		};
	}, [getItems]);

	return (
		<>
			{/* {maintenance ? (
				<MaintenanceMode />
			) : ( */}
			<>
				{loginState ? (
					<Login setLoginState={setLoginState} />
				) : (
					<div className='flex h-screen '>
						{showSideBar ? (
							""
						) : (
							<Sidebar
								setElement={setElement}
								element={element}
								logo={Image}
								logout={logout}
							/>
						)}
						<main className='flex-1 flex relative z-0 flex-col overflow-auto p-4'>
							{/* Header */}

							{/* Content */}
							{element === "Dashboard" && (
								<Design
									items={items}
									loading={isLoading}
									datum={internationalData}
									otpItems={otpItems}
								/>
							)}
							{element === "Transactions" && (
								<>
									{" "}
									<Transactions />
								</>
							)}
							{element === "Airtime" && <Airtime />}
							{element === "Data" && <Data />}
							{element === "Design" && <Design />}
							{element === "International" && <International />}
							{element === "Logs" && <Logs />}

							{/* {element === "Para" && <Para />} */}
						</main>
					</div>
				)}
			</>
			{/* )} */}
		</>
	);
}

export default App;

// $data = [
//     // Your array data here
// ];

// Define the values you want to check (1 and 8)

// $resultArray now contains the modified array with 1 and 8 values appended as needed
