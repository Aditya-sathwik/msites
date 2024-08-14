var stations = [];
var currentInputField = null; // Track the current input field globally
// Define journeydetails array outside the function

var journeydetails = []

// Function to fetch stations data from the server
function fetchStations() {

    $.ajax({
        url: planyourjourney.stationslist,
        method: 'GET',
        headers:headers35,
        success: function (data) {
            console.log("Stations fetched successfully", data);
            stations = data.results.map(result => ({
                code: result.code,
                name: result.name,
                lineCodeName: result.lineCode.length > 0 ? result.lineCode[0].name : "",
                lineCodeName1: result.lineCode.length > 1 ? result.lineCode[1].name : "",
                lineCodeBackColor: result.lineCode.length > 0 ? result.lineCode[0].backcolor : "",
                lineCodeBackColor1: result.lineCode.length > 1 ? result.lineCode[1].backcolor : "",
                lineCodeColor: result.lineCode.length > 0 ? result.lineCode[0].color : "",
                lineCodeColor1: result.lineCode.length > 1 ? result.lineCode[1].color : ""
            }));
            populateStationList();


        },
        error: function (error) {
            console.error('Error fetching station data:', error);
        }
    });
}





function populateStationList() {
    console.log("Populating station list...");

    var stationList = $('#station-list');
    stationList.empty();

    stations.forEach(function (station) {
        // Create a list item
        var listItem = $('<li  id = "main-list" >');
        var lineCodeName = $('<p>').text(station.name)


        // Create the line code span with inline styling
        var lineCodeSpan = $('<span>').text(station.lineCodeName)
            .css({
                'background-color': station.lineCodeColor,
                'border': '2px solid ' + station.lineCodeColor,

            }); // Set inline background color
        var lineCodeSpan1 = $('<span id = "sec">').text(station.lineCodeName1)
            .css({
                'background-color': station.lineCodeColor1,
                'border': '2px solid ' + station.lineCodeColor1,
            });

        stationList.find('span').each(function () {
            var spanText = $(this).text().trim();
            if (spanText === '') {
                $(this).hide(); // Hide empty spans using CSS display: none;
            }
        })

        // Append the station name directly to the list item (no span)
        listItem.append(lineCodeName, ' '); // Add a space between name and code
        listItem.append(lineCodeSpan);
        listItem.append(lineCodeSpan1);

        // listItem.on('click', function () {
        //     console.log("Station selected:", station.name,station.code);
        //     if (currentInputField) {
        //         currentInputField.val(station.name);
        //         $('#station-selection').hide();
        //     }
        // });



        listItem.on('click', function () {
            var stationName = station.name; // Use station.name directly
            if (currentInputField) {
                var stationCode = station.code; // Get the station code
                currentInputField.val(stationName); // Update the input field with the station name
                // Store the station code in the data attribute of the input field
                currentInputField.data('station-code', stationCode);
                $('#station-selection').hide();
            }
        });



        stationList.append(listItem);
    });
}



$('#depart, #destination').on('change', function () {
    var inputField = $(this);
    var stationName = inputField.val().trim();
    var station = stations.find(s => s.name === stationName);
    if (station) {
        inputField.data('station-code', station.code);
    } else {
        inputField.data('station-code', ''); // Clear if station is not found
    }

});


$('#depart, #destination').on('change', function () {

    
  
});




$('#depart, #destination').on('click', function () {
    currentInputField = $(this); // Update the current input field
    console.log("Input field clicked:", currentInputField.attr('id'));
    $('#station-selection').show();
    clearsearch(); // Call clearsearch to reset search input and list

    if ($(this).attr('id') === 'destination') {
        $('#station-selection').scrollTop(0); // Reset scroll position to top
    }
});
$('#depart, #destination').on('click', function () {
   

    document.getElementById('fare-ticket').style.display = 'none'
       
    document.getElementById('clear').style.display = 'none'

    $('#destination').val('')
 $('#bottom').show()
});


function showStationSelection(inputId) {
    $('#station-selection').show();
    $('#station-selection .modal-body').scrollTop(0);  // Reset scroll position to top
    $('#station-list li').off('click').on('click', function () {
        var stationName = $(this).text();
        $('#' + inputId).val(stationName);
        $('#station-selection').hide();
    });
}







// Event listener for closing modals
$('.close-btn').on('click', function () {
    console.log("Close button clicked");
    $(this).closest(' .station-modal').hide();

});

$('#station-search').on('input', function () {
    var searchTerm = $(this).val().toLowerCase();

    $('#station-list li').each(function () {
        var stationName = $(this).text().toLowerCase();
        $(this).toggle(stationName.includes(searchTerm));
    });

    if (!searchTerm) {
        $('#station-list li').show();
    }
});


// <------------------------------train selection-------------------------------------------->


    // $('#station-search').hide();
    // $('#clear-icon').hide();
    // $('#search-icon2').hide();
    // Initially hide the search bar by accessing it within its container
    $('#search-icon').click(function () {
        // Show the clear icon
        $('#station-search').toggle(); // Focus on the search input
        // Focus on the search input
        $('#clear-icon').toggle();
        $('#heading').hide();
        $('#imgs').hide();
        $('#search-icon2').toggle();

    });

    $('#clear-icon').click(function () {
        clearsearch(); // Call clearsearch to reset search input and list
    });
    

    function clearsearch() {
        $('#station-search').val(''); // Clear the search input
        $('#station-list li').show(); // Show all stations
        $('#clear-icon').hide();
        $('#search-icon2').hide();
        $('#station-search').hide(); 
        $('#heading').show();
        $('#imgs').show();
    }
    



// <----------train selection -------->


// <-----------------selecting Stations---------------------------------------------------->




$('#station-list li').on('click', function () {
    var stationName = $(this).text();
    resetSearch(); // Call resetSearch to clear the search input and show all stations
    if (currentInputField) {
        currentInputField.val(stationName);
        $('#station-selection').hide();
    }
});

function resetSearch() {
    $('#station-search').val(''); // Clear the search input
    $('#station-list li').show(); // Show all stations
}





// $(document).on('click', function (event) {
//     if (!$(event.target).is('#depart, #destination') && !$(event.target).closest('#station-selection').length) {
//         $('#station-selection').hide();
//     }
// });


// <----------------- Error page---------------------------------------------------->


// Function to show the modal
// $('#error-modal').hide();
function showModal(message) {
    $('#error-message').text(message);
    $('#error-modal').css('display', 'flex');
}

// Function to hide the modal
function hideModal() {
    $('#error-modal').css('display', 'none');
}


// Close modal when close button is clicked
$('#close-modal').on('click', hideModal);
$('.error-btn').on('click', hideModal);

// Validate form on button click



// $('#depart, #destination').on('change', function () {
//     var inputField = $(this);
//     var stationName = inputField.val().trim();
//     var station = stations.find(s => s.name === stationName);
//     if (station) {
//         inputField.data('station-code', station.code);
//     } else {
//         inputField.data('station-code', ''); // Clear if station is not found
//     }
// });


//  <------------------- Swap Stations -------------------------------------------------->
$("#swap-stations").click(function () {
    var fromStation = $("#depart").val();
    var toStation = $("#destination").val();
    $("#depart").val(toStation);
    $("#destination").val(fromStation);

    var fromStationCode = $("#depart").data('station-code');
    var toStationCode = $("#destination").data('station-code');
    $("#depart").data('station-code', toStationCode);
    $("#destination").data('station-code', fromStationCode);
});







// <------------------- Swap Stations --------------------------------------------------->

// <------------------ Dates and time --------------------------------------------------->




// <-------------Route input --------------------------------------------------->
var selectedRouteType = "least-distance"; // Initialize outside the event handler
        
// Event listener for radio button change
$('input[name="filter"]').on('change', function() {
    if ($(this).attr('id') === 'shortest') {
        selectedRouteType = 'least-distance'; // Update the outer variable
    } else if ($(this).attr('id') === 'min-interchange') {
        selectedRouteType = 'minimum-interchange'; // Update the outer variable
    }
    console.log(selectedRouteType)// Updated console log
});

var includeAirportLine = false;


function fetchRouteData(departStationCode, destinationStationCode) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `http://35.200.153.72:3000/metro/v3/journey/${departStationCode}/${destinationStationCode}/${selectedRouteType}`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer 8e885245cabbd8406f09986e7286bd1a4d20c09056f86488c68a78638cffd03cd4b1061c6df0ea16137df29b9fe3fca381f1b0527ab5dec5b96253344eda090b5c85cf91124db48a074187166709a4be066657b99baa6aaa7a88b5f763989172e8413c7b8def3c8cebe1590a702924cc7be36905fb7a38528c98690fb55be3173c2059e264bf490b0abf7e452c6729040750c635130b8aeff4029d652cb52fc66b385bb264bbceeccd3019e4aee7411d35ea8d52d84095fcb319f297ad8311a0ec95b21ae96d979ef6ca7388f0e7cb3fefa0cafd31b693df4363a599c4d2fbb7bdd55351e00a8ebbcf51fa9808888062',
                'key': 'aditya'
            },
            success: function (data) {
                console.log("Data received from API:", data);
                resolve(data); // Resolve the promise with fetched data
            },
            error: function (xhr, status, error) {
                console.error('Error fetching data from API:', error);
                reject(error); // Reject the promise on error
            }
        });
    });
}

// Function to initialize the route data fetching and processing
function initRouteDisplay(departStationCode, destinationStationCode) {
    var endstation = ""
    fetchRouteData(departStationCode, destinationStationCode)
        .then(data => {
            console.log("Processing data from API:", data);

            // Extract data from API response
            var nostations = data.stations;
            var totaltime = data.total_time;
            var newfare = data.fare.normal
            var Specialfare = data.fare.special
            var applicablefare = data.applicableFare;
           
            console.log(newfare,Specialfare)

            if (data.fare_breakup && Array.isArray(data.fare_breakup)) {
                const farebreakup = data.fare_breakup;
                maininterchange = 0; // Initialize maininterchange to 0 before counting

                farebreakup.forEach(item => {
                    if (item.interchanges && Array.isArray(item.interchanges)) {
                        maininterchange += item.interchanges.length; // Increment maininterchange by the length of interchanges array
                    } else {
                        console.log("Interchanges data not found or is not an array in fare breakup.");
                    }
                });
            } else {
                console.log("farebreakup data not found or is not an array.");
            }

            let routes = [];
            if (data.routes && Array.isArray(data.routes)) {
                var endstation = ""
                routes = data.routes;

                routes.forEach((route) => {
                    endstation = route.end; // Assign value to global endstation variable
                    
                });

             
            } else {
                console.log("Routes data not found or is not an array.");
            }
            console.log(endstation)
            // Call function to display journey details in UI
            uidisplay(newfare,Specialfare,endstation);
        })
        .catch(error => {
            console.error('Error processing route data:', error);
        });
}
function uidisplay(newfare,Specialfare,endstation) {
    // if (!routes || routes.length === 0) return;
    var routefetch = `
         <div class="fare-card">
    <div class="fare-row">
        <div class="fare-type">
            <div class="circle">
                <img src="../svg/fare1.svg" alt="Ticket Icon">
            </div>
            <div>
                <p>Normal Fare</p>
                <p>₹${newfare}</p>
            </div>
        </div>
        <div class="fare-type" id = "special-fare">
            <div class="circle">
                <img src="../svg/fare1.svg" alt="Ticket Icon">
            </div>
            <div>
                <p>Special Fare</p>
                <p>₹${Specialfare}</p>
            </div>
        </div>
    </div>
    <div class="line"></div>
    <div class="via">
        <img src="../svg/via.svg" alt="Arrow Icon">
        <p>Via ${endstation}</p>
    </div>
</div>
  
    <div>
     <a href="#" class="reset-link" id = "clear">CLEAR</a>
    </div>  `;

    // Add this HTML structure to the main route container
    document.getElementById('fare-ticket').innerHTML = routefetch;
    document.getElementById('bottom').style.display = 'none';
    document.getElementById('fare-ticket').style.display = 'block';


}













// <-------------Form Validation and next step------------------------------------------>


$('#show-route-fare').on('click', function () {

    let depart = $('#depart').val().trim();
    let destination = $('#destination').val().trim();

    console.log('selectedRouteType', selectedRouteType)




    let departStationCode = $('#depart').data('station-code');
    let destinationStationCode = $('#destination').data('station-code');

    console.log('departStationCode', departStationCode)

    console.log('destinationStationCode', destinationStationCode)

    if (!depart) {
        showModal('Please select depart station');
        return;
    }

    if (!destination) {
        showModal('Please select destination station');
        return;
    }


    
    initRouteDisplay(departStationCode, destinationStationCode)

   
    
});
    
    
$(document).on('click', '#clear', function () {
    $('#depart').val("")
    $('#destination').val("")
        console.log('Nav button clicked');
       
        document.getElementById('fare-ticket').style.display = 'none'
       
        document.getElementById('clear').style.display = 'none'
        
        document.getElementById('bottom').style.display = 'flex';
        
    });
    
    
    
fetchStations();