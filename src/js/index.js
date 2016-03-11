global.jQuery = global.$ = require('jquery');
global.videojs = require('video.js/dist/video.js');
var videojs_bg = require('videojs-background/lib/videojs-Background.js');
var TweenMax = require('gsap/src/uncompressed/TweenMax.js');
var animation_gsap = require('scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap.js');
var indicators = require('scrollmagic/scrollmagic/uncompressed/plugins/debug.addIndicators.js');
var ScrollMagic = require('scrollmagic');
require('magnific-popup');
require('./thescene_embed.js'); 





var neda_video = null
var title_video = null 


$(document).ready(function($){ 
  //initialize background video
  title_video = videojs('bg-video')
  title_video.Background({
    autoPlay: true,
    container: 'opening-video-container'
  })
  // neda_video = videojs('neda-video')
  // neda_video.Background({
  //   autoPlay: false,
  //   volume: 1,
  //   container: 'neda-video-container'
  // })

  slide_show_settings= {
    delegate: 'a',
    type: 'image',
    image: {
      titleSrc: function (item) {
        return item.el.attr('title') + '<small>Image by '+item.el.attr('data-author')+'</small>'
      }
    },
    gallery: {
      enabled: true,
      preload:[0,5],
      navigateByImgClick: true
    }
  }
  $('#lesvos-slideshow').magnificPopup(slide_show_settings);
  $('#portrait-slideshow').magnificPopup(slide_show_settings);
})

var controller = new ScrollMagic.Controller({
  // addIndicators: true,
  globalSceneOptions: {
    triggerHook: 'onLeave'
  }
});
//-----------------------------------------------------------------------------------
// Callbacks

global.iframeLoaded = function () {
  var iw = $('.customEmbed').width();
  $('.customEmbed').height(iw/1.75);
}


var subtitles = []
for (var i=1; i<34; i++) {
  var img_url = 'assets/landing/landing' + i + '.jpg';
  var subtitle = subtitles[i] || 'Subtitle'
  var html = "<a style='display:none' href='"+img_url+"' title='"+subtitle+"' data-author='Marie-Helene Carleton'><img class='img-right img-150 slide-show-img' src='"+img_url+"' /><span>Click Here for Full Slideshow</span></a>"
  $('#lesvos-slideshow').append(html)
  $('#lesvos-slideshow a').first().show()
}

// var nedaVolume = function (e) {
//   var progress = e.progress * 3
//   var volume;
//   if (progress > 2) {//fade_out
//     volume = 1 - (progress - 2)
//     if ($('#neda-image').is(':visible')) {
//       $('#neda-image').hide()
//       $('#rafat-image').show()
//     }
//   } else if (progress > 1) {//video_is_up
//     volume = 1
//   } else {//fade_in
//     volume = progress
//     if ($('#rafat-image').is(':visible')) {
//       $('#rafat-image').hide()
//       $('#neda-image').show()
//     }
//   }
//   neda_video.volume(volume)

// }

var stickyAnimations = function (e) {
  if (e.state == 'AFTER') {
    $(e.target.triggerElement()).css('position','fixed')
  }
}



//-----------------------------------------------------------------------------------
// Tweens


var openingTimeline = new TimelineMax()
  .to('#opening-text p', .5, {opacity: 1})
  .to('#opening-text', 2, {opacity: 1})
  .to('#opening-video-container', .5, {opacity: 0})
  .to('#opening', 2, {opacity: 0})
// var nedaPageTimeline = new TimelineMax()
//   .to("#neda-video-container", 1, {opacity: 1}, 0)
//   .to("#neda-video-container", 1, {opacity: 0}, 2)







//-----------------------------------------------------------------------------------
// Scenes

var scenes = {
  'opening': {
    duration: '300%',
    setTween: openingTimeline,
    events:{leave: stickyAnimations}
  },
  'vanity-fair': {
    duration: '100%',
    events:{leave: stickyAnimations}
  },
  'neda-video-page': {
    // setTween: nedaPageTimeline,
    duration: '100%',
    events:{leave: stickyAnimations}
    // events: {
    //   enter: function(){neda_video.play()},
    //   leave: function(e){
    //     stickyAnimations(e);
    //     neda_video.pause();
    //   },
    //   progress: nedaVolume
    // }
  }
}

$('.panel').each(function(){
  id = $(this).attr('id');
  if (!scenes[id]) {
    scenes[id] = {}
  }
})




var scrollingPin = function (scene, panel_id) {
  $(panel_id).addClass('keeps-scrolling')
  
  var keepsScrolling = function () {
    var h = $(panel_id).height();
    var wh = $(window).height();
    if (h - wh > 0) {
      scene.offset(h - wh)
    }
  }
  
  var oldResize = window.onresize;
  window.onresize = function () {
    if (oldResize){oldResize()};
    keepsScrolling();
  }
  $(document).ready(function(){
    keepsScrolling()
  });
}




for (var panel_id in scenes) {
  var scene_settings = scenes[panel_id];
  panel_id = '#' + panel_id
  var scene = new ScrollMagic.Scene()
    .triggerElement(panel_id)
    .addTo(controller);



   
  for (var setting in scene_settings) {
    
    if (setting =='events') {
      var events = scene_settings['events']
      for (var event_name in events) {
        scene.on(event_name, events[event_name])
      }
    } else {
      if (scene[setting]) {
        scene[setting](scene_settings[setting]);
      }
    }
  }

  if(!scene_settings.noPin) {
    scene.setPin(panel_id)
    scrollingPin(scene,panel_id)
  }

  if (panel_id == '#neda-video-page') {
    
    global.neda = scene
  }
  var elem = $(panel_id);
  if($(elem).height() < 500){
    $(elem).prepend('<div style="position:relative;height:100%"></div>')      
  }
  
}


//-----------------------------------------------------------------------------------
// Portraits
var subtitles = []
for (var i=1; i<21; i++) {
  var img_url = 'assets/portraits/portrait' + i + '.jpg';
  var subtitle = subtitles[i] || 'Subtitle'
  var html = "<a href='"+img_url+"' title='"+subtitle+"' data-author='Micah Garen'><div class='gallery-image-wrapper'><div class='gallery-dummy'></div><div class='gallery-image' style='background-image:url("+img_url+")'></div></div></a>"
  $('#portrait-slideshow').append(html)
}