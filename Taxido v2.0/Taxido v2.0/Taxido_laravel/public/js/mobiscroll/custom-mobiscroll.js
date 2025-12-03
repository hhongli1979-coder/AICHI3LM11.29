// $(function () {

// mobiscroll.datepicker('#time-slot')
//     .mobiscroll()
//     .datepicker({

//         controls: ['calendar',
//             'timegrid'], // More info about controls: https://mobiscroll.com/docs/jquery/datepicker/api#opt-controls
//         display: 'inline', // Specify display mode like: display: 'bottom' or omit setting to use default
//         dateFormat: 'dd-mm-yyyy',
//         min: new Date()
//     });

mobiscroll.datepicker("#time-slot", {
    controls: ["calendar", "timegrid"], // More info about controls: https://mobiscroll.com/docs/javascript/datepicker/api#opt-controls
    display: 'inline', // Specify display mode like: display: 'bottom' or omit setting to use default
    dateFormat: 'dd-mm-yyyy',
    min: new Date()
});

mobiscroll.datepicker(".mobiscroll-timeslot", {
    controls: ["calendar", "timegrid"], // More info about controls: https://mobiscroll.com/docs/javascript/datepicker/api#opt-controls
    display: 'inline', // Specify display mode like: display: 'bottom' or omit setting to use default
    dateFormat: 'dd-mm-yyyy',
    min: new Date()
});


// $('.mobiscroll-timeslot')
//     .mobiscroll()
//     .datepicker({
//         controls: ['calendar',
//             'timegrid'], // More info about controls: https://mobiscroll.com/docs/jquery/datepicker/api#opt-controls
//         display: 'inline', // Specify display mode like: display: 'bottom' or omit setting to use default
//         min: new Date()
//     });
// });

