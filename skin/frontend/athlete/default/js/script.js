var breakpoint = 989,
	animation_text_space = 0,
	gridWidth = [479,768,959,9999],
	mobile = false;

var getGridBreakpoint = function()
{
	var width = jQuery(window).width();
	for (var i=0; i<gridWidth.length; i++ ) {
		if ( width < gridWidth[i] ) {
			break;
		}
	}
	return i;
}

if (!("ontouchstart" in document.documentElement)) {
	document.documentElement.className += " no-touch";
} else {
	//enable :active class for links
	document.addEventListener("touchstart", function(){}, true);
}

jQuery(document).ready(function(){
	// megamenu link companie disabled 
	jQuery('.level0.nav-6.last.level-top.wide.parent.parent-fake > a').click(function(){
	  return false;
	});

	var windowsize = jQuery(window).width();
	if (windowsize > 1100)
		jQuery('.header-container.full-header').scrollToFixed();
});
// Set pixelRatio to 1 if the browser doesn't offer it up.
var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;
jQuery(window).on("load", function() {

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		jQuery('.mousetrap, #cloud-big-zoom').css({display:'none'});
	}

	if (pixelRatio == 1) return;

	var elements = {
		pager_left: jQuery('.pages li a.i-previous img'),
		pager_right: jQuery('.pages li a.i-next img'),
		sort_asc: jQuery('a.sort-by-arrow img.i_asc_arrow'),
		sort_desc: jQuery('a.sort-by-arrow img.i_desc_arrow')
	};
	for (var key in elements) {
		if (elements[key].length) {
			elements[key].attr('src', elements[key].attr('src').replace(/^(.*)\.png$/,"$1@2x.png"));
		}
	}
	//product images
	jQuery('img[data-srcX2]').each(function(){
		jQuery(this).attr('src',jQuery(this).attr('data-srcX2'));
	});
	//custom block images.
	jQuery('img.retina').each(function(){
		var file_ext = jQuery(this).attr('src').split('.').pop();
		var pattern = new RegExp("^(.*)\."+file_ext+"+$");
		jQuery(this).attr('src',jQuery(this).attr('src').replace(pattern,"$1_2x."+file_ext));
	});
	
	

});

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
debounce = function(func, wait, immediate) {
	var timeout, args, context, timestamp, result;
	return function() {
		context = this;
		args = arguments;
		timestamp = new Date();
		var later = function() {
			var last = (new Date()) - timestamp;
			if (last < wait) {
				timeout = setTimeout(later, wait - last);
			} else {
				timeout = null;
				if (!immediate) result = func.apply(context, args);
			}
		};
		var callNow = immediate && !timeout;
		if (!timeout) {
			timeout = setTimeout(later, wait);
		}
		if (callNow) result = func.apply(context, args);
		return result;
	};
};

jQuery.fn.extend({
	scrollToMe: function () {
		jQuery('html,body').animate({scrollTop: (jQuery(this).offset().top - 100)}, 500);
	}});

jQuery(function($){

	$(window).resize(function(){
		var width = $(window).width();
		mobile = (width <= breakpoint);
		//console.log(mobile, width, breakpoint);
	});

	/******* ToTop ******/
	$("body").append('<a href="#" id="toTop" class="icon-'+Athlete.button_icons+'" style="display: none;"><span id="toTopHover" style="opacity: 0;"></span><small>To Top<small></a>');

		$(window).scroll(function () {
			if ($(this).scrollTop() > 100)
				$('a#toTop').show();
			else
				$('a#toTop').hide();
		});
		$('a#toTop').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 256);
			return false;
		});

	/******* carousel ******/
	Athlete.carouselUtils = {
		initCallback: function(carousel){
			carousel.carouselID = '#' + $(carousel.list).attr('id');
			//console.log(carousel.carouselID, 'initCallback');
			carousel.carouselNav = carousel.carouselID + '_nav';
			carousel.gridBreakpoint = getGridBreakpoint();

			$('a.next', carousel.carouselNav).bind('click', function() {
				carousel.next();
				return false;
			});
			$('a.prev', carousel.carouselNav).bind('click', function() {
				carousel.prev();
				return false;
			});

			$(carousel.carouselID).parent().jSwipe({
				swipeLeft: function() { carousel.next(); },
				swipeRight: function() { carousel.prev(); },
				swipeMoving: function() {}
			});
		},
		reloadCallback: function(carousel){
			//console.log('reload attempt ', carousel.carouselID);
			var gridBreakpoint = getGridBreakpoint();
			if ( carousel.gridBreakpoint == gridBreakpoint ) return;
			carousel.gridBreakpoint = gridBreakpoint;

			//console.log('reload ', carousel.carouselID);
			var li = $(carousel.carouselID).children('li');
			carousel.list = $(carousel.carouselID);
			carousel.list.css(carousel.wh, $(li.get(0)).outerWidth(!0) * li.size());
			carousel.scroll(0, !1);
			carousel.list.css(carousel.lt, "0px");
			Athlete.carouselUtils.setClipHeight(carousel);
		},
		buttonNextCallback: function(carousel, button, flag){
			jQuery('a.next', carousel.carouselNav).toggleClass('disabled', !flag);
			if ( jQuery('a.disabled', carousel.carouselNav).length == 2 ) {
				jQuery(carousel.carouselNav).hide();
			} else {
				jQuery(carousel.carouselNav).show();
			}
		},
		buttonPrevCallback: function(carousel, button, flag){
			jQuery('a.prev', carousel.carouselNav).toggleClass('disabled', !flag);
			if ( jQuery('a.disabled', carousel.carouselNav).length == 2 ) {
				jQuery(carousel.carouselNav).hide();
			} else {
				jQuery(carousel.carouselNav).show();
			}
		},
		setClipHeight: function(carousel) {
			var h = 0;
			$(carousel.carouselID).children('li').each(function(){
				if ( $(this).outerHeight(!0) > h )
					h = $(this).outerHeight(!0);
			});
			$(carousel.carouselID).parent().height(h);
		}
	};

	$('#brands_slider').jcarousel({
		auto: Athlete.sliders.brand.auto,
		scroll: Athlete.sliders.brand.scroll,
		wrap: Athlete.sliders.brand.wrap,
		initCallback: Athlete.carouselUtils.initCallback,
		reloadCallback: Athlete.carouselUtils.reloadCallback,
		buttonNextHTML: null,
		buttonPrevHTML: null,
		buttonNextCallback: Athlete.carouselUtils.buttonNextCallback,
		buttonPrevCallback: Athlete.carouselUtils.buttonPrevCallback
	});

	if ( Athlete.sliders.brand.auto ) {
		$('#brands_slider').hover(function() {
			$(this).data("jcarousel").stopAuto();
		}, function() {
			$(this).data("jcarousel").startAuto(Athlete.sliders.brand.auto);
		});
	}

	$('.jcarousel-slider').jcarousel({
		auto: Athlete.sliders.product.auto,
		scroll: Athlete.sliders.product.scroll,
		wrap: Athlete.sliders.product.wrap,
		initCallback: Athlete.carouselUtils.initCallback,
		reloadCallback: Athlete.carouselUtils.reloadCallback,
		buttonNextHTML: null,
		buttonPrevHTML: null,
		buttonNextCallback: Athlete.carouselUtils.buttonNextCallback,
		buttonPrevCallback: Athlete.carouselUtils.buttonPrevCallback
	});
	if ( Athlete.sliders.product.auto ) {
		$('.jcarousel-slider').hover(function() {
			$(this).data("jcarousel").stopAuto();
		}, function() {
			$(this).data("jcarousel").startAuto(Athlete.sliders.product.auto);
		});
	}
	//login
	$('.block-login ul.slides').jcarousel({
		scroll: 1,
		initCallback: function(carousel){
			$('#forgot-password').click(function() {
				carousel.next();
				return false;
			});
			$('#back-login').click(function() {
				carousel.prev();
				return false;
			});
			carousel.carouselID = '#' + $(carousel.list).attr('id');
			$(carousel.carouselID).parent().jSwipe({
				swipeLeft: function() { carousel.next(); },
				swipeRight: function() { carousel.prev(); },
				swipeMoving: function() {}
			});
		},
		buttonNextHTML: null,
		buttonPrevHTML: null
	});

	$(window).load(function(){

		var initBannerText = function(carouselID)
		{
			var carouselHeight = $(carouselID).height();
			$('.animation-wrapper', carouselID).removeAttr('style').attr({'data-width': '', 'data-height': ''});
			$('.text-container .text, .text-container .link', carouselID).each(function(){
				var w = $(this).outerWidth(!0) + animation_text_space,
					h = $(this).outerHeight();

				$(this).parent()
					.attr('data-width', w )
					.attr('data-height', h )
					.width( 0 )
					.height( h );
			});
			$('.text-container.center', carouselID).each(function(){
				$(this)
					.css('margin', $(this).attr('data-margin') )
					.css('margin-top', parseInt((carouselHeight-$(this).height())/2) + 'px');
			});
		}

		/* banner carousel */
		$('.banners-slider-container .banners').jcarousel({
			auto: Athlete.sliders.banner.auto,
			scroll: Athlete.sliders.banner.scroll,
			wrap: Athlete.sliders.banner.wrap,
			initCallback: function(carousel){
				var carouselID = '#' + $(carousel.list).attr('id');
				$('.text-container', carouselID).show();
				$('.text-container .text', carouselID).wrap('<div class="animation-wrapper animation-text" />');
				$('.text-container .link', carouselID).wrap('<div class="animation-wrapper animation-link" />');
				$('.text-container br', carouselID).hide();

				$('.text-container.center', carouselID).each(function(){
					$(this).attr('data-margin', $(this).css('margin'));
				});

				initBannerText(carouselID);

				//banner hover
				$('.no-touch '+carouselID+' > li').hover(
					function(){
						$('.text-container .animation-wrapper', this).each(function(i){
							$(this)
								.delay(64 * (i))
								.queue(function(next){
									$(this).addClass('animate-me');
									next();
								});
						});
					},
					function(){
						$('.text-container .animation-wrapper', this).each(function(i){
							$(this)
								.delay(64 * i)
								.queue(function(next){
									$(this).removeClass('animate-me');
									next();
								});
						});
					}
				);
				//run default init
				Athlete.carouselUtils.initCallback(carousel);
			},
			reloadCallback: function(carousel){
				var oldGridBreakpoint = carousel.gridBreakpoint;
				Athlete.carouselUtils.reloadCallback(carousel);
				if ( carousel.gridBreakpoint == oldGridBreakpoint ) return;

				initBannerText(carousel.carouselID);
				for (var i = carousel.first; i <= carousel.last; i++) {
					$('.text-container .animation-wrapper', $($(carousel.carouselID).children('li').get(i-1))).each(function(i){
						$(this)
							.delay(32 * i)
							.animate({width:$(this).attr('data-width')}, 256, 'easeOutExpo');
					});
				}
			},
			itemVisibleInCallback: function(carousel, li){
					$('.text-container .animation-wrapper', li).each(function(i){
						$(this)
							.delay(32 * i)
							.animate({width:$(this).attr('data-width')}, 256, 'easeOutExpo');
					});
			},
			itemVisibleOutCallback: function(carousel, li){
				$('.text-container .animation-wrapper', li).css('width', '0px');
			},
			buttonNextHTML: null,
			buttonPrevHTML: null,
			buttonNextCallback: Athlete.carouselUtils.buttonNextCallback,
			buttonPrevCallback: Athlete.carouselUtils.buttonPrevCallback
		});
	});
	if ( Athlete.sliders.banner.auto ) {
		$('.banners-slider-container .banners').hover(function() {
			$(this).data("jcarousel").stopAuto();
		}, function() {
			$(this).data("jcarousel").startAuto(Athlete.sliders.banner.auto);
		});
	}

	
	$(document).on("mouseenter",".header-switch", function() {
		$('.header-dropdown', this).stop( true, true ).animate({opacity:1, height:'toggle'}, 100);
	});
	$(document).on("mouseleave",".header-switch", function() {
			$('.header-dropdown', this).stop( true, true ).animate({opacity:0, height:'toggle'}, 100);
	});
	

	$('#nav>li').hover(
		function(){
			if (mobile) return;

			$(this).addClass('over');
			$(this).children().addClass('shown-sub');

			var ul = $(this).children();
			if ( !ul.length || !$('div.nav-container').hasClass('default') ) return;
			var docWidth = $(document).width();
			var divWidth = ul.actual('width') + parseInt(ul.css('padding-left'), 10)*2 + 30;
			if ( divWidth + parseInt($(ul).offset().left, 10) > docWidth  ) {
				ul.css('left', -($(this).offset().left + divWidth - docWidth)+'px' );
			}
		},
		function(){
			if (mobile) return;

			$(this).removeClass('over');
			$(this).children().removeClass('shown-sub').removeAttr('style');
		}
	);
	$('#nav ul.level0 li').hover(
		function(){
			if (mobile) return;

			$(this).addClass('over');
			$(this).children().addClass('shown-sub');
		},
		function(){
			if (mobile) return;

			$(this).removeClass('over');
			$(this).children().removeClass('shown-sub');
		}
	);

	//for images in content
	$('.std, .info-content').find('img[style*="float: left"]').addClass('alignleft');
	$('img.alignleft').closest('a').addClass('alignleft');
	$('a.alignleft').find('.alignleft').removeClass('alignleft');

	$('.std, .info-content').find('img[style*="float: right"]').addClass('alignright');
	$('img.alignright').closest('a').addClass('alignright');
	$('a.alignright').find('.alignright').removeClass('alignright');

	$('.std, .info-content').find('img[style*="display: block; margin-left: auto; margin-right: auto;"]').addClass('aligncenter');
	$('img.aligncenter').closest('a').addClass('aligncenter');
	$('a.aligncenter').find('.aligncenter').removeClass('aligncenter');

	$(function(){
	    $(".lt-ie8 .hb-left").hover(function(){
	        $(this).stop().animate({left: "0" }, 300, 'easeOutQuint');
        }, function(){
	        $(this).stop().animate({left: "-245" }, 600, 'easeInQuint');
	    },1000);

	   $(".lt-ie8 .hb-right").hover(function(){
            $(this).stop(true, false).animate({right: "0" }, 300, 'easeOutQuint');
        }, function(){
            $(this).stop(true, false).animate({right: "-245" }, 600, 'easeInQuint');
        },1000);
    });

	//mobile navigation
	$('.nav-container li.parent > a').prepend('<em>+</em>');
	$('.nav-container li.parent-fake > a em').detach();
	
	$('.nav-container li.parent > a em').click(function(){
		if ( $(this).text() == '+') {
			$(this).parent().parent().addClass('over');
			$(this).parent().next().slideToggle();
			$(this).text('-');
		} else {
			$(this).parent().parent().removeClass('over');
			$(this).parent().next().slideToggle();
			$(this).text('+');
		}
		return false;
	});
	$('.nav-container li.parent > a').click(function(e){
		if ($(this).parent().hasClass('parent-fake')) {
			//alert('parent-fake');
		} else {
			if ($(this).children('em').text() == '+') {
				$(this).parent().addClass('over');
				$(this).next().slideToggle();
				$(this).children('em').text('-')
				e.stopPropagation();
				e.preventDefault();
			} else {
				$(this).children('em').text('-');
				$(this).parent().removeClass('over');
				$(this).children('em').text('+');
				$(this).next().slideToggle();
				e.stopPropagation();
				e.preventDefault();
			}
			
		}
	});
	$('.nav-container .nav-top-title').click(function(){
		$(this).toggleClass('over').next().toggle();
		return false;
	});
	$(window).resize(debounce(function(){
		if (!mobile) {
			$('#nav, #nav li.parent, #nav li.parent > ul, #nav li.parent > div').removeAttr('style');
			$('#nav li.parent').removeClass('over');
			$('.nav-container li.parent > a em').text('+');
		}
	}, 128));

	if ( !Athlete.header_search ) {
		var form_search_over = false;
		$('.header .form-search').on({
			click: function(event){
				event.stopPropagation();
				if ( form_search_over ) {
					return true;
				}
				form_search_over = true;
				$(this).addClass('form-search-over');
				$('#search').stop( true, true).css('opacity', 0).animate({width:'toggle', opacity:1}, 200, 'easeOutExpo');
				return false;
			}
		});
		//Hide search if visible
		$('html').click(function() {
			if ( form_search_over ) {
				form_search_over = false;
				$('#search').stop( true, true ).animate({width:'toggle', opacity:0}, 300, 'easeInExpo', function(){
					$(this).parent().parent().removeClass('form-search-over');
				});
			}
		});
	}

	$('.toolbar-switch').on({
		mouseenter: function() {
			var $dropdown = $('.toolbar-dropdown', this), width;
			$(this).addClass('over');
			if ( $(this).closest('.sorter').length ) {
				width = $(this).width()+50;
			} else {
				width = $(this).width() - parseInt($dropdown.css('padding-left'))*2 ;
			}
			$dropdown
				.css('width', width)
				.stop( true, true )
				.animate({opacity:1, height:'toggle'}, 100);
		}, mouseleave: function() {
			var that = this;
			$('.toolbar-dropdown', this).stop( true, true ).animate({opacity:0, height:'toggle'}, 100, function(){
				$(that).removeClass('over');
			});
		}
	});

	/* category banner animation */
	var cbc = $('.category-banner-container');
	var cbctc = cbc.find('.text-container');

	$(window).load(function(){

		if ( !cbctc.length ) return;

		$('.text', cbc).wrap('<div class="animation-wrapper animation-text" />');
		$('.link', cbc).wrap('<div class="animation-wrapper animation-link" />');
		$(' br', cbctc).hide();

		$('.text, .link', cbc).each(function(){
			$(this).attr('data-style', $(this).attr('style'));
		});

		var initTitle = function()
		{
			$('.text, .link', cbc).removeAttr('style');
			$('.text, .link', cbc).each(function(){
				$(this).attr('style', $(this).attr('data-style'));
			});
			$('.animation-wrapper', cbc).removeAttr('style').css({visibility: 'hidden'}).attr({'data-width': '', 'data-height': ''});

			cbctc.css('visibility', 'visible');
			$('.text, .link', cbc).each(function(){
				var w = $(this).actual('outerWidth'),
					h = $(this).actual('outerHeight');

				$(this).parent()
					.attr('data-width', w )
					.attr('data-height', h )
					.width( 0 )
					.height( h )
			});

			cbctc.css('marginTop', parseInt((cbc.height()-cbctc.height())/2)+'px');
		}

		var showTitle = function()
		{
			initTitle();
			$('.animation-wrapper', cbctc).each(function(i){
				$(this)
					.css('visibility', 'visible')
					.delay(32 * i)
					.queue(function(next){
						$(this).animate({width:$(this).attr('data-width')}, 256, 'easeOutExpo');
						next();
					});
			});
		}

		setTimeout(function(){
			showTitle();
			$(window).resize(function(){ $('.animation-wrapper', cbctc).css({width: 0}) });
			$(window).resize(debounce(showTitle, 400));
		}, 1000);

	});


	/* cms banner animation */
	var cmsBanner = $('.cms-banner');
	var cmsBannerText = cmsBanner.find('.text-container');

	$(window).load(function(){

		if ( !cmsBannerText.length ) return;

		$('.text', cmsBanner).wrap('<div class="animation-wrapper animation-text" />');
		$('.link', cmsBanner).wrap('<div class="animation-wrapper animation-link" />');
		$(' br', cmsBannerText).hide();

		var initTitle = function()
		{
			//$('.text, .link', cmsBanner).removeAttr('style');
			$('.animation-wrapper', cmsBanner).removeAttr('style').css({visibility: 'hidden'}).attr({'data-width': '', 'data-height': ''});

			cmsBannerText.css('visibility', 'visible');
			$('.text, .link', cmsBanner).each(function(){
				var w = $(this).actual('outerWidth'),
					h = $(this).actual('outerHeight');

				$(this).parent()
					.attr('data-width', w )
					.attr('data-height', h )
					.width( 0 )
					.height( h )
			});

			$('.text-container.center', cmsBanner).each(function(){
				$(this).css('marginTop', parseInt(($(this).parent().height()-$(this).height())/2)+'px');
			});
		}

		var showTitle = function()
		{
			initTitle();
			$('.animation-wrapper', cmsBannerText).each(function(i){
				$(this)
					.css('visibility', 'visible')
					.delay(32 * i)
					.queue(function(next){
						$(this).animate({width:$(this).attr('data-width')}, 256, 'easeOutExpo');
						next();
					});
			});
		}

		//banner hover
		$('.no-touch .cms-banner').hover(
			function(){
				$('.text-container .animation-wrapper', this).each(function(i){
					$(this)
						.delay(64 * (i))
						.queue(function(next){
							$(this).addClass('animate-me');
							next();
						});
				});
			},
			function(){
				$('.text-container .animation-wrapper', this).each(function(i){
					$(this)
						.delay(64 * i)
						.queue(function(next){
							$(this).removeClass('animate-me');
							next();
						});
				});
			}
		);

		setTimeout(function(){

			showTitle();
			$(window).resize(function(){ $('.animation-wrapper', cmsBannerText).css({width: 0}) });
			$(window).resize(debounce(showTitle, 400));
		}, 1000);

	});

	//set default opacity to additional img
	$('img.additional_img').css({opacity: 0, display: 'block'});

	var gridAnimateEnter = function(element)
	{
		$('.product-name, .price-box', element).each(function(i){
			$(this)
				.delay(64 * (i))
				.queue(function(next){
					$(this).addClass('animate-me');
					next();
				});
		});
		$('.actions .add-to-links li', element).each(function(i){
			$(this)
				.delay(64 * (i))
				.queue(function(next){
					$(this).addClass('animate-me');
					next();
				});
		});

		if ( $('img.additional_img', element).length ) {
			$('img.additional_img', element).stop( true, true).animate({opacity: 1}, 150, 'linear');
			$('img.regular_img', element).stop( true, true).animate({opacity: 0}, 150, 'linear');
		}
	}

	var gridAnimateLeave = function(element)
	{
		$('.product-name, .price-box', element).each(function(i){
			$(this)
				.delay(64 * (i))
				.queue(function(next){
					$(this).removeClass('animate-me');
					next();
				});
		});

		$('.actions .add-to-links li', element).each(function(i){
			$(this)
				.delay(64 * (i))
				.queue(function(next){
					$(this).removeClass('animate-me');
					next();
				});
		});

		if ( $('img.additional_img', element).length ) {
			$('img.additional_img', element).stop( true, true).animate({opacity: 0}, 150, 'linear');
			$('img.regular_img', element).stop( true, true).animate({opacity: 1}, 150, 'linear');
		}
	}

	//product hover - grid
	$('ul.products-grid li.item').bind('touchend', function(e) {
		if ( $(this).hasClass('hover') ) {
			return true;
		}
		e.preventDefault();
		$('ul.products-grid li.item').removeClass('hover');
		$(this).addClass('hover');
		gridAnimateEnter(this);
	});

	$("ul.products-grid li.item").on({
		mouseenter: function() {
			if ( !$('html').hasClass('no-touch') ) { return false; }
			$(this).toggleClass('hover');
			gridAnimateEnter(this);

		}, mouseleave: function() {
			if ( !$('html').hasClass('no-touch') ) { return false; }
			$(this).toggleClass('hover');
			gridAnimateLeave(this);
		}
	});
	//product hover - list
	$("ol.products-list li.item a.product-image").hover(function(e) {
		if ( $('img.additional_img', this).length ) {
			$('img.additional_img', this).stop( true, true).animate({opacity: 1}, 150, 'linear');
			$('img.regular_img', this).stop( true, true).animate({opacity: 0}, 150, 'linear');
		}
	}, function(e) {
		if ( $('img.additional_img', this).length ) {
			$('img.additional_img', this).stop( true, true).animate({opacity: 0}, 150, 'linear');
			$('img.regular_img', this).stop( true, true).animate({opacity: 1}, 150, 'linear');
		}
	});

	//qty
	$('.qty-container .qty-inc').click(function(){
		var $qty = $(this).parent().next(), $qtyVal;
		$qtyVal = parseInt($qty.val(), 10);
		if ( $qtyVal < 0 || !$.isNumeric($qtyVal) ) $qtyVal = 0;
		$qty.val(++$qtyVal);
		return false;
	});
	$('.qty-container .qty-dec').click(function(){
		var $qty = $(this).parent().next(), $qtyVal;
		$qtyVal = parseInt($qty.val(), 10);
		if ( $qtyVal < 2 || !$.isNumeric($qtyVal) ) $qtyVal = 2;
		$qty.val(--$qtyVal);
		return false;
	});

	//product accordion
	$('.product-tabs-container h2.tab-heading a').click(function () {
		$('.product-tabs li.active').toggleClass('active');
		$('#'+$(this).parent().attr('id').replace("product_acc_", "product_tabs_")).toggleClass('active');
		that = $(this).parent();
		if($(that).is('.active')) {
			$(that).toggleClass('active');
			$(that).next().slideToggle(function(){ $(that).scrollToMe(); });
		} else {
			$('.product-tabs-container h2.tab-heading.active').toggleClass('active').next().slideToggle();
			$(that).toggleClass('active');
			$(that).next().slideToggle(function(){ $(that).scrollToMe(); });
		}
		return false;
	});
	$('.product-tabs-container h2:first').toggleClass('active');
	$('.product-tabs a').click(function(){
		$('.product-tabs-container h2.tab-heading.active').toggleClass('active');
		$('#'+$(this).parent().attr('id').replace("product_tabs_", "product_acc_")).toggleClass('active');
	});

	//add review link on product page open review tab
	$('div.product-view p.no-rating a, div.product-view .rating-links a:last-child, .dedicated-review-box .title-container button').click(function(){
		$('#review-form').scrollToMe();
		return false;
	});
	$('div.product-view .rating-links a:first-child').click(function(){
		$('#product-customer-reviews').scrollToMe();
		return false;
	});

	if ( Athlete.login_bg != '' ) {
		jQuery('.customer-account-create .content-container, .customer-account-forgotpassword .content-container, .customer-account-resetpassword .content-container, .customer-account-login .content-container, .checkout-multishipping-login .content-container')
			.anystretch( Athlete.login_bg );
		jQuery('.customer-account-create .content-container, .customer-account-forgotpassword .content-container, ' +
		'.customer-account-resetpassword .content-container, .customer-account-login .content-container, ' +
		'.customer-account-create .main-container, .customer-account-forgotpassword .main-container, ' +
		'.customer-account-resetpassword .main-container, .customer-account-login .main-container, .checkout-multishipping-login .main-container')
			.css('background', 'transparent');
	}

	$(window).load(function(){

		$thumbContainer = $('.content-container .product-view .more-views .jcarousel-container a');
		$('span', $thumbContainer)
			.width( $thumbContainer.width()-18 )
			.height( $thumbContainer.height()-18 );

		$(window).trigger('resize');
	});

});

//actual width
(function(a){a.fn.addBack=a.fn.addBack||a.fn.andSelf;a.fn.extend({actual:function(b,l){if(!this[b]){throw'$.actual => The jQuery method "'+b+'" you called does not exist';}var f={absolute:false,clone:false,includeMargin:false};var i=a.extend(f,l);var e=this.eq(0);var h,j;if(i.clone===true){h=function(){var m="position: absolute !important; top: -1000 !important; ";e=e.clone().attr("style",m).appendTo("body");};j=function(){e.remove();};}else{var g=[];var d="";var c;h=function(){c=e.parents().addBack().filter(":hidden");d+="visibility: hidden !important; display: block !important; ";if(i.absolute===true){d+="position: absolute !important; ";}c.each(function(){var m=a(this);g.push(m.attr("style"));m.attr("style",d);});};j=function(){c.each(function(m){var o=a(this);var n=g[m];if(n===undefined){o.removeAttr("style");}else{o.attr("style",n);}});};}h();var k=/(outer)/.test(b)?e[b](i.includeMargin):e[b]();j();return k;}});})(jQuery);