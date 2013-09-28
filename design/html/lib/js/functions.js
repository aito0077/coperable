$(document).ready(function() {
		
	$.address.change(function(evt) {
		var val = evt.value == '/' ? '/home' : evt.value,
			url = $.address.baseURL()+val+'.html';
		$('#contentLoader').load(url,function() {
			refreshme();
		});
	}); 
	$.address.update();
})


function refreshme() {
	$('[data-toggle]').each(function() {
		var clss = $(this).attr('data-toggle');
		var fst = $(this).attr('data-toggle-first');
		$(this).children('li').click(function() {
			$(this).addClass(clss).siblings().removeClass(clss);
		})
		$(this).children('li').eq(fst).click();
	})
	$('.status li.actual').prevAll('li').addClass('actual');	
	makeSocial();
	mGallery();
}
function mGallery() {
	imagesLoaded($('.m-gallery'), function() {
		$('.m-gallery').each(function() {
			var width 	 = 0,
				pos		 = 0,
				$this	 = $(this);
				$item 	 = $(this).children('li'),
				$wrapper = $('<div class="m-gallery-wrapper"></div>'),
				gallery  = $('<div class="m-gallery-all"></div>'),
				gallery  = gallery.wrapInner($wrapper),
				$prevBt = $('<div class="nav-bt prev"></div>').appendTo($(gallery)),
				$nextBt = $('<div class="nav-bt next"></div>').appendTo($(gallery));
				
			$this.children('li:last-child').css({margin:0});
			$item.each(function() {
				width += $(this).outerWidth(true);
				$(this).css({float:'left'});
			})
			$wrapper.css({position:'relative',width:'100%',height:$(this).children('li').height()+20,overflow:'hidden'});
			
			//events
			$nextBt.not('.disabled').click(function() {
				if(pos > -(width-$this.parent().width())) {
					pos -= $item.outerWidth(true);
					move(pos)
				}
			})
			$prevBt.click(function() {
				if(pos < 0) {
					pos += $item.outerWidth(true);
					move(pos)
				}
			})
			
			function move(p) {
				$this.stop().animate({left:p})
			}
			
			//
			$this.css({width:width,position:'absolute'}).wrap(gallery);
			move(pos);
		})
	})
}

function makeSocial() {
	$('.twitter-btn').append('<a class="twitter-share-button" data-show-count="false" data-show-screen-name="false" href="http://twitter.com/">Tweet</a>');
	$.ajax({
		url:'//platform.twitter.com/widgets.js',
		dataType:'script',
		success:function(){twttr.widgets.load();}
	});
	
	var dynLike = document.createElement('fb:like');
	dynLike.setAttribute('href', 'http://www.facebook.com');
	dynLike.setAttribute('send', 'false');
	dynLike.setAttribute('width', '450');
	dynLike.setAttribute('show_faces', 'false');
	dynLike.setAttribute('data-layout', 'button_count');
	$('.fb-btn').append(dynLike);
	FB.XFBML.parse();
}