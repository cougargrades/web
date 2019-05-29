#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
require('dotenv').config({path: path.resolve(process.cwd(), '..', '..', '.env')})

const partials = fs.readdirSync('./html/partials/')
for(let i = 0; i < partials.length; i++) {
	if(partials[i].endsWith('.hbs')) {
		// Use filename before extension as partials name and read partial from filesystem
		console.log(`partial: ${partials[i]}`)
		Handlebars.registerPartial(path.basename(partials[i],'.hbs'), fs.readFileSync(`./html/partials/${partials[i]}`, {encoding: 'utf8'}))
	}
}

const markup = fs.readdirSync('./html/')
for(let i = 0; i < markup.length; i++) {
	if(markup[i].endsWith('.hbs')) {
		let template = Handlebars.compile(fs.readFileSync(`./html/${markup[i]}`, {encoding: 'utf8'}))
		console.log(`template: ${markup[i]}`)
		fs.writeFileSync(`./_site/${path.basename(markup[i],'.hbs')}.html`, template(process.env), {encoding: 'utf8'})
	}
}
