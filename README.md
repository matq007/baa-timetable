# baa-timetable

Scrapper for timetable at BAAA skemasys. To customize links to timetable please
update the variable *urls*. To update subjects edit variable *subjects* 
in _app.js_.

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
node app.js today
node app.js tomorrow
node app.js week
node app.js next week
node app.js from <DD-MM-YYYY> to <DD-MM-YYYY>
node app.js help
```

## Run test
```
npm test
```