var CSVParser = (function () {
    function CSVParser() {
    }
    CSVParser.prototype.parseCsv = function (fileName, callback) {
        console.log("parseCsv triggered");
        var Converter = require("csvtojson").Converter;
        var fs = require("fs");
        var csvFileName = fileName;
        //new converter instance
        var csvConverter = new Converter();
        //end_parsed will be emitted once parsing finished
        csvConverter.on("end_parsed", function (jsonObj) {
            callback(jsonObj);
        });
        //read from file
        fs.createReadStream(csvFileName).pipe(csvConverter);
    };
    return CSVParser;
})();
exports.CSVParser = CSVParser;
//# sourceMappingURL=CsvParser.js.map