/*global require, Promise, process, console */
/*jslint white: true, for:true, this:true */
var Timetable = require("./timetable");

var urls = [
    "https://skemasys.akademiaarhus.dk/index.php?educationId=13&menuId=1&account=timetable_class&classId=1762",
    "https://skemasys.akademiaarhus.dk/index.php?educationId=11&menuId=1&account=timetable_class&classId=1771"
];

var subjects = [
    "iOS (IT-Sikkerhed A1.19B)",
    "Large Systems",
    "Frameworks"
];

var args = process.argv;
var t = new Timetable(urls, subjects);
t.init();
t.process(args);
