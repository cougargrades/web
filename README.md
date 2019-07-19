# @cougargrades/web
Analyze grade distribution data for past UH courses.

## Indev ⚠
cougar-grades is in private early development and the master branch will get very dirty as a result. This means commits probably won't work if cloned and tried building because undocumented changes could've been made.

## Building: API Server (Firebase Cloud Functions + Express.js)
- `cd functions/`
- `npm install`
- `firebase serve --only functions`

## Building: Web App (Firebase Hosting + React)
- `cd app/`
- `npm install`
- `npm build`
- `firebase serve --only hosting`

## Inspiration
- anex.us/grades/ (author unknown)
- AggieScheduler (@jake-leland)
- Good-Bull-Schedules (@SaltyQuetzals)

## Development
- @au5ton
- @fluffthepanda
