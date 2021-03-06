var MultiStepPage;

(function(MultiStepPage){

  // Object with active trackers by ID
  MultiStepPage.ActiveTrackers = {};

  var Tracker = (function() {

      // Cache this
      var self;

      // Main tab
      var main ;
      var id ;

      // Pages
      var pages ;
      var pageContainer;
      var pagesCount = 0;

      // progressbox
      var boxes ;

      // Active page
      var current ;

      // Animation status
      var isAnimating = false;
      var endCurrPage = false;
      var endNextPage = false;

    /** Constructor **/
    function Tracker( el ){

      self = this;

      // Main tab
      main = $(el);
      id = main.attr("id");

      // Pages
      pages = main.find('div.pt-page');
      pageContainer = main.find('div.pt-page-container');
      pagesCount = pages.length;

      // progressbox
      boxes = main.find('div.progresstrack-box.clickable');

      // Active page
      current = 0;

      // Animation status
      isAnimating = false;
      endCurrPage = false;
      endNextPage = false;

      // Event names
      this.animEndEventName = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd';
      this.allowFwd = true;
      this.allowBack = true;

    }

/*****************************************
            Public functions
*********************************************/

    /** Initialize tracker **/
    Tracker.prototype.init = function(){

      // Save original classes for each page
      pages.each(function () {
        var $page = $(this);
        $page.data('originalClassList', $page.attr('class'));
      });

      // Set current class for (current page)
      pages.eq(current).addClass('pt-page-current');

      // Set box status
      updateBoxes();
      updateControls();

      // Add listeners to tracker boxes
      boxes.on('click', function () {
        if (isAnimating) {
          return false;
        }

        var $box = $(this);
        var step = parseInt($box.attr("step-num"));

        if( (step > current) && !self.allowFwd ) return false;
        else if( (step < current) && !self.allowBack ) return false;

        self.gotoPage(step);
      });

      // Also add listeners to controls
      main.find(".control.fwd").on('click', function(){
        if (isAnimating || !self.allowFwd )
          return false;
        else
          self.next();
      });

      main.find(".control.back").on('click', function(){
        if (isAnimating || !self.allowBack )
          return false;
        else
          self.previous();
      });

      updatePageMaxHeight();

    };

    Tracker.prototype.getCurrent = function(){
      return current;
    };

    /** Go to given page */
    Tracker.prototype.gotoPage = function (step){

        // Checking
        if (step < 0 || step >= pagesCount || step == current) return false;

        // Avouid double-calls
        if (isAnimating) {
          return false;
        }
        isAnimating = true;

        // Get current page
        var $currPage = pages.eq(current);

        // Select animations
        var outClass, inClass;

        // Moving back
        if (current > step) {
          outClass = 'pt-page-moveToRightEasing pt-page-ontop';
          inClass = 'pt-page-moveFromLeft';
        }
        // Forward
        else {
          outClass = 'pt-page-moveToLeftEasing pt-page-ontop';
          inClass = 'pt-page-moveFromRight';
        }

        // update current
        current = step;

        // Get next page and set it to current
        var $nextPage = pages.eq(current).addClass('pt-page-current');

        updatePageMaxHeight();

        // Start animation
        animate($currPage, $nextPage, outClass, inClass);

        // Update tracker
        updateBoxes();

        // Update controls
        updateControls();
    };


    /* Move to next page */
    Tracker.prototype.next = function (){ this.gotoPage(current+1) };

    /* Move to previous page */
    Tracker.prototype.previous = function (){ this.gotoPage(current-1) };

    // Force height update
    Tracker.prototype.updatePageHeight= function(){ updatePageMaxHeight() };

/****************************
 * PRIVATE FUNCTIONS
 * ***************************/

    // Recompute page height
    function updatePageMaxHeight() {

        var max = -1;
        // Just in case, recompute max
        pages.each(function() {
          var h = $(this).height();
          max = h > max ? h : max;
        });
        // +20 (margins)
        pageContainer.height(max+20);
    }

    /* Animate page transition */
    function animate(currentPage, nextPage, outClass, inClass) {

        // Add class to current page and set an animation end event
        currentPage.addClass(outClass).on(self.animEndEventName, function () {
          currentPage.off(self.animEndEventName); // Unbind
          endCurrPage = true; // Current page ended
          if (endNextPage) { // Other page has ended already
            onEndAnimation(currentPage, nextPage);
          }
        });

      // Same to the next page
      nextPage.addClass(inClass).on(self.animEndEventName, function () {
        nextPage.off(self.animEndEventName); // Unbind
        endNextPage = true; // Next page ended
        if (endCurrPage) { // Other page has ended already
          onEndAnimation(currentPage, nextPage);
        }
      });

    }

    // Call when animation ends
    function onEndAnimation($outpage, $inpage) {
      endCurrPage = false;
      endNextPage = false;
      resetPage($outpage, $inpage);
      isAnimating = false;
      // Trigger change event
      main.trigger("change");

    }

  // Reset original classes for animated pages once animation has ended
  function resetPage($outpage, $inpage) {
    $outpage.attr('class', $outpage.data('originalClassList'));
    $inpage.attr('class', $inpage.data('originalClassList') + ' pt-page-current');
  }

  // Update tracking boxes
  function updateBoxes(){

     boxes.each( function(index){

      // Get element
      var $this = $(this);
      var step = $this.attr("step-num");

      // Remove any past / future / current
      $this.removeClass("past future current");

      // Do the same with the icon
      $this.find(".progresstrack-icon").removeClass("past future current");

      // Now set the appropiate class
      var computedClass = '';
      if( step < current ) computedClass = "past";
      else if (step == current ) computedClass = "current";
      else computedClass = "future";

      $this.find(".progresstrack-icon").addClass(computedClass);
      $this.addClass(computedClass);
    });
  }

  function updateControls(){

    if(current === 0){
      main.find(".control.back").each( function(i,e){$(e).fadeOut(350)} );
      main.find(".control.fwd").each( function(i,e){if(! ($(e).is(":visible") ))$(e).fadeIn(350)} );
    }
    else if ( current == (pagesCount -1) ){
      main.find(".control.fwd").each( function(i,e){$(e).fadeOut(350)} );
      main.find(".control.back").each( function(i,e){if(! ($(e).is(":visible") ))$(e).fadeIn(350)} );
    }
    else{
      main.find(".control.fwd").each( function(i,e){if(! ($(e).is(":visible") ))$(e).fadeIn(350)} );
      main.find(".control.back").each( function(i,e){if(! ($(e).is(":visible") ))$(e).fadeIn(350)} );
    }

  }



  return Tracker;

  })(); // End TRACKER definition

  MultiStepPage.Tracker = Tracker;

})(MultiStepPage || (MultiStepPage = {}));
