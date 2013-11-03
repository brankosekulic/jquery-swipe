/*
 * JQuery.Swipe.js
 * author: Branko Sekulic
 *
 * Detecting if scroll is horizontal or vertical, and calculating deltaX.
 * Event object is enhanced with two additional params:
 *  e.isScrolling - true is scroll is vertical
 *  e.deltaX - difference between start and end X coordinate
 *  e.deltaY - difference between start and end Y coordinate
 *
 * @example:
 * $('#swipe-area').on('touchstart', function(e){
 *      // do some initialization here
 * });
 *
 * $('#swipe-area').on('touchmove', function(e){
 *      console.log(e.isScrolling);
 *      console.log(e.deltaX);
 * });
 *
 * $('#swipe-area').on('touchend', function(e){
 *      console.log(e.isScrolling);
 *      console.log(e.deltaX);
 * });
 *
 * Copyright Vast.com
 */
(function($) {

    var events = ['touchstart', 'touchmove', 'touchend'],
        Swipe  = function() {

            this.inited = {
                touchstart: false,
                touchmove: false,
                touchend: false
            };
        };

    Swipe.prototype = {

        applyValues: function(e){

            e.isScrolling = this.isScrolling;
            e.deltaX = this.deltaX;
            e.deltaY = this.deltaY;

            return e;
        },

        touchstart: function(e) {

            var originalEvent = e.originalEvent;

            this.start = {
                // get touch coordinates for delta calculations in onTouchMove
                pageX: originalEvent.touches[0].pageX,
                pageY: originalEvent.touches[0].pageY
            };

            // used for testing first onTouchMove event
            this.isScrolling = undefined;
            // reset delta
            this.deltaX = 0;
            this.deltaY = 0;

            return this.applyValues(e);
        },

        touchmove: function(e) {

            var originalEvent = e.originalEvent;

            // ensure swiping with one touch and not pinching
            if(originalEvent.touches.length > 1 || originalEvent.scale && originalEvent.scale !== 1) return;

            this.deltaX = originalEvent.touches[0].pageX - this.start.pageX;
            this.deltaY = originalEvent.touches[0].pageY - this.start.pageY;

            // determine if scrolling test has run - one time test
            if ( typeof this.isScrolling == 'undefined') {
                this.isScrolling = !!( this.isScrolling || Math.abs(this.deltaX) < Math.abs(this.deltaY) );
            }

            return this.applyValues(e);
        },

        touchend: function(e) {

            return this.applyValues(e);
        }
    };

    $.each(events, function(index, value){

        $.event.special[value] = {

            add: function( handleObj ) {

                var $target = $(this),
                    swipe = $target.data('swipe'),
                    old_handler,
                    new_handler;

                // Allpying Swipe instance to element
                if(!swipe){
                    swipe = new Swipe();
                    $target.data('swipe', swipe);
                }

                // make sure handler gets overridden only once
                if(!swipe.inited[value]){

                    // This will reference the bound event handler.
                    old_handler = handleObj.handler;
                    new_handler = function(event) {
                        // Modify event object here!
                        event = swipe[value](event);
                        // Call the originally-bound event handler and return its result.
                        return old_handler.apply( this, arguments );
                    };

                    handleObj.handler = new_handler;
                    swipe.inited[value] = true;
                }

                // make sure all events are attached, since they depends on each other
                $.each(events, function(i, val){
                    if(!swipe.inited[val]){
                        $target.on(val, function(e){});
                    }
                });
            }
        };
    });
})(jQuery);