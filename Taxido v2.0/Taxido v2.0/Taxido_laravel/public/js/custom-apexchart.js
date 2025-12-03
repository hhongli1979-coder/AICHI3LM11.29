





/* ========================== Sales over time chart ========================== */
// var withdrawRequestoptions = {
//     series: [{
//         name: 'series1',
//         data: [10, 29, 19, 22, 12, 19, 13, 17]
//     }, {
//         name: 'series2',
//         data: [35, 41, 62, 42, 39, 48, 29, 37]
//     }],
//     chart: {
//         // height: 350,
//         height: 220,
//         type: 'area',

//         toolbar: {
//             show: false,
//         },
//     },
//     dataLabels: {
//         enabled: false
//     },
//     colors: ["#199675", "#697078"],
//     stroke: {
//         width: 2
//     },
//     xaxis: {
//         type: 'datetime',
//         categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z",
//             "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z",
//             "2018-09-19T06:30:00.000Z"
//         ]
//     },
//     grid: {
//         borderColor: '#ddd',
//         strokeDashArray: 4,
//     },

//     legend: {
//         show: false,
//     },
//     fill: {
//         gradient: {
//             enabled: true,
//             opacityFrom: 0.5,
//             opacityTo: 0
//         }
//     },
//     tooltip: {
//         x: {
//             format: 'dd/MM/yy HH:mm'
//         },
//     },
// };

// var chart = new ApexCharts(document.querySelector("#sales-over-time-chart"), options);
// chart.render();




//   var options = {
//     chart: {
//         type: 'area',
//         height: 410,
//         stacked: false,
//         toolbar: {
//             show: false,
//             tools: {
//                 download: false,
//             }
//         },
//         animations: {
//             enabled: true
//         },
//     },
//     legend: {
//         show: false,
//     },
//     dataLabels: {
//         enabled: false,
//     },
//     grid: {
//         strokeDashArray: 3,
//         position: "back",
//         row: {
//           opacity: 0.5,
//         },
//         column: {
//           opacity: 0.5,
//         },
//       },
//     series: [
//         {
//             name: 'Green Line',
//             data: [15, 32, 25, 52, 42, 50, 32, 40, 20, 60]
//         },
//         {
//             name: 'Yellow Line',
//             data: [35, 45, 32, 31, 22, 58, 48, 62, 35, 68]
//         }
//     ],
//     xaxis: {
//         categories: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00'],
//         labels: {
//             style: {
//                 fontSize:'14px',
//                 fontFamily: 'Outfit, sans-serif',
//                 fontWeight: 500,
//                 colors: '#8D8D8D',
//             },
//         },
//         axisBorder: {
//             show: false,
//         },
//     },
//     yaxis: {
//         min: 10,
//         max: 70,
//         tickAmount: 6,
//         labels: {
//             style: {
//                 fontSize:'14px',
//                 fontFamily: 'Outfit, sans-serif',
//                 fontWeight: 500,
//                 colors: '#3D434A',
//             },
//         },
//     },
//     fill: {
//         type: 'gradient',
//         gradient: {
//             shadeIntensity: 1,
//             opacityFrom: 0.7,
//             opacityTo: 0.3
//         }
//     },
//     colors: ['#199675', '#ECB238'],
//     stroke: {
//         curve: 'smooth',
//         width: 2
//     },
//     tooltip: {
//         shared: true
//     },
//     responsive: [{
//         breakpoint: 1400,
//         options: {
//           chart: {
//             height: 300
//           },
//         },
//     }],
// };
// var chart = new ApexCharts(document.querySelector("#average"), options);
// chart.render();











// var profitableCountryOptions = {
//     series: [
//       {
//         name: "Country",
//         data: [142, 195, 99, 150, 75],
//       },
//     ],
//     chart: {
//       type: "bar",
//       toolbar: {
//         show: false,
//       },
//       height: 372,
//     },
//     grid: {
//       show: true,
//       borderColor: "rgba(82, 82, 108, 0.1)",
//       strokeDashArray: 0,
//     },
//     plotOptions: {
//       bar: {
//         columnWidth: "20%",
//         borderRadius: 8,
//         borderRadiusApplication: "end",
//         distributed: true,
//         barHeight: "100%",
//       },
//     },
//     annotations: {
//       points: [
//         {
//           x: 230,
//           y: 155.5,
//           marker: {
//             size: 8,
//             fillColor: "#199675",
//             strokeColor: "var(--white)",
//             strokeWidth: 4,
//             radius: 5,
//           },
//           label: {
//             borderWidth: 0,
//             offsetY: -8,
//             text: "Germany($150k)",
//             color: ["rgba(47, 47, 59, 1)"],
//             borderRadius: 10,
//             style: {
//               fontSize: "13px",
//               fontWeight: "600",
//               fontFamily: "Rubik, sans-serif",
//               background: "#f4f4f4",
//               padding: {
//                 left: 30,
//                 right: 16,
//                 top: 10,
//                 bottom: 10,
//               },
//             },
//           },
//         },
//       ],
//     },
//     xaxis: {
//       show: false,
//       categories: [],
//       labels: {
//         show: false,
//         style: {
//           fontSize: "12px",
//           fontFamily: "Rubik, sans-serif",
//           colors: "var(--chart-text-color)",
//         },
//       },
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//       tooltip: {
//         enabled: false,
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     legend: {
//       show: false,
//     },
//     yaxis: {
//       show: true,
//       min: 0,
//       max: 250,
//       tickAmount: 5,
//       showForNullSeries: true,
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//       labels: {
//         formatter: function (val) {
//           return val + "" + "K";
//         },
//         style: {
//           fontSize: "12px",
//           fontFamily: "Rubik, sans-serif",
//           colors: "rgba(82, 82, 108, 1)",
//         },
//       },
//     },
//     colors: ["#199675", "#199675", "#ffb829", "#199675", "#fc564a"],
//     fill: {
//       type: "gradient",
//       opacity: 1,
//       gradient: {
//         shade: "light",
//         type: "vertical",
//         shadeIntensity: 0.1,
//         opacityFrom: 1,
//         opacityTo: 0.2,
//         stops: [0, 100],
//       },
//       opacity: 1,
//     },
//     // responsive: [
//     //   {
//     //     breakpoint: 1826,
//     //     options: {
//     //       annotations: {
//     //         points: [
//     //           {
//     //             x: 120,
//     //             y: 155.5,
//     //             marker: {
//     //               size: 8,
//     //               fillColor: "#199675",
//     //               strokeColor: "var(--white)",
//     //               strokeWidth: 4,
//     //               radius: 5,
//     //             },
//     //             label: {
//     //               borderWidth: 0,
//     //               offsetY: -8,
//     //               text: "Germany($150k)",
//     //               color: ["rgba(47, 47, 59, 1)"],
//     //               borderRadius: 10,
//     //               style: {
//     //                 fontSize: "13px",
//     //                 fontWeight: "600",
//     //                 fontFamily: "Rubik, sans-serif",
//     //                 background: "#f4f4f4",
//     //                 padding: {
//     //                   left: 30,
//     //                   right: 16,
//     //                   top: 10,
//     //                   bottom: 10,
//     //                 },
//     //               },
//     //             },
//     //           },
//     //         ],
//     //       },
//     //     },
//     //   },
//     //   {
//     //     breakpoint: 1661,
//     //     options: {
//     //       plotOptions: {
//     //         bar: {
//     //           borderRadius: 6,
//     //         },
//     //       },
//     //       annotations: {
//     //         points: [
//     //           {
//     //             x: 50,
//     //             y: 155.5,
//     //             marker: {
//     //               size: 6,
//     //               fillColor: "#199675",
//     //               strokeColor: "var(--white)",
//     //               strokeWidth: 3,
//     //               radius: 3,
//     //             },
//     //             label: {
//     //               borderWidth: 0,
//     //               offsetY: -8,
//     //               text: "Germany($150k)",
//     //               color: ["rgba(47, 47, 59, 1)"],
//     //               borderRadius: 10,
//     //               style: {
//     //                 fontSize: "13px",
//     //                 fontWeight: "600",
//     //                 fontFamily: "Rubik, sans-serif",
//     //                 background: "#f4f4f4",
//     //                 padding: {
//     //                   left: 20,
//     //                   right: 16,
//     //                   top: 10,
//     //                   bottom: 10,
//     //                 },
//     //               },
//     //             },
//     //           },
//     //         ],
//     //       },
//     //     },
//     //   },
//     //   {
//     //     breakpoint: 1426,
//     //     options: {
//     //       chart: {
//     //         height: 293,
//     //       },
//     //     },
//     //   },
//     //   {
//     //     breakpoint: 1400,
//     //     options: {
//     //       plotOptions: {
//     //         bar: {
//     //           columnWidth: "25%",
//     //         },
//     //       },
//     //     },
//     //   },
//     //   {
//     //     breakpoint: 1290,
//     //     options: {
//     //       chart: {
//     //         height: 212,
//     //       },
//     //       annotations: {
//     //         points: [
//     //           {
//     //             x: 167,
//     //             y: 155.5,
//     //             marker: {
//     //               size: 6,
//     //               fillColor: "#199675",
//     //               strokeColor: "var(--white)",
//     //               strokeWidth: 3,
//     //               radius: 3,
//     //             },
//     //             label: {
//     //               borderWidth: 0,
//     //               offsetY: -8,
//     //               text: "Germany($150k)",
//     //               color: ["rgba(47, 47, 59, 1)"],
//     //               borderRadius: 10,
//     //               style: {
//     //                 fontSize: "13px",
//     //                 fontWeight: "600",
//     //                 fontFamily: "Rubik, sans-serif",
//     //                 background: "#f4f4f4",
//     //                 padding: {
//     //                   left: 20,
//     //                   right: 16,
//     //                   top: 10,
//     //                   bottom: 10,
//     //                 },
//     //               },
//     //             },
//     //           },
//     //         ],
//     //       },
//     //     },
//     //   },
//     //   {
//     //     breakpoint: 1200,
//     //     options: {
//     //       chart: {
//     //         height: 300,
//     //       },
//     //       plotOptions: {
//     //         bar: {
//     //           borderRadius: 10,
//     //         },
//     //       },
//     //       annotations: {
//     //         points: [
//     //           {
//     //             x: 167,
//     //             y: 155.5,
//     //             marker: {
//     //               size: 8,
//     //               fillColor: "#199675",
//     //               strokeColor: "var(--white)",
//     //               strokeWidth: 4,
//     //               radius: 5,
//     //             },
//     //             label: {
//     //               borderWidth: 0,
//     //               offsetY: -8,
//     //               text: "Germany($150k)",
//     //               color: ["rgba(47, 47, 59, 1)"],
//     //               borderRadius: 10,
//     //               style: {
//     //                 fontSize: "13px",
//     //                 fontWeight: "600",
//     //                 fontFamily: "Rubik, sans-serif",
//     //                 background: "#f4f4f4",
//     //                 padding: {
//     //                   left: 20,
//     //                   right: 16,
//     //                   top: 10,
//     //                   bottom: 10,
//     //                 },
//     //               },
//     //             },
//     //           },
//     //         ],
//     //       },
//     //     },
//     //   },
//     //   {
//     //     breakpoint: 992,
//     //     options: {
//     //       chart: {
//     //         height: 270,
//     //       },
//     //       annotations: {
//     //         points: [
//     //           {
//     //             x: 80,
//     //             y: 155.5,
//     //             marker: {
//     //               size: 8,
//     //               fillColor: "#199675",
//     //               strokeColor: "var(--white)",
//     //               strokeWidth: 4,
//     //               radius: 5,
//     //             },
//     //             label: {
//     //               borderWidth: 0,
//     //               offsetY: -8,
//     //               text: "Germany($150k)",
//     //               color: ["rgba(47, 47, 59, 1)"],
//     //               borderRadius: 10,
//     //               style: {
//     //                 fontSize: "13px",
//     //                 fontWeight: "600",
//     //                 fontFamily: "Rubik, sans-serif",
//     //                 background: "#f4f4f4",
//     //                 padding: {
//     //                   left: 20,
//     //                   right: 16,
//     //                   top: 10,
//     //                   bottom: 10,
//     //                 },
//     //               },
//     //             },
//     //           },
//     //         ],
//     //       },
//     //     },
//     //   },
//     //   {
//     //     breakpoint: 426,
//     //     options: {
//     //       chart: {
//     //         height: 250,
//     //       },
//     //       plotOptions: {
//     //         bar: {
//     //           columnWidth: "25%",
//     //           borderRadius: 6,
//     //         },
//     //       },
//     //     },
//     //   },
//     // ],
//   };
//   // Initialize the chart
//   var profitableCountry = new ApexCharts(document.querySelector("#ticket-chart"), profitableCountryOptions);
//   profitableCountry.render();