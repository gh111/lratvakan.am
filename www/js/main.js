$(function () {


	// If iOS  start -------------------------------------------------------------------------------------- //

	// var is_ios = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );

	// if(is_ios) {

	// 	$('#header').css('border-top', '20px solid black');
	// 	$('.menuOpenWrapper').css('margin-top', '20px;');
	// };
	

	// Store object
	
	var storeObject = {
	    newsId: null,
	    catId: null,
	}


	// Refresh page ---------------------------------------------------------------------------------- //

	$('.searchBut').on('click', function () {
	
	    var page = $(':mobile-pagecontainer').pagecontainer('getActivePage')[0].id;
	    if (page == 'cat') {

	    	$.mobile.loading("show", {
		        text: "Թարմացվում է...",
		        textVisible: true,
		        theme: "b"
		    });
	   		getCatList(storeObject.catId);

	   		setTimeout(function () {
		        
				$.mobile.loading("hide");	

		    }, 1000);	
	    }
	    else if (page == 'news') {

	    	$.mobile.loading("show", {
		        text: "Թարմացվում է...",
		        textVisible: true,
		        theme: "b"
		    });

	   		getTimelineNews();

	   		setTimeout(function () {
		        
				$.mobile.loading("hide");	

		    }, 1000);	
	    }
	    
	});

	
	// Get cats  -------------------------------------------------------------------------------- //

	    var cats = '';	
		
		$.ajax({
	        type: "GET",
			url: "http://lratvakan.am/?appdata&action=getcats",

	        success: function(data){
	        	var catsRes = JSON.parse(data);
	        	
	        	for (i in catsRes) {

	        		cats += "<ul>";
						cats += "<b>" + catsRes[i]['title'] + "</b>";
						for (cat in catsRes[i]['cats']) {
							cats += "<li><a class='catTtl' href='#cat' data-id='" + catsRes[i]['cats'][cat]['id'] + "'>" + catsRes[i]['cats'][cat]['title'] + "</a></li>";
						}
					cats += "</ul>";
	        	}    	
				$('.menuCats').append(cats);	
	        }
	    });		
	

		$(document).on('click', '.catTtl', function(e) {

	 		storeObject.catId = $(this).data('id');
			getCatList(storeObject.catId);	 		
	 		$.mobile.changePage('', { transition: 'slideup'}, 'none');
			
		});	


		function getCatList(id) {

			var catContent = '';

			$.ajax({
		        type: "GET",
				url: "http://lratvakan.am/?appdata&action=getcat",
				data: {
					id: id,
				},
		        success: function(data){
		        	var data = JSON.parse(data);
			    	
		        	$('.catTitlerJS span').html(data['cat']['title']);

		        	catContent += "<div class='setcatID' style='display:none'>" + storeObject.catId + "</div>";

			    	for (i in data.items) {
				    	catContent += "<div class='timeLineUnit'>";
							catContent += "<a href='#show' data-id='"+ data.items[i]['id'] +"'>";
								catContent += "<img src='" + data.items[i]['img'] + "'>";
								catContent += "<span>" + data.items[i]['title'] + "</span>";
								catContent += "<time>" + data.items[i]['date'] + "</time>";
							catContent += "</a>";
						catContent += "</div>";
					}

					$('.catContJS').empty();
					$('.catContJS').append(catContent);
		        }
		    });		

		}

	// Get News data -------------------------------------------------------------------------------- //
	
	function getTimelineNews() {
			
		$.ajax({
	        type: "GET",
			url: "http://www.lratvakan.am/?appdata&action=newsline",
	        success: function(data){
	        	// append general news --------->

				var tmUnit = '';
				var data = JSON.parse(data);        

	        	for (i in data.general) {
	        			
	            	tmUnit += "<div class='mainNewsUnit'>";
						tmUnit += "<a href='#show' data-id='"+ data.general[i].id +"'>";
							tmUnit += "<span>" + data.general[i].title + "</span>";
							tmUnit += "<img src='" + data.general[i].img + "'>";
						tmUnit += "</a>";
					tmUnit += "</div>";	
	        	}

	        	$('#fotorama1').append(tmUnit);

				// append timeline --------->
				
				tmUnit = '';	

	        	for (i in data.newsline) {
	        			
	            	tmUnit += "<div class='timeLineUnit'>";
						tmUnit += "<a href='#show' data-id='"+ data.newsline[i].id +"'>";
							tmUnit += "<img src='" + data.newsline[i].img + "'>";
							tmUnit += "<span>" + data.newsline[i].title + "</span>";
							tmUnit += "<category>" + data.newsline[i].cat + "</category>";
							tmUnit += "<time>" + data.newsline[i].date + "</time>";
						tmUnit += "</a>";
					tmUnit += "</div>";	
	        	}
	        	$('.timeLine').empty();
	        	$('.timeLine').append(tmUnit);
	        }
	    });			
	}
	getTimelineNews();

	// Go to show page ------------->
	// Redirect to main page if refresh in show page

	$(document).delegate("#show", "pageshow", function() {
		if (storeObject.newsId == null)	{
			$.mobile.changePage('', { transition: 'slideup'}, 'none');
		}    
	});
	
	$(document).on('click', '.timeLineUnit a, .mainNewsUnit a', function(e) {

 		storeObject.newsId = $(this).data('id');
 		
 		$.mobile.changePage('', { transition: 'slideup'}, 'none');
		
		$.ajax({
	        type: "GET",
			url: "http://lratvakan.am/?appdata&action=p",
			data: {
				id: storeObject.newsId,
			},
	        success: function(data){
	        	var data = JSON.parse(data);

				$("#show").find('time').html(data.date);	
				$("#show").find('h1').html(data.title);

				if (data.img.lenght != 0) {

					$("#show").find('img').eq(0).attr('src', data.img);	
				}	
				
				if (data.youtube != '') {	

					$('.video-container').css('display', 'block');
					var iframe = document.createElement('IFRAME');
					iframe.src = "https://www.youtube.com/embed/" + data.youtube;
					iframe.width = 560;
					iframe.height = 315;
					iframe.frameborder = 0;
					$('.video-container').empty();
					$('.video-container').append(iframe);	
					
				}else {
					
					$('.video-container').css('display', 'none');
					$('.video-container').empty();
				}	

				if (data.gallery != '') {	
					var imgs = '';	
					$('#fotorama2').css('display', 'block');	
					
					for (i in data.gallery) {

						imgs += "<img src='" + data.gallery[i] + "'>";
    				}

    				$('#fotorama2').append(imgs);

				} else {

					$('#fotorama2').css('display', 'none');
					$('#fotorama2').empty();
				}

				if (data.voice) {
					var audio = document.createElement('audio');
					audio.controls = true;
					audio.src = data.voice;
					$('.audio').empty();
					$('.audio').append(audio);	
					
				}else {
					$('.audio').empty();
				}


				$("#show").find('.desc').html(data.desc);
	        }
	    });		

	});	


	// Scroll event -------------------------------------------------------------------------------------- //

	$(document).on("scrollstop", function (e) {

	    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
	        screenHeight = $.mobile.getScreenHeight(),
	        contentHeight = $(".timeLine", activePage).outerHeight(),
	        header = $("#header", activePage).outerHeight() - 1,
	        scrolled = $(window).scrollTop(),
	        footer = $(".footer", activePage).outerHeight() - 1,
	        scrollEnd = contentHeight - screenHeight + header + footer,
	        timeLineCount = $('.timeLine').children().length;

	    if (activePage[0].id == "news" && scrolled >= scrollEnd) {
    	    $.mobile.loading("show", {
		        text: "Բեռնվում է ավելին...",
		        textVisible: true,
		        theme: "b"
		    });
		    setTimeout(function () {
		        
				$.ajax({
			        type: "GET",
					url: "http://www.lratvakan.am/?appdata&action=newsline",
					data: {
						limit: timeLineCount
					},
			        success: function(data){
						var data = JSON.parse(data); 

						tmUnit = '';	
						
			        	for (i in data.newsline) {
			        			
			            	tmUnit += "<div class='timeLineUnit'>";
								tmUnit += "<a href='#show' data-id='"+ data.newsline[i].id +"'>";
									tmUnit += "<img src='" + data.newsline[i].img + "'>";
									tmUnit += "<span>" + data.newsline[i].title + "</span>";
									tmUnit += "<category>" + data.newsline[i].cat + "</category>";
									tmUnit += "<time>" + data.newsline[i].date + "</time>";
								tmUnit += "</a>";
							tmUnit += "</div>";	
			        	}

			     		$(".timeLine", activePage).append(tmUnit);
		        		
		        		$.mobile.loading("hide");
			        }
			    });		
		        

		    }, 500);
	    }

	    if (activePage[0].id == "cat" && scrolled >= scrollEnd) {

	    	timeLineCount = $('.catContJS').children().length;

    	    $.mobile.loading("show", {
		        text: "Բեռնվում է ավելին...",
		        textVisible: true,
		        theme: "b"
		    });

		    setTimeout(function () {
		        
				$.ajax({
			        type: "GET",
					url: "http://www.lratvakan.am/?appdata&action=getcat",
					data: {
						limit: timeLineCount,
						id: storeObject.catId
					},
			        success: function(data){
						var data = JSON.parse(data); 

						tmUnit = '';	
						
			        	for (i in data.items) {
			        			
			            	tmUnit += "<div class='timeLineUnit'>";
								tmUnit += "<a href='#show' data-id='"+ data.items[i].id +"'>";
									tmUnit += "<img src='" + data.items[i].img + "'>";
									tmUnit += "<span>" + data.items[i].title + "</span>";
									tmUnit += "<time>" + data.items[i].date + "</time>";
								tmUnit += "</a>";
							tmUnit += "</div>";	
			        	}

			     		$(".catContJS", activePage).append(tmUnit);
		        		
		        		$.mobile.loading("hide");
			        }
			    });		
		        

		    }, 500);
	    }

	});

	// Subscribe to news --------------------------------------------------------------------------- //
	
	
	$('#subscribeJS').on('click', function () {
		
		if (!localStorage.getItem("subscribe") || localStorage.getItem("subscribe") == 0) {

			localStorage.setItem("subscribe", "1");
			$('#subscribeJS').html("Հրաժարվել բաժանորդագրությունից");			
		}
		else {

			localStorage.setItem("subscribe", "0");	
			$('#subscribeJS').html("Բաժանորդագրվալ հրատապ լուրերին →");
		}

	});

	if (localStorage.getItem("subscribe") == 1) {

		localStorage.setItem("subscribe", "1");
		$('#subscribeJS').html("Հրաժարվել բաժանորդագրությունից");			
	}

		
	// Player -------------------------------------------------------------------------------------- //
	

		audiojs.createAll();
	

});