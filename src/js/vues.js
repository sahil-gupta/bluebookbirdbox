var logg = console.log;

const DAYFLAG = 7;
const SECONDSINDAY = 86400;
const TODAY = moment().startOf('day');
const RANGEFUTURE = TODAY.diff(moment('2020-05-20'), 'days');   // negative number
const RANGEPAST = TODAY.diff(moment('2019-01-01'), 'days');     // positive number

// const IDVUE = '#vueApp'; vueClasses Codes


// get and set
function localstorage(key, value) {
    if (value === undefined) {
        var value = window.localStorage.getItem(key);
        return value && JSON.parse(value);
    }

    window.localStorage.setItem(key, JSON.stringify(value));
}


function run() {
    var thevue = new Vue({
        el: IDVUE,
        data: {
            crudinput: '',
            lasttouchinput: -1,
            lasttouchbox: -1,
            theid: null,
            someintervalID: null,
            colorevent: null,
        },
        methods: {
            docreate: function () {
                var self = this;

            },
        },
        watch: {
            crudinput: function (newval, oldval) {
                // hereee
                // this.crudinput = this.crudinput.replace(/[^a-z0-9]/gi, '').toLowerCase().substring(0, 15);

                this.lasttouchinput = Date.now();
            }
        },
        mounted: function () {
            var self = this;
            $('#crudcreate').fadeIn();
        }
    });
    return thevue;
}

////////////////

exports.run = run;
