var yearCountChart;
var directorCountChart;
var myRatingChart;
var genreChart;
var movieCount;
var movieTable;


function loadCsv(path) {
    yearCountChart = dc.barChart('#review-count-chart');
    directorCountChart = dc.rowChart('#director-count-chart');
    myRatingChart = dc.rowChart('#my-rating-chart');
    genreChart = dc.rowChart('#genre-count-chart');
    movieCount = dc.dataCount('.dc-data-count');
    movieTable = dc.dataTable('.dc-data-table');
    $('#content').show();
    d3.csv(path, function (data) {
        var dateFormat = d3.time.format('%Y-%m-%d');
        var numberFormat = d3.format('.2f');
        var topDir = 10;
        var totalWidth = 990;
        var height = 300;

        var maxYear = new Date().getFullYear();
        var minYear = maxYear;
        var movies = [];
        data.map(function (d) {
            d.rating = +d['You rated'];
            d.year = +d['Year'];
            d.imdbRating = +d['IMDb Rating'];
            d.votes = +d['Num. Votes'];
            d.release = dateFormat.parse(d['Release Date (month/day/year)']);
            d.genres = d['Genres'].split(", ");
            d.directors = d['Directors'].split(", ");
            if (d.year < minYear) {
                minYear = d.year;
            }
            if (d['Title type'] == 'Feature Film') {
                movies.push(d);
            }
        });

        var ratings = crossfilter(movies);
        var all = ratings.groupAll();

        var yearlyDimension = ratings.dimension(function (d) {
            return d.year;
        });

        var dateDimension = ratings.dimension(function (d) {
            return d.release;
        });

        var ratingDimension = ratings.dimension(function (d) {
            return d.rating;
        });

        var directorDimension = ratings.dimension(function (d) {
            return d.directors[0];
        });

        var titleDimension = ratings.dimension(function (d) {
            return d['Title'];
        });

        function reduceAdd(p, v) {
            v.genres.forEach(function (val, idx) {
                p[val] = (p[val] || 0) + 1; //increment counts
            });
            return p;
        }

        function reduceRemove(p, v) {
            v.genres.forEach(function (val, idx) {
                p[val] = (p[val] || 0) - 1; //decrement counts
            });
            return p;

        }

        function reduceInitial() {
            return {};
        }

        var genres = ratings.dimension(function (d) {
            return d.genres;
        });
        var genresGroup = genres.groupAll().reduce(reduceAdd, reduceRemove, reduceInitial).value();

        genresGroup.all = function () {
            var newObject = [];
            for (var key in this) {
                if (this.hasOwnProperty(key) && key != "all") {
                    newObject.push({
                        key: key,
                        value: this[key]
                    });
                }
            }
            return newObject;
        }

        var yearGroup = yearlyDimension.group().reduceCount();

        var directorGroup = directorDimension.group().reduceCount();

        var ratingGroup = ratingDimension.group().reduceCount();


        yearCountChart
            .dimension(yearlyDimension)
            .group(yearGroup)
            .width(totalWidth * 2 / 3)
            .height(200)
            .x(d3.scale.linear().domain([minYear, maxYear]))
            .renderHorizontalGridLines(true)
            .filterPrinter(function (filters) {
                var filter = filters[0], s = '';
                s += numberFormat(filter[0]) + ' -> ' + numberFormat(filter[1]);
                return s;
            });

        yearCountChart.xAxis().tickFormat(
            function (v) {
                return v;
            });
        yearCountChart.yAxis().ticks(10);

        myRatingChart
            .width(totalWidth / 3.3)
            .height(200)
            .margins({top: 20, left: 10, right: 10, bottom: 20})
            .dimension(ratingDimension)
            .ordinalColors(d3.scale.category10().range())
            .renderLabel(true)
            .ordering(function (d) {
                return -d.key;
            })
            .group(ratingGroup)
            .elasticX(true);

        directorCountChart
            .width(totalWidth / 2.1)
            .height(400)
            .margins({top: 20, left: 10, right: 10, bottom: 20})
            .dimension(directorDimension)
            .group(directorGroup)
            .data(function (group) {
                return group.top(topDir);
            })
            .ordinalColors(d3.scale.category10().range())
            .title(function (d) {
                return d.value;
            })
            .elasticX(true)
            .xAxis().ticks(10);

        genreChart
            .width(totalWidth / 2.1)
            .height(400)
            .margins({top: 20, left: 10, right: 10, bottom: 20})
            .dimension(genres)
            .group(genresGroup)
            .ordinalColors(d3.scale.category10().range())
            .title(function (d) {
                return d.value;
            })
            .ordering(function (d) {
                return -d.value;
            })
            .elasticX(true)
            .xAxis().ticks(10);

        movieCount /* dc.dataCount('.dc-data-count', 'chartGroup'); */
            .dimension(ratings)
            .group(all)
            .html({
                some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> movies' +
                ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'\'>Reset All</a>',
                all: 'All movies selected. Please click on the graph to apply filters.'
            });

        movieTable
            .dimension(dateDimension)
            .group(function (d) {
                return "";
            })
            .size(200)
            .columns([
                {
                    // Specify a custom format for column 'Change' by using a label with a function.
                    label: 'Title',
                    format: function (d) {
                        return "<a href=" + d.URL + ">" + d.Title + "</a>";
                    }
                },
                'year',
                'Directors',
                'genres',
                'rating'
            ])
            .sortBy(function (d) {
                return d.year;
            })
            .order(d3.ascending)
            .on('renderlet', function (table) {
                table.selectAll('.dc-table-group').classed('info', true);
            });

        dc.renderAll();


    });
}

function readCsvFromFile(evt) {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var f = evt.target.files[0];
        console.log(f);
        var reader = new FileReader();
        reader.onload = (function(theFile) {

            return function(e) {
                loadCsv(e.target.result);
            };
        })(f);
        reader.readAsDataURL(f);
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
}

$('#csvFile').on('change', readCsvFromFile);
$('#csvFile').on('click',function(){$(this).val("")});