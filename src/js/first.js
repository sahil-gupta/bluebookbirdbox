var logg = console.log;
var d = document;
d.f = document.querySelector;
d.c = document.createElement;

const moment = require('moment');
const ical = require('ical-generator');

var _help = require('./_help');

var vAll = require('./vues');

exports.allcode = () => {


    // ALL VUE
    vAll.run();



    const cal = ical({
        domain: 'sebbo.net',
        prodId: { company: 'superman-industries.com', product: 'ical-generator' },
        name: 'My Testfeed',
        timezone: 'Europe/Berlin'
    });
    // You can also set values like this…
    cal.domain('sebbo.net');
    // … or get values
    logg(cal.domain()); // --> "sebbo.net"
    // create a new event
    logg(moment())
    logg('this')
    const event = cal.createEvent({
        start: moment(),
        end: moment().add(1, 'hour'),
        timestamp: moment(),
        summary: 'My Event',
        organizer: 'Sebastian Pekarek <mail@example.com>'
    });
    // like above, you can also set/change values like this…
    event.summary('My Super Mega Awesome Event');
    // get the iCal string
    logg(cal.toString());
    logg('hereee')


}