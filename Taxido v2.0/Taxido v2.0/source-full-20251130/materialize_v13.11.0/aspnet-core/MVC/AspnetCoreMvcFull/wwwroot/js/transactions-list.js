/**
 * Transactions CRUD JS
 */

'use strict';

// Transactions DataTable initialization
document.addEventListener('DOMContentLoaded', function (e) {
  let borderColor, bodyBg, headingColor;

  borderColor = config.colors.borderColor;
  bodyBg = config.colors.bodyBg;
  headingColor = config.colors.headingColor;

  var toastElements = document.querySelectorAll('.toast');

  if (toastElements) {
    toastElements.forEach(function (element) {
      var toast = new bootstrap.Toast(element);
      toast.show();
    });
  }

  const dt_user_table = document.querySelector('#transactionsTable');

  // Transactions List DataTable Initialization (For Transactions CRUD Page)
  if (dt_user_table) {
    const dt_user = new DataTable(dt_user_table, {
      order: [[1, 'asc']],
      layout: {
        topStart: {
          rowClass: 'row m-3 my-0 mt-md-2 justify-content-between',
          features: [
            {
              pageLength: {
                menu: [7, 10, 20, 50, 70, 100],
                text: '_MENU_'
              }
            }
          ]
        },
        topEnd: {
          features: [
            {
              search: {
                placeholder: 'Search User',
                text: '_INPUT_'
              }
            },
            {
              buttons: [
                {
                  extend: 'collection',
                  className: 'btn btn-label-secondary dropdown-toggle',
                  text: '<i class="icon-base ri ri-download-line me-2 icon-sm"></i>Export',
                  buttons: [
                    {
                      extend: 'print',
                      title: 'Users',
                      text: '<i class="icon-base ri ri-printer-line me-2" ></i>Print',
                      className: 'dropdown-item',
                      exportOptions: {
                        columns: [1, 2, 3, 4, 5],
                        // prevent avatar to be print
                        format: {
                          body: function (inner, coldex, rowdex) {
                            if (inner.length <= 0) return inner;

                            // Check if inner is HTML content
                            if (inner.indexOf('<') > -1) {
                              const parser = new DOMParser();
                              const doc = parser.parseFromString(inner, 'text/html');

                              // Get all text content
                              let text = '';

                              // Handle specific elements
                              const userNameElements = doc.querySelectorAll('.user-name');
                              if (userNameElements.length > 0) {
                                userNameElements.forEach(el => {
                                  // Get text from nested structure
                                  const nameText =
                                    el.querySelector('.fw-medium')?.textContent ||
                                    el.querySelector('.d-block')?.textContent ||
                                    el.textContent;
                                  text += nameText.trim() + ' ';
                                });
                              } else {
                                // Get regular text content
                                text = doc.body.textContent || doc.body.innerText;
                              }

                              return text.trim();
                            }

                            return inner;
                          }
                        }
                      },
                      customize: function (win) {
                        win.document.body.style.color = config.colors.headingColor;
                        win.document.body.style.borderColor = config.colors.borderColor;
                        win.document.body.style.backgroundColor = config.colors.bodyBg;
                        const table = win.document.body.querySelector('table');
                        table.classList.add('compact');
                        table.style.color = 'inherit';
                        table.style.borderColor = 'inherit';
                        table.style.backgroundColor = 'inherit';
                      }
                    },
                    {
                      extend: 'csv',
                      title: 'Users',
                      text: '<i class="icon-base ri ri-file-text-line me-2" ></i>Csv',
                      className: 'dropdown-item',
                      exportOptions: {
                        columns: [1, 2, 3, 4, 5],
                        format: {
                          body: function (inner, coldex, rowdex) {
                            if (inner.length <= 0) return inner;

                            // Parse HTML content
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(inner, 'text/html');

                            let text = '';

                            // Handle user-name elements specifically
                            const userNameElements = doc.querySelectorAll('.user-name');
                            if (userNameElements.length > 0) {
                              userNameElements.forEach(el => {
                                // Get text from nested structure - try different selectors
                                const nameText =
                                  el.querySelector('.fw-medium')?.textContent ||
                                  el.querySelector('.d-block')?.textContent ||
                                  el.textContent;
                                text += nameText.trim() + ' ';
                              });
                            } else {
                              // Handle other elements (status, role, etc)
                              text = doc.body.textContent || doc.body.innerText;
                            }

                            return text.trim();
                          }
                        }
                      }
                    },
                    {
                      extend: 'excel',
                      text: '<i class="icon-base ri ri-file-excel-line me-2"></i>Excel',
                      className: 'dropdown-item',
                      exportOptions: {
                        columns: [1, 2, 3, 4, 5],
                        format: {
                          body: function (inner, coldex, rowdex) {
                            if (inner.length <= 0) return inner;

                            // Parse HTML content
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(inner, 'text/html');

                            let text = '';

                            // Handle user-name elements specifically
                            const userNameElements = doc.querySelectorAll('.user-name');
                            if (userNameElements.length > 0) {
                              userNameElements.forEach(el => {
                                // Get text from nested structure - try different selectors
                                const nameText =
                                  el.querySelector('.fw-medium')?.textContent ||
                                  el.querySelector('.d-block')?.textContent ||
                                  el.textContent;
                                text += nameText.trim() + ' ';
                              });
                            } else {
                              // Handle other elements (status, role, etc)
                              text = doc.body.textContent || doc.body.innerText;
                            }

                            return text.trim();
                          }
                        }
                      }
                    },
                    {
                      extend: 'pdf',
                      title: 'Users',
                      text: '<i class="icon-base ri ri-file-pdf-line me-2"></i>Pdf',
                      className: 'dropdown-item',
                      exportOptions: {
                        columns: [1, 2, 3, 4, 5],
                        format: {
                          body: function (inner, coldex, rowdex) {
                            if (inner.length <= 0) return inner;

                            // Parse HTML content
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(inner, 'text/html');

                            let text = '';

                            // Handle user-name elements specifically
                            const userNameElements = doc.querySelectorAll('.user-name');
                            if (userNameElements.length > 0) {
                              userNameElements.forEach(el => {
                                // Get text from nested structure - try different selectors
                                const nameText =
                                  el.querySelector('.fw-medium')?.textContent ||
                                  el.querySelector('.d-block')?.textContent ||
                                  el.textContent;
                                text += nameText.trim() + ' ';
                              });
                            } else {
                              // Handle other elements (status, role, etc)
                              text = doc.body.textContent || doc.body.innerText;
                            }

                            return text.trim();
                          }
                        }
                      }
                    },
                    {
                      extend: 'copy',
                      title: 'Users',
                      text: '<i class="icon-base ri ri-file-copy-line me-2" ></i>Copy',
                      className: 'dropdown-item',
                      exportOptions: {
                        columns: [1, 2, 3, 4, 5],
                        format: {
                          body: function (inner, coldex, rowdex) {
                            if (inner.length <= 0) return inner;

                            // Parse HTML content
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(inner, 'text/html');

                            let text = '';

                            // Handle user-name elements specifically
                            const userNameElements = doc.querySelectorAll('.user-name');
                            if (userNameElements.length > 0) {
                              userNameElements.forEach(el => {
                                // Get text from nested structure - try different selectors
                                const nameText =
                                  el.querySelector('.fw-medium')?.textContent ||
                                  el.querySelector('.d-block')?.textContent ||
                                  el.textContent;
                                text += nameText.trim() + ' ';
                              });
                            } else {
                              // Handle other elements (status, role, etc)
                              text = doc.body.textContent || doc.body.innerText;
                            }

                            return text.trim();
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  text: '<i class="icon-base ri ri-add-line icon-sm me-0 me-sm-2"></i><span class="d-none d-sm-inline-block">Add New User</span>',
                  className: 'add-new btn btn-primary',
                  action: function (e, dt, button, config) {
                    window.location.href = '/Transactions/Add';
                  }
                }
              ]
            }
          ]
        },
        bottomStart: {
          rowClass: 'row mx-3 mb-4 justify-content-between',
          features: [
            {
              info: {
                text: 'Showing _START_ to _END_ of _TOTAL_ entries'
              }
            }
          ]
        },
        bottomEnd: 'paging'
      },
      displayLength: 7,
      language: {
        paginate: {
          next: '<i class="icon-base ri ri-arrow-right-s-line scaleX-n1-rtl icon-22px"></i>',
          previous: '<i class="icon-base ri ri-arrow-left-s-line scaleX-n1-rtl icon-22px"></i>',
          first: '<i class="icon-base ri ri-skip-back-mini-line scaleX-n1-rtl icon-22px"></i>',
          last: '<i class="icon-base ri ri-skip-forward-mini-line scaleX-n1-rtl icon-22px"></i>'
        }
      },
      responsive: true,
      // For responsive popup
      rowReorder: {
        selector: 'td:nth-child(2)'
      },
      // For responsive popup button and responsive priority for user name
      columnDefs: [
        {
          // For Responsive Popup Button (plus icon)
          className: 'control',
          searchable: false,
          orderable: false,
          responsivePriority: 2,
          targets: 0,
          render: function (data, type, full, meta) {
            return '';
          }
        },
        {
          // For Id
          targets: 1,
          responsivePriority: 4
        },
        {
          // For User Name
          targets: 2,
          responsivePriority: 3
        },
        {
          // For Email
          targets: 3,
          responsivePriority: 9
        },
        {
          // For Is Verified
          targets: 4,
          responsivePriority: 5
        },
        {
          // For Contact Number
          targets: 5,
          responsivePriority: 7
        },
        {
          // For Role
          targets: 6,
          responsivePriority: 6
        },
        {
          // For Plan
          targets: 7,
          responsivePriority: 8
        },
        {
          // For Actions
          targets: -1,
          searchable: false,
          orderable: false,
          responsivePriority: 1
        }
      ],
      responsive: {
        details: {
          display: $.fn.dataTable.Responsive.display.modal({
            header: function (row) {
              var data = row.data();
              var $content = $(data[2]);
              // Extract the value of data-user-name attribute (User Name)
              var userName = $content.find('[class^="user-name-full-"]').text();
              return 'Details of ' + userName;
            }
          }),
          type: 'column',
          renderer: function (api, rowIdx, columns) {
            var data = $.map(columns, function (col, i) {
              // Exclude the last column (Action)
              if (i < columns.length - 1) {
                return col.title !== ''
                  ? '<tr data-dt-row="' +
                      col.rowIndex +
                      '" data-dt-column="' +
                      col.columnIndex +
                      '">' +
                      '<td>' +
                      col.title +
                      ':' +
                      '</td> ' +
                      '<td>' +
                      col.data +
                      '</td>' +
                      '</tr>'
                  : '';
              }
              return '';
            }).join('');

            return data ? $('<table class="table"/><tbody />').append(data) : false;
          }
        }
      }
    });
  }
});

// Filter Form styles to default size after DataTable initialization
setTimeout(() => {
  const elementsToModify = [
    { selector: '.dt-buttons .btn', classToRemove: 'btn-secondary' },
    { selector: '.dt-length .form-select', classToAdd: 'ms-0' },
    { selector: '.dt-length', classToAdd: 'mb-md-4 mb-0' },
    {
      selector: '.dt-layout-end',
      classToRemove: 'justify-content-between',
      classToAdd: 'd-flex gap-md-4 justify-content-md-between justify-content-center gap-md-2 flex-wrap mt-0'
    },
    { selector: '.dt-layout-start', classToAdd: 'mt-md-0 mt-5' },
    {
      selector: '.dt-layout-start .dt-buttons',
      classToAdd: 'd-md-flex d-block gap-4 justify-content-center'
    },
    {
      selector: '.dt-layout-end .dt-buttons',
      classToAdd: 'd-md-flex d-block gap-4 mb-md-0 mb-5 justify-content-center'
    },
    { selector: '.dt-layout-table', classToRemove: 'row mt-2' },
    { selector: '.dt-layout-full', classToRemove: 'col-md col-12' },
    { selector: '.dt-layout-full .table', classToAdd: 'table-responsive' }
  ];

  // Delete record
  elementsToModify.forEach(({ selector, classToRemove, classToAdd }) => {
    document.querySelectorAll(selector).forEach(element => {
      if (classToRemove) {
        classToRemove.split(' ').forEach(className => element.classList.remove(className));
      }
      if (classToAdd) {
        classToAdd.split(' ').forEach(className => element.classList.add(className));
      }
    });
  });
}, 100);
