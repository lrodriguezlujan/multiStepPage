var MultiStepPage;

(function(MultiStepPage){

  // Object with active trackers by ID
  var ActiveTrackers = {};

  var Tracker = (function() {

    /** Constructor **/
    function Tracker( el ){

      var self = this;

      // Main tab
      var main = $(el);
      var id = main.attr("id");

      // Pages
      var pages = this.main.find('div.pt-page');
      var pagesCount = this.pages.length;

      // progressbox
      var boxes = this.main.find('div.progresstrack-box.clickable');

      // Active page
      var current = 0;

      // Animation status
      var isAnimating = false;
      var endCurrPage = false;
      var endNextPage = false;

      // Event names
      this.animEndEventName = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd';

    }

/*****************************************
            Public functions
*********************************************/

    /** Initialize tracker **/
    Tracker.prototype.init = function(){

      // Save original classes for each page
      this.pages.each(function () {
        var $page = $(this);
        $page.data('originalClassList', $page.attr('class'));
      });

      // Set current class for (current page)
      this.pages.eq(current).addClass('pt-page-current');

      // Set box status
      updateBoxes();

      // Add listeners to tracker boxes
      this.boxes.on('click', function () {
        if (isAnimating) {
          return false;
        }
        var $box = $(this);

        gotoPage(parseInt($box.attr("step-num")));
      });

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
        if (current > num) {
          outClass = 'pt-page-moveToRightEasing pt-page-ontop';
          inClass = 'pt-page-moveFromLeft';
        }
        // Forward
        else {
          outClass = 'pt-page-moveToLeftEasing pt-page-ontop';
          inClass = 'pt-page-moveFromRight';
        }

        // update current
        current = num;

        // Get next page and set it to current
        var $nextPage = pages.eq(current).addClass('pt-page-current');

        // Start animation
        animate($currPage, $nextPage, outClass, inClass);

        // Update tracker
        updateBoxes();
    };


    /* Move to next page */
    Tracker.prototype.next = function (){ this.gotoPage(current+1) };

    /* Move to previous page */
    Tracker.prototype.previous = function (){ this.gotoPage(current-1) };


/****************************
 * PRIVATE FUNCTIONS
 * ***************************/

    /* Animate page transition */
    function animate(currentPage, nextPage, outClass, inClass) {

        var self = this; // Cachke this

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

      // Remove any past / future / current
      $this.removeClass("past future current");

      // Do the same with the icon
      $this.find(".progresstrack-icon").removeClass("past future current");

      // Now set the appropiate class
      var computedClass = '';
      if( index < current ) computedClass = "past";
      else if (index == current ) computedClass = "current";
      else computedClass = "future";

      $this.find(".progresstrack-icon").addClass(computedClass);
      $this.addClass(computedClass);
    });
  }

  return Tracker;

  })(); // End TRACKER definition

  MultiStepPage.Tracker = Tracker;

})(MultiStepPage || (MultiStepPage = {}));