
# baa-timetable [![Build Status](https://travis-ci.org/matq007/baa-timetable.svg?branch=master)](https://travis-ci.org/matq007/baa-timetable) [![Code Climate](https://codeclimate.com/github/matq007/baa-timetable/badges/gpa.svg)](https://codeclimate.com/github/matq007/baa-timetable) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/4d774464981a42ec892fb4bcb6b94de8)](https://www.codacy.com/app/mproksik/baa-timetable?utm_source=github.com&utm_medium=referral&utm_content=matq007/baa-timetable&utm_campaign=badger)

Scrapper for skemasys timetable at BAAA. First update all urls you want to scrap in app.js. Next update subject names (copy-paste the names).
After this you are good to go.

## Requirements

* NodeJS

## Installation

```
npm install
```

## Run script

```
node app.js
```

## More commands
```
node app.js yesterday
node app.js today
node app.js tomorrow
node app.js this week
node app.js next week
node app.js from <DD-MM-YYYY> to <DD-MM-YYYY>
node app.js help
```

## Run test
```
npm test
```
