var logg = console.log;

var client = algoliasearch('KRM1S7DDHX', 'f109d17791c3399d3d83ed3848d230d4');
var index = client.initIndex('code_building');


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

        }
    });
    return thevue;
}

////////////////

exports.run = run;
