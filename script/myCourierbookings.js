function applyThemeProperties(properties) {
    const root = document.documentElement; // or use document.body

    // Background colors
    root.style.setProperty('--bgColor', properties.bgColor);
    root.style.setProperty('--bottomBgColor', properties.bottomBgColor);
    root.style.setProperty('--headerColor1', properties.headerColor1);
    root.style.setProperty('--headerColor2', properties.headerColor2);
    root.style.setProperty('--iconBgColor', properties.iconBgColor);
    root.style.setProperty('--specialButtonBackgroundColor', properties.specialButtonBackgroundColor);
    root.style.setProperty('--statusBarColor', properties.statusBarColor);

    // Text colors
    root.style.setProperty('--bottomTextActiveColor', properties.bottomTextActiveColor);
    root.style.setProperty('--bottomTextInActiveColor', properties.bottomTextInActiveColor);
    root.style.setProperty('--buttonTextColor', properties.buttonTextColor);
    root.style.setProperty('--buttonTextInActiveColor', properties.buttonTextInActiveColor);
    root.style.setProperty('--checkBoxInActiveColor', properties.checkBoxInActiveColor);
    root.style.setProperty('--headerTextColor', properties.headerTextColor);
    root.style.setProperty('--iconBgFrontColor', properties.iconBgFrontColor);
    root.style.setProperty('--radioBoxInActiveColor', properties.radioBoxInActiveColor);
    root.style.setProperty('--subTextColor', properties.subTextColor);
    root.style.setProperty('--textColor', properties.textColor);
    root.style.setProperty('--viewAllTextColor', properties.viewAllTextColor);

    // Button colors
    root.style.setProperty('--buttonBgColor', properties.buttonBgColor);
    root.style.setProperty('--buttonBgInActiveColor', properties.buttonBgInActiveColor);

    // Checkbox and radio button colors
    root.style.setProperty('--checkBoxActiveColor', properties.checkBoxActiveColor);
    root.style.setProperty('--checkBoxBorderColor', properties.checkBoxBorderColor);
    root.style.setProperty('--radioBoxActiveColor', properties.radioBoxActiveColor);

    // Icon and shadow colors
    root.style.setProperty('--iconBorderColor', properties.iconBorderColor);
    root.style.setProperty('--iconWidgetColor', properties.iconWidgetColor);
    root.style.setProperty('--shadowColor', properties.shadowColor);
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

    // Include data only if requestData is not null
    if (requestData !== null && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        ajaxSettings.data = JSON.stringify(requestData);
    }

    // Make the AJAX call
    $.ajax(ajaxSettings);
}



function courierbookingdata() {

    var url = mycouriers.getUserorders;
    var method = 'GET';
    var authorizationKey = headers35;

    var requestData = null;

    fetchapiData(url, method, authorizationKey, requestData,
        function (data) {
            console.log('Request successful:', data);
            mybookings(data)

        },
        function (xhr, status, error) {
            console.error('Request failed:', error);

        }
    );
}
function truncateAddress(address, maxChars) {
    // Check if address is a string
    if (typeof address !== 'string') {
        console.error('Invalid address:', address);
        return 'Address not available';
    }

    // Truncate the address to the maximum character limit
    if (address.length > maxChars) {
        return address.substring(0, maxChars) + '...';
    }

    // Return the address if it's within the character limit
    return address;
}




function mybookings(data) {

    console.log('Data received:', data);


    if (!Array.isArray(data.results)) {
        console.error('Expected data.result to be an array but got:', data.results);
        return;
    }

    if (data.results.length === 0) {
        // Append image if no bookings
        var noDataImage = `<div id ="no-courier" ><img src="../assets/no_locker.svg" alt="No bookings available" class="no-bookings-image">
            <h4>No Courier Boooking</h4>
            </div>`;
        $('#bookingcontainer').append(noDataImage);
        return;
    }

    $('#bookingcontainer').empty();

    data.results.map((item, index) => {
        let deliveryAddress = item.receiverAddress || '';

        let truncatedAddress = truncateAddress(deliveryAddress, 20);
        var bookingsbox = `  <div class="box">
                      <div class="header">
                        <div class="booking-id">
                          <h4>Booking ID:</h4>
                          <p> ${item.bookingID} </p>
                        </div>
                        <div class="order-status">
                          <h4>Order status</h4>
                          <p> ${item.orderStatus}</p>
              
                        </div>
                      </div>
                      <div class="content">
                        <div class="left-img"><img src="../assets/download.svg"
                            alt="doc img"></div>
                        <div class="details">
                          <div class="delivery-address">
              
                            <p>delivery-address</p>
                       <p>${truncatedAddress}</p>
                          </div>
              
                          <p class="price">₹ ${item.finalAmount} </p>
                        </div>
                        <div class="parcel-weight">
                          <p>Parcel Weight: </p>
                          <p>${item.itemWeight} gr.</p>

                            <p id = "pinvalue${index}" >Pin :<span> ${item.pin}</span></p>
                        </div>
                        <div class="right-arrow" id = "details-${index}" data-courierid="${item.bookingID}"><img src="../svg/arrownext.svg"
                            alt="doc img"></div>
                      </div>
                    </div>

`

        $('#bookingcontainer').append(bookingsbox);


        if (item.pin === null) {
            $(`#pinvalue${index}`).hide();
        } else {
            $(`#pinvalue${index}`).show();
        }

        // $(document).on('click', `#tarif-coupen-${index}`, function () {

        //     $(`#total-input-check-${index}`).toggle();
        //     if ($(`#total-input-check-${index}`).is(':visible')) {
        //         $(this).closest('.tarif-show').css('height', 'auto');
        //     } else {
        //         $(this).closest('.tarif-show').css('height', 'initial');
        //     }
        // })




    });



    // $('#tarrif').css('display', 'block');

    // $('.sf2').css('filter', 'blur(10px)');




}




function courierbookingdetailsapi(mainbookingid) {
    var mainbookingid
    var url = mycouriers.booking + mainbookingid;
    var method = 'GET';
    var authorizationKey = headers35;

    var requestData = null;

    fetchapiData(url, method, authorizationKey, requestData,
        function (data) {
            console.log('Request successful:', data);
            console.log(mainbookingid)
            myCourierbookingdetails(data)

        },
        function (xhr, status, error) {
            console.error('Request failed:', error);

        }
    );
}



$(document).on('click', `.right-arrow`, function () {

    var mainbookingid = $(this).data('courierid')
    courierbookingdetailsapi(mainbookingid)

})

let lockerid
function myCourierbookingdetails(data) {
    console.log('Data received:', data);

    $('#booking-detail').empty();

    
    let filteredTrackings = [];
    if (data.status === 'Payment Failed') {
        filteredTrackings = data.trackings;
    } else {
        filteredTrackings = data.trackings;
    }

    lockerid = data.lockerOrderId;

    
    var bookingsdetails = `
    <div class="details-container">
        <div id="toppart">
            <div class="status">
                <span class="label">Status:</span>
                <span class="value">${data.status}</span>
            </div>
            <div class="mobile">
                <span class="label">Mobile No:</span>
                <span class="value">${data.senderMobileNo}</span>
            </div>
            ${data.status === 'Locker Assigned' ? `
            <div class="locker-pin">
                <span class="label">Locker Pin:</span>
                <span class="value">${data.lockerPIN}</span>
            </div>
            <div class="button-div">
                <button class="scan-qr-code" id="scanQr">SCAN QR CODE</button>
            </div>` : ''}
        </div>

        <div class="track">
            <div id="cancel-div">
                <h2>Track your courier</h2>
                ${data.trackings.some(tracking => tracking.status === data.status && tracking.cancellable) ? `<button id="cancel-button" data-bid="${data.bookingID}" >cancel</button>` : ''}
            </div>
            <div class="expected-date">
                <span class="label">Expected Delivery Date:</span>
                <span class="value">04/02/2024</span>
            </div>
            <div class="expected-date2">
                <span class="label">Description</span>
                <span class="value2">Status</span>
            </div>
            <div class="main-status">
      <div class="tracking-status">
    ${filteredTrackings.length > 0 && filteredTrackings[filteredTrackings.length - 1].description ? `
        <p>${filteredTrackings[filteredTrackings.length - 1].description}</p>
    ` : ''}
    ${filteredTrackings.map((tracking, index) => `
    <div class="step">
        ${index === filteredTrackings.length - 1 ? '<i class="gg-shape-circle"></i>' : '<img id="tracking-img" src="../svg/tracker.svg" alt="track">'}
        <span class="text ${index === filteredTrackings.length - 1 ? 'last-step-text' : ''}">
            ${tracking.status}
        </span>
    </div>`).join('')}
</div>

            </div>
        </div>
        <div class="accordion">
            <div class="accordion-item">
                <div class="accordion-title" data-target="courier-details">
                    <h4>Courier Details</h4> 
                    <img src="../assets/downArrow.svg" alt="down arrow">
                </div>
                <div class="accordion-content" id="courier-details">
                    <div class="accordion-row">
                        <p class="label">Amount:</p>
                        <p class="value">₹${data.amount}</p>
                    </div>
                    <div class="accordion-row">
                        <p class="label">Receiver's Name:</p>
                        <p class="value">${data.receiverName}</p>
                    </div>
                    <div class="accordion-row">
                        <p class="label">Receiver's Mobile No:</p>
                        <p class="value">${data.receiverMobileNo}</p>
                    </div>
                    <div class="accordion-row">
                        <p class="label">Courier Partner:</p>
                        <p class="value">${data.courierPartner}</p>
                    </div>
                    <div class="accordion-row">
                        <p class="label">Dropbox Station:</p>
                        <p class="value">${data.dropboxStation}</p>
                    </div>
                    <div class="accordion-row">
                        <p class="label">Delivery Address:</p>
                        <p class="value">${data.receiverAddress}</p>
                    </div>
                    <div class="accordion-row">
                        <p class="label">Sender Address:</p>
                        <p class="value">${data.senderAddress}</p>
                    </div>
                </div>
            </div>
            <div class="accordion-item">
                <div class="accordion-title" data-target="item-info">
                    <h4>Item Info</h4>
                    <img src="../assets/downArrow.svg" alt="down arrow">
                </div>
                <div class="accordion-content" id="item-info">
                    <div class="accordion-row">
                        <span class="label">Item Type:</span>
                        <span class="value">${data.itemInfo[0].itemType}</span>
                    </div>
                    <div class="accordion-row">
                        <span class="label">Item Weight:</span>
                        <span class="value">${data.itemInfo[0].itemWeight}gm</span>
                    </div>
                    <div class="accordion-row">
                        <span class="label">Fragile Item:</span>
                        <span class="value">${data.itemInfo[0].fragileItem === 'YES' ? 'YES' : 'NO'}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

    $('#booking-detail').append(bookingsdetails);

    $('.booking-row').hide();
    $('.booking-details-container').show();

    $(document).on('click', `.accordion-title`, function () {
        var target = $(this).data('target');
        $('#' + target).slideToggle();
        $(this).toggleClass('active');
    });
}


$(document).on('click', '#cancel-button', function () {
    console.log("clickk")
    $('#custom-alert').show();

    var bookid = $(this).data('bid');
    $('#cancel-delete').one('click', function () {
        $('#custom-alert').hide();
    });
    $('#delete-continue').one('click', function () {

        function deletecourier(bookid) {
            var url = mycouriers.deletecourier+bookid;
            var method = 'PATCH';
            var authorizationKey = headers35;
            var requestData = null;

            fetchapiData(url, method, authorizationKey, requestData,
                function (data) {
                    window.location.reload();
                    alladdress(myaddresses)
                    console.log('Delete request successful:');
                    createFloatingBox(`sucessfully deleted`);

                    
                },
                function (xhr, status, error) {
                    console.error('Delete request failed:', error);
                    console.error('Response:', xhr.responseText);
                    createFloatingBox(`${xhr.responseText}`);
                }
            );
        }

        deletecourier(bookid); 
    });
});
$(document).on('click', '#scanQr', function () {
    $(".scanner-container").toggle();
    checkCameraPermission();
    checkLocationPermission();
});

function checkCameraPermission() {
    Instascan.Camera.getCameras()
        .then(cameras => {
            if (cameras.length > 0) {
                startScanner(cameras[0]);
            } else {
                console.error('No cameras found.');
                alert('No cameras found.');
            }
        })
        .catch(error => {
            console.error('Error accessing camera:', error);
            alert('Error accessing camera.');
        });
}

function checkLocationPermission() {
    if ("geolocation" in navigator) {
        navigator.permissions.query({ name: 'geolocation' })
            .then(result => {
                if (result.state === 'granted') {
                    getLocationAndProcess();
                } else if (result.state === 'prompt') {
                    showLocationDialog();
                } else if (result.state === 'denied') {
                    $('#locationDialog').show();
                }
            });
    } else {
        alert("Geolocation is not supported by your browser");
    }
}

function startScanner(camera) {
    let scanner = new Instascan.Scanner({ video: document.getElementById('video-preview') });
    scanner.addListener('scan', function (content) {
        handleScan(content);
    });
    scanner.start(camera);
}

function showLocationDialog() {
    $('#locationDialog').show();
    $('#allowBtn').on('click', function () {
        $('#locationDialog').hide();
        requestLocationAccess();
    });
}

function requestLocationAccess() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            handleLocation(position.coords.latitude, position.coords.longitude);
        }, error => {
            handleLocationError(error);
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

function getLocationAndProcess() {
    navigator.geolocation.getCurrentPosition(position => {
        handleLocation(position.coords.latitude, position.coords.longitude);
    }, error => {
        handleLocationError(error);
    });
}

let scannedText = null;
let userLocation = { latitude: null, longitude: null };

function handleScan(content) {
    scannedText = content;
    processScanAndLocation();
}

function handleLocation(latitude, longitude) {
    userLocation.latitude = latitude;
    userLocation.longitude = longitude;
    processScanAndLocation();
}

function processScanAndLocation() {
    if (scannedText && userLocation.latitude && userLocation.longitude) {
     
        $('#locationInfo').text("Latitude: " + userLocation.latitude + ", Longitude: " + userLocation.longitude);
        sendDataToServer(scannedText, userLocation.latitude, userLocation.longitude);
    } else {
        console.log("Waiting for both scan and location...");
    }
}

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

function sendDataToServer(scannedText, latitude, longitude) {
    console.log("Sending data to server:", scannedText, latitude, longitude);

    console.log(lockerid)

    $.ajax({
        url: mycouriers.lockeropening, 
        method: 'POST',
        headers: headers35, 
        data: JSON.stringify({
            stationCode: scannedText,
            orderId: lockerid,
            userLat: latitude,
            userLong: longitude
        }),
        contentType: 'application/json', 
        success: function(response) {
            console.log('Data sent successfully:', response);
            if (response.code === 200 && response.message === 'Locker open success') {
                $(".scanner-container").hide();
                courierbookingdata();
            }
        },
        error: function(xhr, status, error) {
            console.log('Request failed:', error);
        }
    });
}



$(document).on('click', '#backimg1', function () {
    $('.booking-details-container').hide();
    $('.booking-row').show();
});










courierbookingdata() 