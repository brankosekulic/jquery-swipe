$(document).ready(function(){

    var translateX = 0;

    $('.s-content').on('touchmove', function(e){
        if(!e.isScrolling){
            e.preventDefault();
            $(this).css('transform', 'translate3d(' + (translateX + e.deltaX) + 'px, 0, 0)');
        }
    });

    $('.s-content').on('touchend', function(e){
        if(!e.isScrolling){
            translateX += e.deltaX;
        }
    });
});
