#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
require('dotenv').config({path: path.resolve(__dirname, '..', '..', '.env')})

var HANDLE_VARS = Object.assign({}, process.env)
HANDLE_VARS.COMMIT_HASH = require('child_process').execSync('git rev-parse HEAD', {cwd: __dirname}).toString().trim().substring(0,10)

const partials = fs.readdirSync(path.resolve(__dirname, './html/partials/')) 
for(let i = 0; i < partials.length; i++) {
	if(partials[i].endsWith('.hbs')) {
		// Use filename before extension as partials name and read partial from filesystem
		console.log(`🚲🔨 => partial: ${partials[i]}`)
		Handlebars.registerPartial(path.basename(partials[i],'.hbs'), fs.readFileSync(path.resolve(__dirname, `./html/partials/${partials[i]}`), {encoding: 'utf8'}))
	}
}

const markup = fs.readdirSync(path.resolve(__dirname, './html/'))
for(let i = 0; i < markup.length; i++) {
	if(markup[i].endsWith('.hbs')) {
		let template = Handlebars.compile(fs.readFileSync(path.resolve(__dirname, `./html/${markup[i]}`), {encoding: 'utf8'}))
		console.log(`🚲🔨 => template: ${markup[i]}`)
		fs.writeFileSync(path.resolve(__dirname, `./_site/${path.basename(markup[i],'.hbs')}.html`), template(HANDLE_VARS), {encoding: 'utf8'})
	}
}
