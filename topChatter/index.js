const readline = require('readline');
const fs = require('fs');

const readInterface = readline.createInterface({
    input: fs.createReadStream('chats.txt'),
});

let active_users = {};

readInterface.on('line', (line) => {
    let user = line.split(">:")[0].substring(1);
    if (!active_users[user]) active_users[user] = 0
    active_users[user]++;
});

readInterface.on('close', () => {
	// console.log(active_users);
	const hashToArray = Object.entries(active_users);
	const sortedArray = hashToArray.sort((a,b) => b[1] - a[1]);
	console.log(sortedArray.slice(0, 3))
})
