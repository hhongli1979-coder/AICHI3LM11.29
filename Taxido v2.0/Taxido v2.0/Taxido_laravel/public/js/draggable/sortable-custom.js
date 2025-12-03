(function ($) {
  "use strict";
  Sortable.create(draggableMultiple, {
    group: "draggableMultiple",
    animation: 150,
  });

  $("#draggableMultiple").sortable({
    revert: true,
    animation: 150,
  });
})(jQuery);


(function ($) {
  "use strict";

  // Check if SortableJS is used correctly
  var el = document.getElementById("draggableMultiple");
  if (el) {
    Sortable.create(el, {
      group: "draggableMultiple",
      animation: 150,
    });
  }

  // Use jQuery UI's sortable if the element exists
  if ($.fn.sortable) {
    $("#draggableMultiple").sortable({
      revert: true,
      animation: 150,
    });
  } else {
    console.error('jQuery UI Sortable is not available.');
  }
})(jQuery);
