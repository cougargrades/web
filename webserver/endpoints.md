### Terminology
`term` => identifier of a semester, Ex: `201701` => Spring 2017, `201803` => Fall 2018

`dept` => identifier of a department that has classes for its code, Ex: `COSC`

`course` => identifier of a particular class, Ex: `1430`

`section` => idenitfier of a particular section in a semester, Ex: `7`



- `/api`
	- `/catalog`
		- `/terms` => list available terms
			- returns a json array
			- element: [201701, 201702, 201703, 201801]
		- `/depts` => list available deptartments
			- returns a json array
		- `/courses/:term/:dept` => list avaiable courses for a term from a department
			- `:term` can be all
			- returns a json array
		- `/sections/:term/:dept/:course` => list all sections for a term from a dept for a course
			- `:term` can be all
			- returns a json array
	- `/table`
		- `/:term/:dept/:course` => table data of all sections for a term from a dept for a course
			- `:term` can be all
			- returns array of table data
	