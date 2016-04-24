function generateDefaultChart(){
	var chart = c3.generate({
	    data: {
	        xs: {
	            'setosa': 'setosa_x',
	            'versicolor': 'versicolor_x',
	        },
	        // iris data from R
	        columns: [
	            ["setosa_x", 3.5, 3.0, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3.0, 3.0, 4.0, 4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3.0, 3.4, 3.5, 3.4, 3.2, 3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3.0, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3.0, 3.8, 3.2, 3.7, 3.3],
	            ["versicolor_x", 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2.0, 3.0, 2.2, 2.9, 2.9, 3.1, 3.0, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3.0, 2.8, 3.0, 2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3.0, 3.4, 3.1, 2.3, 3.0, 2.5, 2.6, 3.0, 2.6, 2.3, 2.7, 3.0, 2.9, 2.9, 2.5, 2.8],
	            ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
	            ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
	        ],
	        type: 'scatter'
	    },
	    axis: {
	        x: {
	            label: 'Release Date',
	            tick: {
	                fit: false
	            }
	        },
	        y: {
	            label: 'IMDb score'
	        }
	    }
	});
}

function generateChartFromCsv(){
    var chart;
    chart = c3.generate({
        data: {
            url: 'data/ratings.csv',
            x: 'Year',
            y: 'IMDb Rating',
            type: 'scatter'
        }
    });
}

function generateMovieChartWithColumns(genres, valuesData, rawData){
	var imgCache = new Array();
	var chart = c3.generate({
	    data: {
	        xs: genres,
	        // iris data from R
	        columns: valuesData,
	        type: 'scatter',
	        onclick: function(id){
	        	var movie = rawData[id.x][0];
	        	window.open(movie.URL);
	        }
	    },
	    axis: {
	        x: {
	            label: 'Release Date',
	            type: 'timeseries',
	            tick: {
	                fit: false,
	                format: "%Y",
	            }
	        },
	        y: {
	            label: 'IMDb score',
	            tick: {
	            	max : 10,
	            	min: 1
	            }
	        }
	    },
	    tooltip: {
	        contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
	        	var axisData = d[0];
	        	var movie = rawData[axisData.x][0];
	            return '<div class="col-xs-6 col-md-12">' +
				           '<a href="#" class="thumbnail">' +
		               			'<p>' + movie.Title + '</p>' +
		               			'<p>My Rating: ' + movie['You rated'] + '</p>' +
		               			'<p>IMDb Rating: ' + movie['IMDb Rating'] + '</p>' +
						    '</a>'+
	                  	'</div>';
	        }
    	}
	});
}