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




function fetchplaceslist() {
   

    var url = tour.guidelist;
    var method = 'GET';
    var authorizationKey = headers35;

    var requestData = null;

    fetchapiData(url, method, authorizationKey, requestData,
        function (data) {
            console.log('Request successful:', data);
            renderlocations(data)
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

function renderlocations(data) {
    window.metroData = data;
    $('.tour-cont').empty();

    data.map((item, index) => {
        let deliveryAddress = item.placeName || '';
        let truncatedName = truncateAddress(deliveryAddress, 30);

        let htmlContent = `
            <div class="location-item"  data-index="${index}"  data-truncated-name="${truncatedName}">
                <div class="ic-item">
                    <img src="${item.placeImage}" alt="${item.placeName}">
                    <div class="location-info">
                        <h2>${truncatedName}</h2>
                        <p>Nearest Metro: ${item.placeNearestMetroStation}</p>
                        <p>Distance from Metro: ${item.placeDistance} Km</p>
                    </div>
                </div>
                <div class="arrow-imgs" id="arrow-ticket-${index}"></div>
            </div>
        `;

        $('.tour-cont').append(htmlContent);
        loadSVG('arrownext', `#arrow-ticket-${index}`);
    });

    $('#search-icon').click(function () {
        $('.searches').css('display','flex');
       
        $('#heading').hide();
        $('#imgs').hide();
        
    });

    $('#clear-icon').click(function () {
        clearsearch();
    });

    function clearsearch() {
        $('#station-search').val('');
        $('.location-item').show();
        $('.searches').hide();
        // $('#clear-icon').hide();
        // $('#search-icon2').hide();
        // $('#station-search').hide();
        $('#heading').show();
        $('#imgs').show();
    }

    $('#station-search').on('input', function () {
        var searchTerm = $(this).val().toLowerCase();

        $('.location-item').each(function () {
            var truncatedName = $(this).data('truncated-name').toLowerCase();
            $(this).toggle(truncatedName.includes(searchTerm));
        });
    });

    $('.close-btn').on('click', function () {
        console.log("Close button clicked");
        $(this).closest('.station-modal').hide();
    });
}


function detailstation(data, mainindex){

    const item = data[mainindex];

 var mapurl = `https://www.google.com/maps/search/?api=1&query=${item.nearestMetroStation.geoloc.coordinates[0]},${item.nearestMetroStation.geoloc.coordinates[1]}`
 

 $('#mname').html(item.placeName);
    var aboutstation = `
       <div class="place-container">
        <div class="image-container">
            <img src="${item.placeImage}" alt="${item.placeName}">
                                    <a class= "map-btn" href="${mapurl}" >
                            <img src="../assets/direction.svg" alt="direction" >
                           
                        </a>
        </div>
        <div class="info">
            <p>Nearest Metro: <span>${item.placeNearestMetroStation}</span></p>
            <p>Distance: <span>${item.placeDistance} KM</span></p>
            <p>Walking Time: <span>${item.placeEstimatedWalkingTimeMin} Min(s)</span></p>
            <p>Public Transport: <span>${item.placeEstimatedPubTransportTimeMin} Min(s)</span></p>
        </div>
        <div class="description">
            ${item.placeDescription}
        </div>
    <div class="buttons">
<button class="details-button"   data-code="${item.nearestMetroStation.code}"   id = "stationdetails">STATION DETAILS</button>
<button class="plan-button">PLAN YOUR JOURNEY</button>
</div>

    </div>
    `;
    $('.detailed-cont').empty();
    $('.detailed-cont').append(aboutstation);


}



$(document).on('click', '.location-item', function () {
    var mainindex = $(this).data('index');

    var data = window.metroData; 
    
   
    detailstation(data, mainindex);
    history.pushState({ page: 'placedetails' }, '', '?state=placedetails');

    $('.tour-list').hide();
    $('.detailed-station').show();
    $('.metrolines-station-details').hide();

});

$(document).on('click', '#stationdetails', function () {

    var maincode = $(this).data('code');
    history.pushState({ page: 'aboutstation' }, '', '?state=aboutstation');
    $('.tour-list').hide();
    $('.detailed-station').hide();
    $('.metrolines-station-details').show();

        mainaboutstation(maincode, 'stationdiv');
});





$(document).ready(function() {

    window.addEventListener('popstate', function(event) {
        var state = event.state ? event.state.page : null;
    
        switch (state) {
       
            case 'placedetails':
                $('.tour-list').hide();
                $('.detailed-station').show();
                $('.metrolines-station-details').hide();
                break;
            case 'aboutstation':
                $('.tour-list').hide();
                $('.detailed-station').hide();
                $('.metrolines-station-details').show();
                break;
            default:
                $('.tour-list').show();
                $('.detailed-station').hide();
                $('.metrolines-station-details').hide();
                break;
        }
    });
    
    function checkInitialState() {
        const params = new URLSearchParams(window.location.search);
        const state = params.get('state');
        
        switch (state) {
       
            case 'placedetails':
                $('.tour-list').hide();
                $('.detailed-station').show();
                $('.metrolines-station-details').hide();
                break;
            case 'aboutstation':
                $('.tour-list').hide();
                $('.detailed-station').hide();
                $('.metrolines-station-details').show();
                break;
            default:
                $('.tour-list').show();
                $('.detailed-station').hide();
                $('.metrolines-station-details').hide();
                break;
        }
    }
    
    
        checkInitialState();
     
    });



    $(document).on('click', '.leftMetro', function () {
        $('.tour-list').show();
        $('.detailed-station').hide();
        $('.metrolines-station-details').hide();
    
    
    })
    $(document).on('click', '.mainback', function () {
        $('.tour-list').hide();
        $('.detailed-station').show();
        $('.metrolines-station-details').hide();
    
    
    })




fetchplaceslist()