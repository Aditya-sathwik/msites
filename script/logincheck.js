$(document).ready(function() {
  // Function to check if accessToken exists in localStorage
  $(document).on('click', '#BookQRTicket', function(event) {
    event.preventDefault();
    console.log("btn clicked");

    if (!isLoggedIn()) {
        redirectToLogin();
    } else {
        window.location.href = '../pages/bookqr.html';
    }
});
  function isLoggedIn() {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken !== null && accessToken !== undefined && accessToken !== '';
  }
  console.log('hello2')

  // Function to redirect to login page if not logged in
  function redirectToLogin() {
    window.location.href = '../pages/index.html';
  }
 

  // Attach click event to 'a' tag linking to bookqr.html
//   $('#BookQRTicket').on('click', function(event) {
//       event.preventDefault();
//       console.log("btn clicked")

//       // Check if user is logged in
//       if (!isLoggedIn()) {
    
//           redirectToLogin();
//       } else {
//           // Proceed to bookqr.html
//           window.location.href = '../pages/bookqr.html';
//       }
//   });
});
