export function mergeLogTimes(data) {
	const mergedData = {};

	// Iterate through the data array

	data.forEach((item) => {
		const messageId = item.ssml_smpp_message_id;

		if (!mergedData[messageId]) {
			mergedData[messageId] = { ...item };
		} else {
			if (item.ssml_result === "0") {
				console.log("first");
				const content = item.ssml_content;
				// If the result is '0', merge the pk_ssml_log_time
				mergedData[messageId].pk_ssml_log_time += ` ${item.pk_ssml_log_time}`;
				mergedData[messageId].ssml_calling_number = content;
			} else {
				// If the result is not '0', update other properties as needed
				// You can customize this part based on your requirements
				const items = mergedData[messageId].ssml_calling_number;
				const data = item.ssml_calling_number;
				const content = item.ssml_content;
				// const id = item.ssml_smpp_message_id;
				mergedData[messageId].pk_ssml_log_time += ` ${item.pk_ssml_log_time}`;
				mergedData[messageId].ssml_result = item.ssml_result;
				mergedData[messageId].ssml_called_number = items;
				mergedData[messageId].ssml_calling_number = data;
				mergedData[messageId].ssml_calling_number = content;
				// mergedData[messageId].ssml_smpp_message_id = messageId;

				// Add more properties here
			}
		}
	});

	// Convert the mergedData object back to an array
	const mergedArray = Object.values(mergedData);

	return mergedArray;
}
