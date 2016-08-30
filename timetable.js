/*global require, Promise, process, console, module */
/*jslint white: true, for:true, this:true */
var request = require("request");
var cheerio = require("cheerio");
var moment = require("moment");
var Subject = require("./subject");

var Timetable = function (urls, subjects) {
    "use strict";
    var timetable = {};
    timetable.urls = urls;
    timetable.subjects = subjects;
    timetable.data = {};
    timetable.promises = {};

    timetable.init = function () {

        timetable.promises = timetable.urls.map(function(url) {
            return timetable.getHtttp(url);
        });
        
    };

    timetable.contains = function (subject) {
        var i;
        for (i = 0; i < subjects.length; i += 1) {
            if (subject.slice(0, 3) === subjects[i].slice(0, 3)) {
                return true;
            }
        }

        return false;
    };

    timetable.merge = function (data) {
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
    };

    timetable.getHtttp = function (url) {

        return new Promise(function(resolve, reject) {
            request(url, function(error, response, html) {
                if (error) {
                    console.log("Error: " + error);
                    console.log("Response: " + response);
                    reject(error);
                }
                resolve(html);
            });
        });
    };

    timetable.parse = function(html) {

        var data = {};
        var $ = cheerio.load(html);

        var table = $("table");
        var dates = table.find(".date");

        dates.each(function() {
            var line = $(this).text().trim();

            if (line.length > 1 && timetable.contains(line)) {
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
        
        return data;
    };

    timetable.getData = function () {

        return Promise.all(timetable.promises).then(function(htmls) {
            var data = htmls.map(function (html) {
               return timetable.parse(html); 
            });
            timetable.data = timetable.merge(data);

            return Promise.resolve(timetable.data);
        });

    };

    timetable.print = function (items) {
        if (typeof items === "object") {
            var i;
            for (i = 0; i < items.length; i += 1) {
                items[i].prettyPrint();
            }
        } else {
            console.log(items);
        }
    };

    timetable.today = function () {

        var today = moment().format("DD-MM-YYYY");

        if (timetable.data[today] !== undefined) { 
            return timetable.data[today];
        }

        return "No class today! Hurraay ^-^";

    };

    timetable.tomorrow = function () {

        var tomorrow = moment().add(1, 'days').format("DD-MM-YYYY");

        if (timetable.data[tomorrow] !== undefined) { 
            return timetable.data[tomorrow];
        }

        return "No class tomorrow! Hurraay ^-^";

    };

    timetable.duration = function (start, end) {

        var i;
        var index;
        var result = [];

        if (!start.isValid() || !end.isValid()) {
            return Promise.resolve("The date format should be DD-MM-YYYY (ex. 31-01-2016)");    
        }

        for (i = start; i.isBefore(end); i.add(1, "days")) {
            index = i.format("DD-MM-YYYY");
            if (timetable.data[index] !== undefined) {
                timetable.data[index].forEach(function (item) {
                    result.push(item);
                });
            }
        }

        return result;
    };

    timetable.process = function (args) {

        if (args.length < 3) {
            timetable.getData().then(function (res) {
                console.log(res);
            });
        } else {
            if (args[2] === "help") {
                console.log("Usage: node app.js [today, week, from <DD-MM-YYYY> to <DD-MM-YYYY>]");
            }

            if (args[2] === "today") {
                timetable.getData().then(function () {
                    timetable.print(timetable.today());
                });
            }

            if (args[2] === "tomorrow") {
                timetable.getData().then(function () {
                    timetable.print(timetable.tomorrow());
                });
            }

            if (args[2] === "week") {
                var start = moment().startOf("isoWeek");
                var end = moment().endOf("isoWeek");

                timetable.getData().then(function () {
                    timetable.print(timetable.duration(start, end));
                });
            }

            if (args[2] === "next" && args[3] === "week") {
                var start = moment(moment().endOf("isoWeek")).add(1, "days").startOf("isoWeek");
                var end = moment(moment().endOf("isoWeek")).add(1, "days").endOf("isoWeek");

                timetable.getData().then(function () {
                    timetable.print(timetable.duration(start, end));
                });
            }

            if (args[2] === "from" && args[4] === "to") {
                var start = moment(args[3], "DD-MM-YYYY");
                var end = moment(args[5], "DD-MM-YYYY");

                timetable.getData().then(function () {
                    timetable.print(timetable.duration(start, end));
                });
            }
        }
    };

    return timetable;
};

module.exports = Timetable;
