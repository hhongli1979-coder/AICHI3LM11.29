// Custom-flatpickr JS
(function () {
  // 1. Default Date
  flatpickr("#datetime-local", {
    dateFormat: "d-m-Y"
  });

  flatpickr("#date-range", {
      mode: "range",
      minDate: "today",
      dateFormat: "d-m-Y"
  })

  //2.Time-picker
  flatpickr("#time-picker", {
    enableTime: true,
    minDate: "today",
    noCalendar: true,
    timeFormat: 'HH:ii'
  });

  flatpickr("#time-picker1", {
    enableTime: true,
    minDate: "today",
    noCalendar: true,
     timeFormat: 'HH:ii'
  });

})();


