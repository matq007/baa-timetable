var request = require('request');
var cheerio = require('cheerio');

var urls = [
    "https://skemasys.akademiaarhus.dk/index.php?educationId=13&menuId=1&account=timetable_class&classId=1762",
    "https://skemasys.akademiaarhus.dk/index.php?educationId=11&menuId=1&account=timetable_class&classId=1771"
];

var subjects = [
    'iOS (IT-Sikkerhed A1.19B)',
    'Large Systems',
    'Frameworks'
];

function contains(subject) {

    for (var i = 0; i < subjects.length; i+= 1) {
        if (subject.slice(0, 3) === subjects[i].slice(0, 3)) {
            return true;
        }
    }

    return false;
}

function getData(url) {

    return new Promise(function (resolve, reject) {
        request(url, function (error, response, html) {

            if (error) {
                console.log("Error: " + error);
                console.log("Response: " + response);
                reject();
            }

            var data = {};
            var $ = cheerio.load(html);

            var table = $("table");
            var dates = table.find(".date");

            dates.each(function () {

                var line = $(this).text().trim();

                if (line.length > 1 && contains(line)) {

                    var raw = $(this).attr('id').split("_");
                    var date = raw[1];
                    var time = $(this).parent().find(".leftHeader").text().trim();
                    var subject = $(this).text().trim();

                    var model = {
                        'time': time,
                        'name': subject
                    };

                    if (date in data) {
                        data[date].push(model);
                    } else {
                        data[date] = [model];
                    }
                }
            });

            resolve(data);
        });
    });

}

function merge(data) {
    var result = {};

    for (var i = 0; i < data.length; i += 1) {
        for (var key in data[i]) {
            if (result[key] !== undefined) {
                for (var item in data[i][key]) {
                    result[key].push(data[i][key][item]);
                }
            } else {
                result[key] = data[i][key];
            }
        }
    }

    return result;

}

function getTimeTable() {

    console.log("Parsing timetables");

    var promises = urls.map(function (url){
      return getData(url);
    });

    Promise.all(promises).then(function (datas){
      var result = merge(datas);
      console.log(result);
    });
}

getTimeTable();