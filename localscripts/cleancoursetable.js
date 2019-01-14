var moment = require('moment');
var _ = require('lodash');
var fs = require('fs');
var logg = console.log;

const DAYSOFWEEK = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

// logg(moment().unix())

var thedata = require('./data_201901b.json');

logg(thedata.length);

for (var i=0;i<thedata.length;i++) {
    // deal with cancelled
    if (thedata[i]['title'] === 'CANCELLED') {
        thedata[i] = null;
        continue;
    }

    // deal with times and finalized times (no HTBA)
    thedata[i]['timesbyday'] = thedata[i]['times']['by_day'];
    var days = Object.keys(thedata[i]['timesbyday']);
    if (days.length === 0) {
        thedata[i] = null;
        continue;
    }
    for (var j=0;j<days.length;j++){
        if (days[j] === 'HTBA') {    
            if (days.length === 1) {
                thedata[i] = null;
                break;
            } else {
                delete thedata[i]['timesbyday']['HTBA'];
            }
        }
    }
    if (thedata[i] == null) {
        continue;
    }


    thedata[i] = _.pick(thedata[i], ['subject','number','section','long_title','description','professors', 'timesbyday']);
}

thedata = _.compact(thedata);
logg(thedata.length);


// var shuffle = _.shuffle(thedata);
// for (var i=0;i<10;i++){
//     logg(shuffle[i])
// }
// return;

function gettime(s) {
    var hour = s.split('.')[0];
    var minute = s.split('.')[1] || '00';

    if (minute.length === 1) {
        minute += '0';
    }

    return [parseInt(hour), parseInt(minute)];
}

for (var i=0;i<thedata.length;i++) {
    var d = thedata[i];

    // logg(d.subject + ' ||| ' + d.number + ' ||| ' + d.section + ' ||| ' + d.long_title);

    var values = Object.values(d.timesbyday);
    // for mon, tues, wed
    for (var j=0;j<DAYSOFWEEK.length;j++) {
        var dayy = DAYSOFWEEK[j];

        if (!(dayy in d.timesbyday)) {
            continue;
        }

        // for each session on dayy...
        for (var k=0; k < d.timesbyday[dayy].length ;k++) {

            var arr = d.timesbyday[dayy][k];

            var arrstart = gettime(arr[0]);
            var starthour = arrstart[0];
            var startmin = arrstart[1];

            var arrend = gettime(arr[1]);
            var endhour = arrend[0];
            var endmin = arrend[1];

            var loc = arr[2];

            d.timesbyday[dayy][k] = {
                    'starthour': starthour,
                    'startmin': startmin,
                    'endhour': endhour,
                    'endmin': endmin,
                    'location': loc
                }
        }
    }
}

var json = JSON.stringify(thedata);
fs.writeFile('./datacleanb.json', json, 'utf8',(err) => {
  if (err) throw err;
  console.log('The file has been saved!');
});
