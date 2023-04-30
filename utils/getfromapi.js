"use strict";
module.exports = {
	getMeme,
	getUser,
};

async function getMeme(id) {
	const response = await fetch(`https://appv2.memedroid.com/item/get_items_by_id?item_IDs=[${id}]`);
	return response.json()
}

async function getUser(username) {
	const response = await fetch(`https://appv2.memedroid.com/user_profile/get_user_profile`,
		{
			method: 'POST',body: new URLSearchParams(
				{
					"username": username,
					"include_stats": 0
				}
			),
		}
	);
	return response.json()
}