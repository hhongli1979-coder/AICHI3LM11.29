"use strict";

$('#selectMenu').change(function () {
  $('#selectMenuBtn').prop('disabled', $(this).val() === '0');
});

var item_data = [];

function getMenuItems() {
  $.ajax({
    url: getMenuItemsURL,
    type: 'POST',
    data: {
      menu: new URL(window.location.href).searchParams.get("menu")
    },
    dataType: 'html',
    success: function (response) {
      $('#menu-to-edit').html(response);
    },
    error: function (xhr, status, error) {
      console.error(error);
    }
  });
}

getMenuItems();

function getMenus(element) {
  item_data = [];
  $('#spinsavemenu').show();
  var spinner = $('<span class="spinner-border spinner-border-sm"></span>');
  $(element).append(spinner);

  $('#menu-to-edit li').each(function (index) {
    var depth = $(this).attr('class').split(' ').find(cls => cls.startsWith('menu-item-depth-'));
    depth = depth ? parseInt(depth.split('-')[3]) : 0;
    var id = this.id.split('-');
    var text_item_edit = $(this).find('.item-edit').text();
    var padre = text_item_edit.split('|').slice(-2, -1)[0] || 0;
    item_data.push({
      depth: depth,
      id: id[2],
      parent: padre,
      sort: index,
    });
  });

  updateItem();
  actualizedMenu(spinner);
}

function addCustomMenu() {
  var itemLabel = $('#custom-menu-item-name').val();
  var itemRoute = $('#custom-menu-item-route').val();
  var itemRole = $('#custom-menu-item-role').val();
  var itemIcon = $('#custom-menu-item-icon').val();
  if (itemLabel && itemRoute) {
    $('#spincustomu').show();
    var url = new URL(window.location.href);
    $.ajax({
      data: JSON.stringify([{
        label: itemLabel,
        route: itemRoute,
        role: itemRole,
        icon: itemIcon,
        menu: url.searchParams.get("menu")
      }]),
      "_token": "{{ csrf_token() }}",
      url: addCustomMenuURL,
      type: 'POST',
      contentType: 'application/json',
      success: getMenuItems,
      complete: function () {
        $('#spincustomu').hide();
      }
    });
  }
}

function addCustomMenuWidget() {
  var url = new URL(window.location.href);
  var selectedItems = [];
  $('.menu-item-checkbox:checked').each(function () {
    var ItemId = $(this).attr('id').split('-').pop();
    selectedItems.push({
      itemId: ItemId,
      label: $(this).val(),
      route: $('#custom-menu-item-widget-route-' + ItemId).val(),
      menu: url.searchParams.get("menu"),
      role: $('#custom-menu-item-role').val(),
    });
  });

  if (selectedItems.length) {
    var uniqueselectedItems = selectedItems.filter((obj, index) => {
      return index === selectedItems.findIndex(o => obj.itemId === o.itemId);
    });

    $('#spincustomu').show();
    $.ajax({
      data: JSON.stringify(uniqueselectedItems),
      url: addCustomMenuURL,
      type: 'POST',
      "_token": "{{ csrf_token() }}",
      contentType: 'application/json',
      success: getMenuItems,
      complete: function () {
        $('.menu-item-checkbox:checked').prop('checked', false);
        $('.checkAll:checked').prop('checked', false);
        $('#spincustomu').hide();
      }
    });
  }
}

function updateItem(id = 0) {
  var data;
  if (id) {
    var label = $('#idlabelmenu_' + id).val();
    var quickLink = $('#quick_link_menu_' + id).val();
    var classes = $('#clases_menu_' + id).val();
    var route = $('#route_menu_' + id).val();
    var icon = $('#icon_menu_' + id).val();
    var role_id = $('#role_menu_' + id).length ? $('#role_menu_' + id).val() : 0;
    data = {
      label: label,
      class: classes,
      route: route,
      role_id: role_id,
      id: id,
      icon: icon,
      quick_link: quickLink
    };
  } else {
    var arr_data = $('.menu-item-settings').map(function () {
      return {
        id: $(this).find('.edit-menu-item-id').val(),
        label: $(this).find('.edit-menu-item-title').val(),
        class: $(this).find('.edit-menu-item-classes').val(),
        route: $(this).find('.edit-menu-item-route').val(),
        role_id: $(this).find('.edit-menu-item-role').val(),
        icon: $(this).find('.edit-menu-item-icon').val(),
        quickLink: $(this).find('.edit-menu-item-quick-link').val(),
      };
    }).get();

    data = {
      item_data: arr_data
    };
  }

  if (data) {
    $.ajax({
      data: data,
      url: updateItemURL,
      type: 'POST',
      success: getMenuItems,
      complete: function () {
        if (id) {
          $('#spincustomu2').hide();
        }
      }
    });
  }
}

function actualizedMenu(spinner = "") {
  var url = new URL(window.location.href);
  var name = $('#menu-name').val();
  if (name) {
    $.ajax({
      dataType: 'json',
      data: {
        item_data: item_data,
        name: name,
        id: url.searchParams.get("menu")
      },
      url: generateMenuControlURL,
      type: 'POST',
      success: getMenuItems,
      complete: function () {
        if (spinner) {
          setTimeout(function () {
            spinner.remove();
          }, 1000);
        }
      }
    });
  }
}

function deleteitem(id) {
  if (id) {
    $.ajax({
      dataType: 'json',
      data: {
        id: id
      },
      url: deleteItemMenuURL,
      type: 'POST',
      success: function (response) {}
    });
  }
}

function deletemenu() {
  if (confirm('Do you want to delete this menu ?')) {
    var url = new URL(window.location.href);
    $.ajax({
      dataType: 'json',
      data: {
        id: url.searchParams.get("menu")
      },
      url: deleteMenuURL,
      type: 'POST',
      success: function (response) {
        if (!response.error) {
          window.location = currentURL;
        } else {
          alert(response.resp);
        }
      }
    });
  } else {
    return false;
  }
}

function createMenu() {
  var name = $('#menu-name').val();
  if (name) {
    $.ajax({
      dataType: 'json',
      data: {
        name: name
      },
      url: createMenuURL,
      type: 'POST',
      success: function (response) {
        window.location = currentURL + '?menu=' + response.resp;
      },
      error: function (xhr, status, error) {
        if (xhr.status === 422) {
          var error = xhr.responseJSON.message;
          if (error) {
            $('.menuName_err').text(error);
          }
        } else {
          console.log(xhr.responseJSON);
        }
      }
    });
  } else {
    alert('Enter menu name!');
    $('#menu-name').focus();
    return false;
  }
}

function printErrorMsg(msg) {
  $.each(msg, function (key, value) {
    $('.' + key + '_err').text(value);
  });
}

function insertParam(key, value) {
  key = encodeURI(key);
  value = encodeURI(value);

  var kvp = document.location.search.substr(1).split('&');
  var i = kvp.length;
  var x;
  while (i--) {
    x = kvp[i].split('=');

    if (x[0] == key) {
      x[1] = value;
      kvp[i] = x.join('=');
      break;
    }
  }

  if (i < 0) {
    kvp[kvp.length] = [key, value].join('=');
  }

  document.location.search = kvp.join('&');
}

wpNavMenu.registerChange = function () {
  getMenus();
};