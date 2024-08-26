function applyThemeProperties(properties) {
    const root = document.documentElement; 
    root.style.setProperty('--text-color', properties.textColor);
    root.style.setProperty('--bg-color', properties.bgColor);
    root.style.setProperty('--shadow-color', properties.shadowColor);
    root.style.setProperty('--button-bg-color', properties.buttonBgColor);
    root.style.setProperty('--button-text-color', properties.buttonTextColor);
    root.style.setProperty('--check-box-active-color', properties.checkBoxActiveColor);
    root.style.setProperty('--check-box-inactive-color', properties.checkBoxInActiveColor);
    root.style.setProperty('--radio-box-active-color', properties.radioBoxActiveColor);
    root.style.setProperty('--radio-box-inactive-color', properties.radioBoxInActiveColor);
    root.style.setProperty('--button-bg-inactive-color', properties.buttonBgInActiveColor);
    root.style.setProperty('--button-text-inactive-color', properties.buttonTextInActiveColor);
    root.style.setProperty('--check-box-border-color', properties.checkBoxBorderColor);
    root.style.setProperty('--status-bar-color', properties.statusBarColor);
    root.style.setProperty('--view-all-text-color', properties.viewAllTextColor);
    root.style.setProperty('--bottom-text-active-color', properties.bottomTextActiveColor);
    root.style.setProperty('--bottom-text-inactive-color', properties.bottomTextInActiveColor);
    root.style.setProperty('--icon-widget-color', properties.iconWidgetColor);
    root.style.setProperty('--bordercolor', properties.iconBorderColor);
    root.style.setProperty('--icon-bg-front-color', properties.iconBgFrontColor);
    root.style.setProperty('--icon-bg-color', properties.iconBgColor);
    root.style.setProperty('--container-bg-color', properties.shadowColor);
    root.style.setProperty('--header-color', properties.headerColors[0]);

}



function createFloatingBox(message) {
    
    const floatingBoxHTML = `
        <div class="floating-box">
            <div class="green-bar"></div>
            <p id="error-msg">${message}</p>
        </div>
    `;

    
    let floatingBox = $(floatingBoxHTML);

    $('body').append(floatingBox);


    setTimeout(function () {
        floatingBox.hide();
    }, 3000); 

   
    return floatingBox;
}


function fetchapiData(url, method, authorizationKey, requestData, successCallback, errorCallback) {
    var ajaxSettings = {
        url: url,
        method: method,
        headers: authorizationKey,
        contentType: 'application/json',
        success: function (data) {
            successCallback(data);
        },
        error: function (xhr, status, error) {
            errorCallback(xhr, status, error);
        }
    };

    
    if (requestData !== null && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        ajaxSettings.data = JSON.stringify(requestData);
    }




   
    $.ajax(ajaxSettings);
}

function checkLocationPermission() {
    if ("geolocation" in navigator) {
        navigator.permissions.query({ name: 'geolocation' })
            .then(result => {
                if (result.state === 'granted') {
                    getLocationAndProcess();
                    $('#locationDialog').hide();
                } else if (result.state === 'prompt') {
                    requestLocationAccess();
                    // showLocationDialog();
                } else if (result.state === 'denied') {
                    // $('#locationDialog').show();
         

                    showLocationDialog();
                }
            })
            .catch(error => {
                console.error("Permission query error:", error);
            });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}
$('#allowBtn').off('click').on('click', function () {
    showInstructions()
  

});
// Function to display the location permission dialog
function showLocationDialog() {

    $('#locationDialog').show();

    $('#denyBtn').on('click', function () {
        $('#locationDialog').hide();
     
    });
}

function showInstructions() {
    alert('To manage browser permissions:\n\n' +
          'For Chrome: Go to Settings > Privacy and security > Site settings.\n' +
          'For Firefox: Go to Settings > Privacy & Security.\n' +
          'For Edge: Go to Settings > Cookies and site permissions.\n' +
          'For Safari: Go to Safari menu > Preferences > Websites.');
}
function requestLocationAccess() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => handleLocation(position.coords.latitude, position.coords.longitude),
            error => handleLocationError(error)
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Function to get location and process it
function getLocationAndProcess() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => handleLocation(position.coords.latitude, position.coords.longitude),
            error => handleLocationError(error)
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Function to handle location error
function handleLocationError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            $('#locationDialog').show();
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}


function handleLocation(latitude, longitude) {
    userLocation.latitude = latitude;
    userLocation.longitude = longitude;
    console.log("Latitude:", latitude, "Longitude:", longitude);

    fetchmainstations(latitude,longitude)
}


var userLocation = {};

$(document).ready(function() {
    checkLocationPermission();
});

$('#allowBtn').on('click', function () {

    requestLocationAccess();
});




function fetchmainstations(latitude,longitude) {

    // var url = `${nearmetro.metross}latitude=${latitude}&longitude=${longitude}`;
    var url = `${nearmetro.metross}latitude=28.7041&longitude=77.1025`;
    var method = 'GET';
    var authorizationKey = headers35;

    var requestData = null;

    fetchapiData(url, method, authorizationKey, requestData,
        function (response) {
            console.log('Request successful:', response);
            alllines(response) 
  
        },
        function (xhr, status, error) {
            console.error('Request failed:', error);
        }
    );
}




function alllines(response) {


    if (response.length === 0) {
        
        var noDataImage = `<div id ="no-courier" ><img src="../assets/no_nearest_metro.svg" alt="No bookings available" class="no-bookings-image">
            <h4>Oops!Either You Are far off Or Your Mobile Location Is Off</h4>
            </div>`;
            $('.st-cont').append(noDataImage);
        return;
    }

    $('.st-cont').empty();
     
        response.map((station,index) =>{
            var lines = `
     
            
                <div class="station"  data-code="${station.code}">
                    <div class="station-name" >

                    
                   <span  class = "main-name"> ${station.name}</span>

                   <div class = "locations" >
                <div class="arrow-imgs" id="arrow-ticket-${index}"></div>
                  <span>${station.distance_in_km} KM </span>
                    </div>
                    </div>
                    <div class = "station-colors">
                    ${station.lines.map(line => `
                        <span class="coloring" style="background-color:${line.backcolor}; color:${line.color}; border : 2px solid ${line.color} ">
                            ${line.name}
                        </span>
                    `).join('')}
                </div>
                </div>
            `
        
            $('.st-cont').append(lines);
            loadSVG('location', `#arrow-ticket-${index}`);
        })
           
        
      }


      $(document).on('click', '.station', function () {
 
        var maincode = $(this).data('code');
        history.pushState({ page: 'aboutstation' }, '', '?state=aboutstation');
        $('.metrolines-list').show();
        $('.st-list').hide();
          mainaboutstation(maincode, 'stationdiv');
       
    
    });
    

    $(document).ready(function() {

        window.addEventListener('popstate', function(event) {
            var state = event.state ? event.state.page : null;
        
            switch (state) {
           
                // case 'placedetails':
                //     $('.tour-list').hide();
                //     $('.detailed-station').show();
                //     $('.metrolines-station-details').hide();
                //     break;
                case 'aboutstation':
                    $('.st-list').hide();
                 
                    $('.metrolines-list').show();
                    break;
                default:
                    $('.st-list').show();
                    
                    $('.metrolines-list').hide();
                    break;
            }
        });
        
        function checkInitialState() {
            const params = new URLSearchParams(window.location.search);
            const state = params.get('state');
            
            switch (state) {
           
                // case 'placedetails':
                //     $('.tour-list').hide();
                //     $('.detailed-station').show();
                //     $('.metrolines-station-details').hide();
                //     break;
                case 'aboutstation':
                    $('.st-list').hide();
                 
                    $('.metrolines-list').show();
                    break;
                default:
                    $('.st-list').show();
                    
                    $('.metrolines-list').hide();
                    break;
            }
        }
        
        
            checkInitialState();
         
        });
    