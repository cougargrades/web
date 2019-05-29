#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
require('dotenv').config({path: path.resolve(process.cwd(), '..', '..', '.env')})

const partials = fs.readdirSync('./mustache/partials/')
for(let i = 0; i < partials.length; i++) {
	if(partials[i].endsWith('.mustache')) {
		// Use filename before extension as partials name and read partial from filesystem
		console.log(`partial: ${partials[i]}`)
		Handlebars.registerPartial(path.basename(partials[i],'.mustache'), fs.readFileSync(`./mustache/partials/${partials[i]}`, {encoding: 'utf8'}))
	}
}

const markup = fs.readdirSync('./mustache/')
for(let i = 0; i < markup.length; i++) {
	if(markup[i].endsWith('.mustache')) {
		let template = Handlebars.compile(fs.readFileSync(`./mustache/${markup[i]}`, {encoding: 'utf8'}))
		console.log(`template: ${markup[i]}`)
		fs.writeFileSync(`./_site/${path.basename(markup[i],'.mustache')}.html`, template(process.env), {encoding: 'utf8'})
	}
}
