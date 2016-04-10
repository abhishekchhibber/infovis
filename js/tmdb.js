var api_key = "98f2b3bca6a0a4f9dd642a95fe50461c";
var img_path = "http://image.tmdb.org/t/p/w500";

function doGetRequest(resource, path, parameters, callback){
	$.ajax({
	  url: "http://api.themoviedb.org/3/"+resource+"/"+path+"?api_key=" + api_key,
	  data: parameters,
	  context: document.body,
	  dataType: 'jsonp',
	  async: false
	}).done(callback);
}

function getPopularMovies(callback){
	doGetRequest('movie','popular',{},callback);
}

function searchMovie(title, callback){
	doGetRequest('search','movie',{'query': title},callback);
}

function getImgPath(img){
	return img_path + img;
}