// We declare the multistep page as an input binding that returns the current step

  // Create generic binding
  var multiStepBinding = new Shiny.InputBinding();

  var MULTISTEP_CLASS = ".multiStepPage-container";

  // Element finder
  multiStepBinding.find = function(scope) {
    return $(scope).find(MULTISTEP_CLASS);
  };

  // Get active (current) step
  multiStepBinding.getValue = function(el) {

    var $el = $(el);
    var id = $el.attr("id");
    var tracker = MultiStepPage.ActiveTrackers[id];

    if( tracker )
      return tracker.getCurrent() + 1;
    else
      return NULL;
  };

    // Suscribe function: Calls callback function when a change oocurs (not rate policy applies)
  multiStepBinding.subscribe = function(el, callback) {
    $(el).on('change.multiStepBinding', function(event) {
      callback(false);
    });
  };

  // Unsuscribe
  multiStepBinding.unsubscribe = function(el) {
    $(el).off('.multiStepBinding');
  };

  // Function to call when a message from the server
  // is received. To chenge current step.
  multiStepBinding.receiveMessage = function(el, data) {
      var $el = $(el);
      var id = $el.attr("id");
      var tracker = MultiStepPage.ActiveTrackers[id];

      if(data.action == "goto")
        tracker.gotoPage(data.value);
      else if(data.action == "fwd")
        tracker.allowFwd = data.value;
      else if(data.action == "back")
        tracker.allowBack = data.value;
  };

  // Get current state?
  multiStepBinding.getState = function(el){
      return(0);
  };

  // Initializer
  multiStepBinding.initialize = function(el) {

    var $el = $(el);
    var id = $el.attr("id");

    // Create tracker
    var tracker = new MultiStepPage.Tracker(el);

    // Initialzie
    tracker.init();

    // Add to active tracker
    MultiStepPage.ActiveTrackers[id] = tracker;

  };

  // Register our new binding
  Shiny.inputBindings.register(multiStepBinding, "shiny.multiStepPage");