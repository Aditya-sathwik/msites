// $(document).ready(function () {
    var stations = [];
    var currentInputField = null; // Track the current input field globally
    // Define journeydetails array outside the function
    
    var journeydetails = []
    
    // Function to fetch stations data from the server
    function fetchStations() {
    
        $.ajax({
            url: 'http://34.93.164.215:3000/metro/v3/stations?page=1&limit=300',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer 8e885245cabbd8406f09986e7286bd1a4d20c09056f86488c68a78638cffd03cd4b1061c6df0ea16137df29b9fe3fca381f1b0527ab5dec5b96253344eda090b5c85cf91124db48a074187166709a4be066657b99baa6aaa7a88b5f763989172e8413c7b8def3c8cebe1590a702924cc7be36905fb7a38528c98690fb55be3173c2059e264bf490b0abf7e452c6729040750c635130b8aeff4029d652cb52fc66b385bb264bbceeccd3019e4aee7411d35ea8d52d84095fcb319f297ad8311a0ec95b21ae96d979ef6ca7388f0e7cb3fefa0cafd31b693df4363a599c4d2fbb7bdd55351e00a8ebbcf51fa9808888062',
                'key': 'aditya'
            },
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
    
            listItem.on('click', function () {
                console.log("Station selected:", station.name,station.code);
                
            });
    
    
    
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
    
    
    
  
    
    
    
    $('#depart, #destination').on('click', function () {
        currentInputField = $(this); // Update the current input field
        console.log("Input field clicked:", currentInputField.attr('id'));
        $('#station-selection').show();
        clearsearch(); // Call clearsearch to reset search input and list
    
        if ($(this).attr('id') === 'destination') {
            $('#station-selection').scrollTop(0); // Reset scroll position to top
        }
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
    
    
    
    
    // <-----------------------------train selection-------------------------------------------->
    
    // $(document).ready(function () {
    //     $('#station-search').hide();
    //     $('#clear-icon').hide();
    //     $('#search-icon2').hide();
    //     // Initially hide the search bar by accessing it within its container
    //     $('#search-icon').click(function () {
    //         // Show the clear icon
    //         $('#station-search').toggle(); // Focus on the search input
    //         // Focus on the search input
    //         $('#clear-icon').toggle();
    //         $('#heading').hide();
    //         $('#imgs').hide();
    //         $('#search-icon2').toggle();
    
    //     });
    
    //     $('#clear-icon').click(function () {
    //         $('#station-search').hide();
    //         $('#clear-icon').hide()
    //         $('#search-icon2').hide();
    //         $('#station-search').val(''); // Clear the search input
    //         $('#heading').toggle();
    //         $('#imgs').toggle();
    //     });
    // });
    
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
    
    
    
    
    function initializeDateTimeInputs() {
        var currentDate = new Date().toISOString().slice(0, 10);
        var currentTime = new Date().toTimeString().slice(0, 5);
    
        $('#date').val(currentDate);
        $('#time').val(currentTime);

        $('#date').attr('min', currentDate);

        $('#time').attr('min', currentTime);
    }
    
    
    initializeDateTimeInputs();
    
    
    $('#date, #time').on('change', function () {
        var selectedDate = $('#date').val();
        var selectedTime = $('#time').val();
    
    
        var selectedDateTime = {
            date: selectedDate,
            time: selectedTime
        };
    
        console.log('Selected Date and Time:', selectedDateTime);
    });
    

    
    
    initializeDateTimeInputs();
    // <-------------Route input --------------------------------------------------->
    var selectedRouteType = "least-distance"; // Initialize outside the event handler
    
    // Event listener for radio button change
    $('input[name="filter"]').on('change', function () {
        if ($(this).attr('id') === 'shortest') {
            selectedRouteType = 'least-distance'; // Update the outer variable
        } else if ($(this).attr('id') === 'min-interchange') {
            selectedRouteType = 'minimum-interchange'; // Update the outer variable
        }
        console.log(selectedRouteType)// Updated console log
    });
    
    var includeAirportLine = false;
    
    $('#airport-line').on('change', function () {
        includeAirportLine = $(this).is(':checked');
    
    });

    
    $('#reseter').on('click', function () {
        $('#depart').val('');
        $('#destination').val('');
    
    });
    
    // <-------------Form Validation and next step------------------------------------------>
    
    
    $('#show-route-fare').on('click', function () {
    
        let depart = $('#depart').val().trim();
        let destination = $('#destination').val().trim();
        let date = $('#date').val().trim();
        let time = $('#time').val().trim();
    
        console.log('selectedRouteType', selectedRouteType)
        console.log('includeAirportLine', includeAirportLine)
        console.log('date', date)
        console.log('time', time)
    
    
    
    
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
    
        if (!date) {
            showModal('Please select a date');
            return;
        }
    
        if (!time) {
            showModal('Please select a time');
            return;
        }
    
    
    
        function fetchRouteData(departStationCode, destinationStationCode) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: `http://35.200.153.72:3000/metro/v3/journey/${departStationCode}/${destinationStationCode}/${selectedRouteType}/${date}?exclude_airport_line=${includeAirportLine}`,                                                                           
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
            fetchRouteData(departStationCode, destinationStationCode)
                .then(data => {
                    console.log("Processing data from API:", data);
    
                    // Extract data from API response
                    var applicablefare = data.applicableFare;
                    var nostations = data.stations;
                    var totaltime = data.total_time
    
    
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
                        routes = data.routes;
                    } else {
                        console.log("Routes data not found or is not an array.");
                    }
    
                    // Call function to display journey details in UI
                    uidisplay(applicablefare, nostations, maininterchange, routes, totaltime);
                })
                .catch(error => {
                    console.error('Error processing route data:', error);
                });
        }
    
        function uidisplay(applicablefare, nostations, maininterchange, routes, totaltime) {
            if (!routes || routes.length === 0) return;
    
            // <div id = "main-route-container" class = "route-container" >
            var routefetch = `
                            <div class="route-navbar">
                                <div class="nav-title"> 
                                <p class="nav-btn">&#9664</p>
                        <h4>${depart} -> ${destination}</h4>   
        
                                </div>
                                <button class="btn"  id="nav-button">BOOK TICKET</button>
                            </div>
                            <div class="route-image-container">
                                <img id="zoomable-image" src="../assets/Screenshot (3).png" alt="Zoomable">
                            </div>
                            <div class="draggable" id="draggable">
                                <div class="content">
                                    <div class="slide-bar"></div>
                                    <div class="details">
                                        <div>Slide up/down for details</div>
                                        <div>Journey Date: <span id="journey-date">${date}</span>
                                            <span id="journey-time">${time}</span>
                                        </div>
                                        <div>You will save <span id="carbon-saving" class="highlight">646</span> gms of Carbon</div>
                                    </div>
                                    <div class="min-dist">
                                        <div id="shortest-route" class="option">
                                            <h3>Shortest Route</h3>
                                          <p id = "routing"></p>
                                            <h4>Recommended</h4>
                                        </div>
                                        <div id="max-interchange" class="option">
                                            <h3>Min. Interchange</h3>
                                              <p id = "routing1"></p>
                                        </div>
                                    </div>
                                    <div class="travel-details">
                                        <div id="fare" class="travel-div">
                                            <div class="fare-icon">
                                                <img src="../svg/fare1.svg" alt="fare-image">
                                            </div>
                                            <div class="fare-details">
                                                <span>FARE</span>
                                                <span class="num">₹${applicablefare}</span>
                                            </div>
                                        </div>
                                        <div id="stations" class="travel-div">
                                            <div class="stations-icon">
                                                <img src="../svg/station.svg" alt="fare-image">
                                            </div>
                                            <div class="fare-details">
                                                <span>Stations</span>
                                                <span class="num">${nostations}</span>
                                            </div>
                                        </div>
                                        <div id="interchange" class="travel-div">
                                            <div class="interchange-icon">
                                                <img src="../svg/inter.svg" alt="fare-image">
                                            </div>
                                            <div class="fare-details">
                                                <span>Interchange</span>
                                                <span class="num">${maininterchange - 1}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="metro-container">
                        `;
    
    
            if (routes && Array.isArray(routes)) {
                routes.forEach((route, index) => {
                    var timeParts = route.path_time.split(":");
                    var hours = parseInt(timeParts[0]);
                    var minutes = parseInt(timeParts[1]);
    
                    var pathTimeDisplay = '';
    
                    if (hours > 0) {
                        pathTimeDisplay = `${hours} hour ${minutes} minutes`;
                    } else {
                        pathTimeDisplay = `${minutes} minutes`;
                    }
    
                    routefetch += `
                                    <div class="metro-line">
                                        <div class="metro-line-header">
                                            <div class="metro-header-left">
                                                <i class="gg-pin-alt" style="background-color:${route.line_color}; border-color: ${route.line_color};"></i>
                                                <h2>${route.start}</h2>
                                                <span style="background-color:${route.line_color};">${route.line}</span>
                                            </div>
                                            <div class="metro-header-right">
                                                <p>Towards</p>
                                                <h2>${route.towards_station}</h2>
                                            </div>
                                        </div>
                                        <div class="show-station" style="border-left: 2px dashed ${route.line_color};">
                                            <div class="show-all" id="show-all${index}">
                                    <h4">Show all ${route.path.length} stations</h4>
                                    <span><img src="../svg/down.svg" id="show-all-img"></span>
                                                   </div>
                                            <div class="station-details">
                                                <span>${pathTimeDisplay}</span>
                                                <span><img src="../svg/exit.svg" id="station-details-img"></span>
                                                <span>${route.platform_name}</span>
                                            </div>
                                        </div>
                                        <div class="stations-main"  id = "station-main-dis${index}" >
                                            ${route.path.map((station, index) => `
                                                <div class="station-main-all" style="border-left: 2px dashed ${route.line_color}; ${index === route.path.length - 1 ? 'display: none;' : ''}">
                                                    <div class="station-main-details">${station.name}</div>
                                                </div>
                                            `).join('')}
                                        </div>
                                        <div class="metro-header-left">
                                            <i class="gg-pin-alt1" style="background-color:${route.line_color}; border-color: ${route.line_color};"></i>
                                            <h2 id="bottom-heading">${route.end}</h2>
                                            <span id="bottom-span" style="background-color:${route.line_color};">${route.line}</span>
                                        </div>
                                    </div>
                                    ${index === routes.length - 1 ? '' : `
                                        <div class="change-line" id="main-line-change">
                                            <img src="../svg/interchange.svg">
                                            <p>Change here, move towards ${routes[index + 1].line} - 5 min(s)</p>
                                        </div>
                                    `}
                                `;
    
                    $(document).ready(function () {
                        $(document).on('click', '#show-all' + index, function () {
                            console.log("toogled")
    
                            $('#station-main-dis' + index).toggle(); // Toggle the visibility of the corresponding 'station-main-all'
                        });
    
                    });
                });
            } else {
                console.error("Routes data is not properly structured or is missing.");
            }
    
            routefetch += `</div>`; // Close the metro-container div
    
    
    
    
            // $('body').children().hide();
            // $('body').append(routefetch);
            document.getElementById('main-route-container').innerHTML = routefetch
            document.getElementById('main-form').style.display = 'none'
            // document.getElementById('draggable').style.display = 'block'
            document.getElementById('main-route-container').style.display = 'flex'




        
                  
                    var currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    var selectedDateValue = $('#date').val();
                    
                  
                    if (selectedDateValue) {
                        var selectedDate = new Date(selectedDateValue);
                        selectedDate.setHours(0, 0, 0, 0);
                        if (selectedDate.getTime() !== currentDate.getTime()) {
                           
                            $('#nav-button').css({
                                'display': 'none'
                            });
                            console.log("Selected date is different from today.");
                        } else {
                            
                            $('#nav-button').css({
                                'display': 'block'
                            });
                            console.log("Selected date is today.");
                        }
                    } else {
                       
                        $('#nav-button').css({
                            'display': 'block'
                        });
                    }
              
    
            
    
            var timetaken = `${totaltime}`
            console.log(timetaken)
            if (selectedRouteType === 'minimum-interchange') {
                $('.option h4 ').css('background-color', 'black'),
                    $('#max-interchange').css({
                        'background-color': 'rgb(255 192 192)',
                        'border': '1px solid red ',
                    });
    
                $('#routing1').html(timetaken);
            } else if (selectedRouteType === 'least-distance') {
                $('#routing').html(timetaken);
            }
    
    
    
            setupDraggable();
        }
    
    
    
        $(document).on('click', '.nav-btn', function () {
    
            console.log('Nav button clicked');
    
            document.getElementById('main-form').style.display = 'flex'
    
            document.getElementById('main-route-container').style.display = 'none'
            $(document).on('click', '.show-all', function () {
                var index = $(this).attr('id').replace('show-all', ''); // Extract index from id
                $('#station-main-dis' + index).toggle(); // Toggle the visibility of the corresponding 'station-main-all'
            });
    
        });
    
    
    
    
    
    
    
        initRouteDisplay(departStationCode, destinationStationCode);
    
        $(document).on('click', '#max-interchange', function () {
            var selectedRouteType = "minimum-interchange"
    
            $('.option h4 ').css('background-color', 'black'),
            $('#max-interchange').css({
                'background-color': 'rgb(255 192 192)',
                'border': '1px solid red ',
            });
    
      
            fetchRouteData1(departStationCode, destinationStationCode, selectedRouteType)
    
            initRouteDisplay1(departStationCode, destinationStationCode, selectedRouteType);
    
       
        })
        $(document).on('click', '#shortest-route', function () {
            var selectedRouteType = "least-distance"
    
            $('#max-interchange').css({
                'background-color': '',
                'border': '',
            });
    
      
            fetchRouteData1(departStationCode, destinationStationCode, selectedRouteType)
    
            initRouteDisplay1(departStationCode, destinationStationCode, selectedRouteType);
    
       
        })
    
    
        function fetchRouteData1(departStationCode, destinationStationCode, selectedRouteType) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: `http://35.200.153.72:3000/metro/v3/journey/${departStationCode}/${destinationStationCode}/${selectedRouteType}/${date}?exclude_airport_line=${includeAirportLine}`,
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
        function initRouteDisplay1(departStationCode, destinationStationCode, selectedRouteType) {
            fetchRouteData1(departStationCode, destinationStationCode, selectedRouteType)
                .then(data => {
                    console.log("Processing data from API:", data);
    
                    // Extract data from API response
                    var applicablefare = data.applicableFare;
                    var nostations = data.stations;
                    var totaltime = data.total_time
    
    
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
                        routes = data.routes;
                    } else {
                        console.log("Routes data not found or is not an array.");
                    }
    
                    // Call function to display journey details in UI
                    uidisplay1(applicablefare, nostations, maininterchange, routes, totaltime,selectedRouteType);
                })
                .catch(error => {
                    console.error('Error processing route data:', error);
                });
        }
    
        
        function uidisplay1(applicablefare, nostations, maininterchange, routes, totaltime,selectedRouteType) {
            if (!routes || routes.length === 0) return;
    
            // <div id = "main-route-container" class = "route-container" >
            var routefetch = `
                            <div class="route-navbar">
                                <div class="nav-title"> 
                                <p class="nav-btn">&#9664</p>
                        <h4>${depart} -> ${destination}</h4>   
        
                                </div>
                                <button class="btn"  id="nav-button">BOOK TICKET</button>
                            </div>
                            <div class="route-image-container">
                                <img id="zoomable-image" src="../assets/Screenshot (3).png" alt="Zoomable">
                            </div>
                            <div class="draggable" id="draggable">
                                <div class="content">
                                    <div class="slide-bar"></div>
                                    <div class="details">
                                        <div>Slide up/down for details</div>
                                        <div>Journey Date: <span id="journey-date">${date}</span>
                                            <span id="journey-time">${time}</span>
                                        </div>
                                        <div>You will save <span id="carbon-saving" class="highlight">646</span> gms of Carbon</div>
                                    </div>
                                    <div class="min-dist">
                                        <div id="shortest-route" class="option">
                                            <h3>Shortest Route</h3>
                                          <p id = "routing"></p>
                                            <h4>Recommended</h4>
                                        </div>
                                        <div id="max-interchange" class="option">
                                            <h3>Min. Interchange</h3>
                                              <p id = "routing1"></p>
                                        </div>
                                    </div>
                                    <div class="travel-details">
                                        <div id="fare" class="travel-div">
                                            <div class="fare-icon">
                                                <img src="../svg/fare1.svg" alt="fare-image">
                                            </div>
                                            <div class="fare-details">
                                                <span>FARE</span>
                                                <span class="num">₹${applicablefare}</span>
                                            </div>
                                        </div>
                                        <div id="stations" class="travel-div">
                                            <div class="stations-icon">
                                                <img src="../svg/station.svg" alt="fare-image">
                                            </div>
                                            <div class="fare-details">
                                                <span>Stations</span>
                                                <span class="num">${nostations}</span>
                                            </div>
                                        </div>
                                        <div id="interchange" class="travel-div">
                                            <div class="interchange-icon">
                                                <img src="../svg/inter.svg" alt="fare-image">
                                            </div>
                                            <div class="fare-details">
                                                <span>Interchange</span>
                                                <span class="num">${maininterchange - 1}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="metro-container">
                        `;
    
    
            if (routes && Array.isArray(routes)) {
                routes.forEach((route, index) => {
                    var timeParts = route.path_time.split(":");
                    var hours = parseInt(timeParts[0]);
                    var minutes = parseInt(timeParts[1]);
    
                    var pathTimeDisplay = '';
    
                    if (hours > 0) {
                        pathTimeDisplay = `${hours} hour ${minutes} minutes`;
                    } else {
                        pathTimeDisplay = `${minutes} minutes`;
                    }
    
                    routefetch += `
                                    <div class="metro-line">
                                        <div class="metro-line-header">
                                            <div class="metro-header-left">
                                                <i class="gg-pin-alt" style="background-color:${route.line_color}; border-color: ${route.line_color};"></i>
                                                <h2>${route.start}</h2>
                                                <span style="background-color:${route.line_color};">${route.line}</span>
                                            </div>
                                            <div class="metro-header-right">
                                                <p>Towards</p>
                                                <h2>${route.towards_station}</h2>
                                            </div>
                                        </div>
                                        <div class="show-station" style="border-left: 2px dashed ${route.line_color};">
                                            <div class="show-all" id="show-all${index}">
                                    <h4">Show all ${route.path.length} stations</h4>
                                    <span><img src="../svg/down.svg" id="show-all-img"></span>
                                                   </div>
                                            <div class="station-details">
                                                <span>${pathTimeDisplay}</span>
                                                <span><img src="../svg/exit.svg" id="station-details-img"></span>
                                                <span>${route.platform_name}</span>
                                            </div>
                                        </div>
                                        <div class="stations-main"  id = "station-main-dis${index}" >
                                            ${route.path.map((station, index) => `
                                                <div class="station-main-all" style="border-left: 2px dashed ${route.line_color}; ${index === route.path.length - 1 ? 'display: none;' : ''}">
                                                    <div class="station-main-details">${station.name}</div>
                                                </div>
                                            `).join('')}
                                        </div>
                                        <div class="metro-header-left">
                                            <i class="gg-pin-alt1" style="background-color:${route.line_color}; border-color: ${route.line_color};"></i>
                                            <h2 id="bottom-heading">${route.end}</h2>
                                            <span id="bottom-span" style="background-color:${route.line_color};">${route.line}</span>
                                        </div>
                                    </div>
                                    ${index === routes.length - 1 ? '' : `
                                        <div class="change-line" id="main-line-change">
                                            <img src="../svg/interchange.svg">
                                            <p>Change here, move towards ${routes[index + 1].line} - 5 min(s)</p>
                                        </div>
                                    `}
                                `;
    
                  
                    //     $(document).on('click', '#show-all' + index, function () {
                    //         console.log("toogled")
    
                    //         $('#station-main-dis' + index).toggle(); // Toggle the visibility of the corresponding 'station-main-all'
                    
    
                    // });
                });
            } else {
                console.error("Routes data is not properly structured or is missing.");
            }
    
            routefetch += `</div>`; // Close the metro-container div
    
    
    
    
            // $('body').children().hide();
            // $('body').append(routefetch);
            document.getElementById('main-route-container').innerHTML = routefetch
            document.getElementById('main-form').style.display = 'none'
            // document.getElementById('draggable').style.display = 'block'
            document.getElementById('main-route-container').style.display = 'flex'
    
            var timetaken = `${totaltime}`
            console.log(timetaken)
            console.log(selectedRouteType)
            if (selectedRouteType === 'minimum-interchange') {
                $('.option h4 ').css('background-color', 'black'),
                    $('#max-interchange').css({
                        'background-color': 'rgb(255 192 192)',
                        'border': '1px solid red ',
                    });
    
                $('#routing1').html(timetaken);
            } else if (selectedRouteType === 'least-distance') {
                $('#routing').html(timetaken);
            }
    
    
    
            setupDraggable();
        }
        function setupDraggable() {
            var isDragging = false;
            var startY;
            var startHeight;
        
            // Flag to check if the log message has been shown
            var hasLogged80Percent = false;
        
            // Initialize smooth scrolling for the document
            document.documentElement.style.scrollBehavior = 'smooth';
        
            $('.slide-bar').on('mousedown touchstart', function (e) {
                isDragging = true;
                startY = e.clientY || e.originalEvent.touches[0].clientY;
                startHeight = $('.content').height();
                e.preventDefault();
            });
        
            $(document).on('mouseup touchend', function () {
                isDragging = false;
                // Reset the flag when dragging stops
                hasLogged80Percent = false;
            });
        
            $(document).on('mousemove touchmove', function (e) {
                if (isDragging) {
                    requestAnimationFrame(() => {
                        var currentY = e.clientY || e.originalEvent.touches[0].clientY;
                        var diff = startY - currentY;
                        var newHeight = startHeight + diff;
        
                        var windowHeight = $(window).height();
                        var navbarHeight = $('.route-navbar').outerHeight();
                        var handleHeight = $('.handle').outerHeight();
                        var maxHeight = windowHeight - navbarHeight - handleHeight;
        
                        if (newHeight < 146) {
                            newHeight = 146;
                        } else if (newHeight > maxHeight) {
                            newHeight = maxHeight;
                        }
        
                        $('.content').css('height', newHeight + 'px');
        
                        // Check if the content has reached or exceeded 80% of the screen height
                        var contentRect = $('.content')[0].getBoundingClientRect();
                        var screenHeight = window.innerHeight;
        
                        if (contentRect.bottom >= screenHeight * 0.8) {
                            if (!hasLogged80Percent) {
                                console.log('Content has reached 80% of the screen height:', newHeight);
                                hasLogged80Percent = true; // Set the flag to true to prevent multiple logs
                            }
                        } else {
                            // Reset the flag if the content is no longer at 80% or more of the screen height
                            hasLogged80Percent = false;
                        }
                    });
                }
            });
        
            $('#zoomable-image').on('click', function () {
                if ($(this).css('cursor') === 'zoom-in') {
                    $(this).css({
                        'transform': 'scale(2)',
                        'cursor': 'zoom-out',
                        'transition': 'transform 0.3s ease'  // Add a smooth transition effect
                    });
                } else {
                    $(this).css({
                        'transform': 'scale(1)',
                        'cursor': 'zoom-in',
                        'transition': 'transform 0.3s ease'  // Add a smooth transition effect
                    });
                }
            });
        }
        
        $(document).ready(function() {
            setupDraggable();
        });
        
        
        
    
        
        
        
        
    
        //    });
    
    
    });
    
    
    
    
    
    
    fetchStations();
    // });
    
    
    
    
    