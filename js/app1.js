function loadVideos(requestData){

	$.ajax({
		url: "https://www.googleapis.com/youtube/v3/search",
		data: requestData,
		dataType: "json",//use jsonp to avoid cross origin issues
		type: "GET",
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		console.log("Result?"+JSON.stringify(result));
		var items = result.items;
		pageToken = result.nextPageToken;
		dataItems(items);				
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		
	});
}

function dataItems(items){
	var thumbnailUrl,videoId,displayThumbnails=[];
	$.each(items,function(index,item){
			thumbnailUrl = item.snippet.thumbnails.medium.url;
			videoId = item.id.videoId;
			displayThumbnails.push({
				'url' : thumbnailUrl,
				'id'  : videoId,
			});
	});
	displayVideos(displayThumbnails);
}

function displayVideos(thumbnails){
	$.each(thumbnails,function(index,video){
		var item = $('<li></li>').addClass('gallery-item');
		var thumbnail = $('<img>').attr({
				"src":video.url
		});
		var link = $('<a></a>').attr({
				"href" : "https://www.youtube.com/watch?v="+video.id,
				"target": "_blank"
		});
		link.append(thumbnail);
		item.append(link);
		$('.gallery-list').append(item);
	});
	loading = false;
}

var getResults = function(searchTerm,duration,type) {

	requestData = { 
		q: searchTerm,
		duration: duration,
		part : 'snippet',
		key : 'AIzaSyBQtb_O7jIEWie5v6qm9MbHyTSjyKVIOjw',
		safeSearch : 'strict',
		type : type,
		maxResults : 9
	};
	loadVideos(requestData);

	/*$(window).on('scroll','#slider-section',function(){
		var currentScroll = $(this)[0].scrollTop;
        var MaximumScroll = $(this)[0].scrollHeight - $(this).height();

        if( ($(window).height() + $(window).scrollTop() == $(document).height() ) && !loading){
        	loading = true;
        	$('#slider-section').append('<p>loading</p>');
        	$(this)[0].scrollTop = $(this)[0].scrollHeight - $(this).height();
        	requestData.pageToken = pageToken;
        	loadVideos(requestData);
        }
	});*/

	$('.next').click(function(event){
		event.preventDefault();
		requestData.pageToken = pageToken;
        loadVideos(requestData);
        $('body').animate({
        	scrollTop : $(document).height()
        },1000);        
	});
}

$(function(){
     
    var requestData,pageToken,loading= true;
	$('#control-form').submit( function(e){
		e.preventDefault();
		// zero out results if previous search has run
		$('.gallery-list').html('');
		
		searchTerm = $('#querytext').val();
		duration = $('#duration').val();
		type = $('#type').val();

		getResults(searchTerm,duration,type);
	});

	$('a[href=#top]').click(function () {
	    $('body,html').animate({
	        scrollTop: 0
	    }, 600);
	    return false;
	});

	$(window).scroll(function () {
	    if ($(this).scrollTop() > 50) {
	        $('.totop a').fadeIn();
	    } else {
	        $('.totop a').fadeOut();
	    }
	});

});