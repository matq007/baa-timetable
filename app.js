/*global require, Promise, process, console */
/*jslint white: true, for:true, this:true */
var request = require("request");
var cheerio = require("cheerio");
var moment = require("moment");

var urls = [
    "https://skemasys.akademiaarhus.dk/index.php?educationId=13&menuId=1&account=timetable_class&classId=1762",
    "https://skemasys.akademiaarhus.dk/index.php?educationId=11&menuId=1&account=timetable_class&classId=1771"
];

var subjects = [
    "iOS (IT-Sikkerhed A1.19B)",
    "Large Systems",
    "Frameworks"
];

var Subject = function(date, time, name) {
    "use strict";
    var subject = {};
    subject.date = date;
    subject.time = time;
    subject.name = name;

    subject.prettyPrintToday = function() {
        console.log(subject.time + ": " + subject.name);
    };

    subject.prettyPrint = function() {
        console.log(subject.date + " " + subject.time + ": " + subject.name);
    };

    return subject;
};

function printTimetable(start, end, timetable) {
    "use strict";
    var i;
    var j;
    var index = 0;
    for (i = start; i.isBefore(end); i.add(1, "days")) {
        index = i.format("DD-MM-YYYY");
        if (timetable[index] !== undefined) {
            for (j = 0; j < timetable[index].length; j += 1) {
                timetable[index][j].prettyPrint();
            }
        }
    }
}

function contains(subject) {
    "use strict";
    var i;
    for (i = 0; i < subjects.length; i += 1) {
        if (subject.slice(0, 3) === subjects[i].slice(0, 3)) {
            return true;
        }
    }

    return false;
}

function getData(url) {
    "use strict";
    return new Promise(function(resolve, reject) {
        request(url, function(error, response, html) {
            if (error) {
                console.log("Error: " + error);
                console.log("Response: " + response);
                reject();
            }

            var data = {};
            var $ = cheerio.load(html);

            var table = $("table");
            var dates = table.find(".date");

            dates.each(function() {
                var line = $(this).text().trim();

                if (line.length > 1 && contains(line)) {
                    var raw = $(this).attr("id").split("_");
                    var date = raw[1];
                    var time = $(this).parent().find(".leftHeader").text().trim();
                    var subject = $(this).text().trim();

                    var s = new Subject(date, time, subject);

                    if (data[date] !== undefined) {
                        data[date].push(s);
                    } else {
                        data[date] = [s];
                    }
                }
            });

            resolve(data);
        });
    });
}

function merge(data) {
    "use strict";
    var result = {};
    var i = 0;
    var key;
    var item;
    for (i = 0; i < data.length; i += 1) {
        for (key in data[i]) {
            if (result[key] !== undefined) {
                for (item in data[i][key]) {
                    result[key].push(data[i][key][item]);
                }
            } else {
                result[key] = data[i][key];
            }
        }
    }

    return result;

}


function getTimeTable(args) {
    "use strict";

    var promises = urls.map(function(url) {
        return getData(url);
    });

    Promise.all(promises).then(function(datas) {
        var timetable = merge(datas);

        if (args.length < 3) {
            console.log(timetable);
        } else {
            if (args[2] === "help") {
                console.log("Usage: node app.js [today, week, from <DD-MM-YYYY> to <DD-MM-YYYY>]");
            }

            if (args[2] === "today") {
                var today = moment().format("DD-MM-YYYY");

                if (timetable[today] !== undefined) {
                    timetable[today].forEach(function(item) {
                        item.prettyPrintToday();
                    });
                } else {
                    console.log("No class today! Hurraay ^-^");
                }
            }

            if (args[2] === "week") {
                var start = moment().startOf("isoWeek");
                var end = moment().endOf("isoWeek");

                printTimetable(start, end, timetable);
            }

            if (args[2] === "from" && args[4] === "to") {
                var _start = moment(args[3], "DD-MM-YYYY");
                var _end = moment(args[5], "DD-MM-YYYY");

                if (_start.isValid() && _end.isValid()) {
                    printTimetable(_start, _end, timetable);
                } else {
                    console.log("From or to is not a valid date. Please use format DD-MM-YYYY ex. " + moment().format("DD-MM-YYYY"));
                }
            }
        }
    });
}

var args = process.argv;
getTimeTable(args);