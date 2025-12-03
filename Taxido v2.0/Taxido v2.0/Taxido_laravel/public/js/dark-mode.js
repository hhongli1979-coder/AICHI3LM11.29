let theme = localStorage.theme || '';

document.addEventListener('DOMContentLoaded', function () {
  /// Fetch Dark Mode ///
  if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark');
    sessionStorage.setItem("theme_color", "dark");
  } else {
    document.body.classList.remove('dark');
    sessionStorage.setItem("theme_color", "");
  }
});

/// Light Mode Function ///
const lightMode = function () {
  theme = 'light';
  document.body.classList.remove('dark');
  sessionStorage.setItem("theme_color", "");
  updateThemeInSession(theme);
};

// Dark Mode Function
const darkMode = function () {
  theme = 'dark';
  document.body.classList.add('dark');
  sessionStorage.setItem("theme_color", "dark");
  updateThemeInSession(theme);
};

const darkThemeFunction = function () {
  if (theme === 'dark') {
    lightMode();
  } else {
    darkMode();
  }
};

const themeToggleBtn = document.getElementById('dark-mode');
themeToggleBtn?.addEventListener('click', darkThemeFunction);


window.addEventListener('beforeunload', function () {
  localStorage.theme = theme;
});

function updateThemeInSession(theme) {
  fetch('/admin/set-theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
      },
      body: JSON.stringify({
        theme: theme
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        console.log(data);
      } else {
        console.error('Failed to update theme in session');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
