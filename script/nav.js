$(document).ready(function() {
  const nav = $('#nav');
  const signInLink = nav.find('.left .nav-item');
  const bodyContent = $('body > *:not(#nav)'); // Select all body children except the navbar

  // Function to check if accessToken exists in localStorage
  function isLoggedIn() {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken !== null && accessToken !== undefined && accessToken !== '';
  }

  // Update navbar based on login status
  function updateNavbar() {
    if (isLoggedIn()) {
      // If logged in, replace "Sign In" with username
      const username = localStorage.getItem('username'); // Replace 'username' with your actual key
      if (username) {
        signInLink.find('span').text(username).css({"text-decoration": "none", "font-size": "18px"});

        // Add a logout link (hidden by default)
        if ($('#logout-link').length === 0) {
          signInLink.append('<div id="logout-link" style="display: none; cursor: pointer;">Logout</div>');
        }
      }
    } else {
      // If not logged in, keep "Sign In"
      signInLink.find('span').text('Sign In');
      $('#logout-link').remove(); // Remove logout link if it exists
    }
  }

  // Initial update on page load
  updateNavbar();

  // Toggle logout link on click of the profile name/icon
  signInLink.on('click', function(e) {
    if (isLoggedIn()) {
      e.preventDefault();
      $('#logout-link').toggle();
    }
  });

  // Logout functionality
  $('#nav').on('click', '#logout-link', function() {
    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');

    // Hide other body elements
    bodyContent.hide();

    // Update the navbar
    updateNavbar();

    // Optionally, you can show a message or redirect to another page
    alert('You have been logged out.');
    // window.location.href = 'index.html'; // Uncomment to redirect
  });
});
