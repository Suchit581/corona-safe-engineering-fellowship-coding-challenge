const fs = require('fs');

// !validation function for input
// ?start
function string_validation(string_item) {
	return typeof string_item === 'string' ? true : false;
}
function number_validation(number_item) {
	return !isNaN(number_item) ? true : false;
}
// ?end

// !read file
// ?start
function read_todo_file() {
	return (data = fs.readFileSync('todo.txt', 'utf8'));
}
function read_done_file() {
	return (data = fs.readFileSync('done.txt', 'utf8'));
}
// ?end

// !function to append file
// ?start
function append_todo_file(data) {
	fs.appendFileSync('todo.txt', data);
}
function append_done_file(data) {
	fs.appendFileSync('done.txt', data);
}
// ?end

// !function to write file
// ?start
function write_todo_file(data) {
	fs.writeFileSync('todo.txt', data);
}
// ?end

// !validation function for input
// ?start
function string_validation(string_item) {
	return typeof string_item === 'string' ? true : false;
}
function number_validation(number_item) {
	return !isNaN(number_item) ? true : false;
}
// ?end

//! usage to print function
let usage = `Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`;

// !Operation's Function for todo
// ?start

// !operation add
/**
 *
 * @param {string} todo_item
 */
function add(todo_item) {
	if (string_validation(todo_item)) {
		append_todo_file(`\n${todo_item}`);
		console.log(`Added todo: "${todo_item}"`);
	} else {
		help();
	}
}

// !operation list
function ls() {
	let i = 1;
	let todo = read_todo_file();
	if (todo == 0) {
		console.log('There are no pending todos!');
		return;
	}
	todo = todo.split('\n');
	if (todo.length <= 0) {
		console.log('There are no pending todos!');
	} else {
		todo = todo.map(function (item, index) {
			return (item = `[${i++}] ${item}`);
		});
		console.log(todo.reverse().join('\n'));
	}
}

// !operation delete
/**
 *
 * @param {number} todo_number
 */
function del(todo_number) {
	if (number_validation(todo_number)) {
		let todo = read_todo_file();
		if (todo_number == 0) {
			console.log(`Error: todo #${todo_number} does not exist.`);
			return;
		}
		todo = todo.split('\n');
		todo.pop();
		todo = todo.reverse();
		if (todo_number > todo.length) {
			console.log(`Error: todo #${todo_number} does not exist.`);
		} else {
			let remove = todo[todo.length - todo_number];
			todo = todo.filter(function (todo) {
				return todo != remove;
			});
			write_todo_file(todo.reverse().join('\n'));
			console.log(`Deleted todo #${todo_number} `);
		}
	} else {
		help();
	}
}

// !operation done
/**
 *
 * @param {number} todo_number
 */
function done(todo_number) {
	if (number_validation(todo_number)) {
		let todo = read_todo_file();
		todo = todo.split('\n');
		todo.pop();
		todo = todo.reverse();
		if (todo_number == 0) {
			console.log(
				`Error: todo #${todo_number} does not exist. Nothing deleted.`
			);
			return;
		}
		if (todo_number > todo.length) {
			console.log(
				`Error: todo #${todo_number} does not exist. Nothing deleted.`
			);
		} else {
			let date = new Date();
			date = date.toISOString().slice(0, 10);
			let remove = todo[todo.length - todo_number];
			todo = todo.filter(function (todo) {
				return todo != remove;
			});
			let done_txt = `${todo_number} ${date} ${remove}\n`;
			write_todo_file(todo.reverse().join('\n'));
			append_done_file(done_txt);
			console.log(`Marked todo #${todo_number} as done.`);
		}
	} else {
		help();
	}
}

// !operation help
function help() {
	console.log(usage);
}

// !operation report
function report() {
	let todo = read_todo_file();
	let done = read_done_file();

	todo = todo.split('\n');
	done = done.split('\n');
	console.log(todo);
	console.log(done);
	done.pop();
	let pending = todo.length;
	let completed = done.length;
	let date = new Date();
	console.log(
		`${date
			.toISOString()
			.slice(0, 10)} Pending : ${pending} Completed : ${completed}`
	);
}
// ?end

/**
 * !main code start here
 */

let command = process.argv[2];
let input = process.argv[3];

// *condition to check whether the command is correct or not
if (command === undefined && input === undefined) {
	help();
}
// *condition to check command with input with switch case
if (command !== undefined) {
	switch (command) {
		case 'add':
			if (input === undefined) {
				console.log('Error: Missing todo string. Nothing added!');
				break;
			} else {
				add(input);
				break;
			}
		case 'ls':
			// checking for the invalid command
			if (input === undefined) {
				ls();
				break;
			}
		case 'del':
			if (input !== undefined) {
				del(input);
				break;
			} else {
				console.log('Error: Missing NUMBER for deleting todo.');
				break;
			}
		case 'done':
			if (input !== undefined) {
				done(input);
				break;
			} else {
				console.log('Error: Missing NUMBER for marking todo as done.');
				break;
			}
		case 'help':
			// checking for the invalid command
			if (input === undefined) {
				help();
				break;
			}
		case 'report':
			// checking for the invalid command
			if (input === undefined) {
				report();
				break;
			}
		default:
			console.log('Enter the valid command form the given below list ');
			help();
			break;
	}
}
