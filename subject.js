/*global console, module */

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

module.exports = Subject;