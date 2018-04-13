
function convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
}

const googleTrends = require('google-trends-api');

var startDate = new Date("2017-01-01");
var endDate = new Date("2017-12-31");



document.getElementById("getTrendbtn").addEventListener("click", function(){
    var textarea = document.getElementById('keywords');

    if(!textarea.value) {
        alert('please input keywords');
        textarea.focus();
    } else {
        var split = textarea.value.replace(/\r\n/g,"\n").split("\n");
        var keywords = [];
        for(var c=0; c<split.length; c++) { if(split[c] && keywords.indexOf(split[c]) == -1) { keywords.push(split[c]); } }

        var csvData = [];

        googleTrends.interestOverTime({keyword: keywords, startTime: startDate, endTime: endDate})
        .then(function(results){
            var obj = JSON.parse(results);
            var datas = obj.default.timelineData;

            //console.log(datas);

            for(var x=0; x<keywords.length; x++) {
                var d = {};
                d['keyword'] = keywords[x];
                for(var y=0; y<datas.length; y++) {
                    var tdata = datas[y];
                    d[tdata.formattedTime] = tdata.formattedValue[x];
                }
                csvData.push(d);
            }

            var csv = convertArrayOfObjectsToCSV({
                data: csvData
            });

            if (csv) {
                filename = 'trends_export.csv';

                if (!csv.match(/^data:text\/csv/i)) {
                    csv = 'data:text/csv;charset=utf-8,' + csv;
                }
                data = encodeURI(csv);

                link = document.createElement('a');
                link.setAttribute('href', data);
                link.setAttribute('download', filename);
                link.click();
            }
        })
        .catch(function(err){
          console.error('Oh no there was an error', err);
        });
    }
});
