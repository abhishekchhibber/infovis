function pushElem(array, elem){
	if (array === undefined){
		array = new Array();
	}
	array.push(elem);
	return array;
}

function generateMovieData(data){
	var genreMap = new Array();
	var genreAndYearVals = new Array();
	var titleData = new Array();
	data.map(function(val){
		if(val['Title type'] == 'Feature Film'){
			var genres = val.Genres.split(', ');
			var releaseDate = new Date(val['Release Date (month/day/year)']);
			genres.map(function(genre){
				var yearVal = genre + "_x";
				genreMap[genre] = yearVal;
				genreAndYearVals[genre] = pushElem(genreAndYearVals[genre], val['You rated']);
				genreAndYearVals[yearVal] = pushElem(genreAndYearVals[yearVal], releaseDate);
			});
			titleData[releaseDate] = pushElem(titleData[releaseDate], val);
		}
	});
	var valuesArrays = new Array();
	for(var key in genreAndYearVals){
	  var array = genreAndYearVals[key];
	  array.unshift(key);
	  valuesArrays.push(array);
	}
	return {genres: genreMap, values: valuesArrays, rawData: titleData};
}