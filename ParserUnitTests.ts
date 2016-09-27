

import assert = require('assert');
import csv = require('./CsvParser'); 
//var CSVParser; 


export function testCsvParser_nonNull() {

    var parserInstance = new csv.CSVParser();
    var res = false;
    parserInstance.parseCsv("./TestCsv.csv", function (json: any) {
        res = (json != null); 
        assert.ok(res, "This shouldn't fail");
    });

}

export function testCsvParser_Length() {
    
    var parserInstance = new csv.CSVParser();
    var res = false;
    parserInstance.parseCsv("./TestCsv.csv", function (json: any) {
        res = (json.length == 4);
        assert.ok(res, "This shouldn't fail");
    });
       
}

export function testCsvParser_firstValues() {

    var parserInstance = new csv.CSVParser();
    var one = false;
    var two = false;
    var three = false;
    var res = false;
    parserInstance.parseCsv("./TestCsv.csv", function (json: any) {
        one = (json[0].FireName == "North Kilnaklint River");
        two = (json[0].XPosition == 174);
        three = (json[0].YPosition == 321);
        res = (one && two && three);
        assert.ok(res, "This shouldn't fail");
    });
}

export function testCsvParser_lastValues() {

    var parserInstance = new csv.CSVParser();
    var one = false;
    var two = false;
    var three = false;
    var res = false; 
    parserInstance.parseCsv("./TestCsv.csv", function (json: any) {
        one = (json[json.length - 1].FireName == "Memekay");
        two = (json[json.length - 1].XPosition == 156); 
        three = (json[json.length - 1].YPosition == 559);
        res = (one && two && three); 
        assert.ok(res, "This shouldn't fail");
    });
}


export function testCsvParser_intermediateValues() {

    var parserInstance = new csv.CSVParser();
    var one = false;
    var two = false;
    var three = false;
    var four = false;
    var five = false;
    var six = false;
    var res = false;
    parserInstance.parseCsv("./TestCsv.csv", function (json: any) {
        one = (json[json.length - 3].FireName == "Christenson Rd - Anahim Lake");
        two = (json[json.length - 3].XPosition == 200);
        three = (json[json.length - 3].YPosition == 228);
        four = (json[json.length - 2].FireName == "7km N of Tetachuck River");
        five = (json[json.length - 2].XPosition == 169);
        six = (json[json.length - 2].YPosition == 92);
        console.log(one + " " + two + " " + three + " " + four + " " + five + " " + six); 
        res = (one && two && three && four && five && six);
        assert.ok(res, "This shouldn't fail");
    });
}


