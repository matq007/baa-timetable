/*global require, Promise, process, console */
var expect = require("chai").expect;
var moment = require("moment");
var Timetable = require("../timetable");
var Subject = require("../subject");

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

describe("Timetable", function() {
    
    it("Contains: should return true", function() {
        var s = new Subject("30-08-2016", "08:30", "Large Systems");
        expect(t.contains(s.name)).to.be.true;
    });

    it("Contains: should return false", function() {
        var s = new Subject("30-08-2016", "08:30", "Tests");
        expect(t.contains(s.name)).to.be.false;
    });

    it("Merge: should return empty list", function() {
        var a = [{},{}];
        expect(t.merge(a)).to.be.empty;
    });

    it("GetHttp: should get all data", function() {
        t.getData().then(function () {
            expect(typeof t.data).to.have.length.above(2);
        });
    });

    it("Parse: should have property 25-08-2016", function() {
        t.getHtttp(urls[0]).then(function (html) {
            expect(t.parse(html)).to.have.property('25-08-2016').that.is.an('string');
        });
    });

    it("GetData: should have properties: 25-08-2016/26-08-2016/30-08-2016", function() {
        t.getHtttp(urls[0]).then(function (html) {
            expect(t.parse(html)).to.contain.any.keys('25-08-2016', '26-08-2016', '30-08-2016');
        });
    });

});