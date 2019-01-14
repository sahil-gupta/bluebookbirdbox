const logg = console.log;

const client = algoliasearch('KRM1S7DDHX', 'f109d17791c3399d3d83ed3848d230d4');
const index = client.initIndex('code_building');

function run() {
    var thevue = new Vue({
        el: '#vueCodes',
        data: {
            searchtext: '',
            searchresults: []
        },
        methods: {
            dosearch: function () {
                if (this.searchtext === '') {
                    return;
                }

                var self = this;

                index.search(this.searchtext, function (err, content) {
                    self.searchresults = [];
                    for (var i=0; i < content.hits.length; i++) {
                        var row = content.hits[i];
                        self.searchresults.push(row.Code + ' / ' + row.Building)
                    }
                });
            }
        },
        watch: {
            searchtext: function (newval, oldval) {
                if (this.searchtext === '') {
                    this.searchresults = [];
                    return;
                }

                this.debounceddosearch();
            }
        },
        mounted: function () {
            this.debounceddosearch = _.debounce(this.dosearch, 500);

            var typed = new Typed('#idsearchcodes', {
                strings: ['kbt','sss','yk220','my', 'wlh','dmca','luce','akw','wts','wh221','smh'],
                typeSpeed: 100,
                backSpeed: 50,
                backDelay: 1000,
                startDelay: 500,
                showCursor: false,
                smartBackspace: false,
                shuffle: false,
                attr: 'placeholder',
                loop: true
            });
        }
    });
    return thevue;
}

////////////////

exports.run = run;
