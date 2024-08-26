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




function fetchmaininfo(slug, helplinesCallback) {
    var url = allinfo.static;
    var method = 'POST';
    var authorizationKey = headers35;

    const requestData = {
        "type": "staticPage",
        "slug": `${slug}`,
        "version": 0
    };

    fetchapiData(url, method, authorizationKey, requestData,
        function (response) {
            console.log('Request successful:', response);
            helplinesCallback(response);
        },
        function (xhr, status, error) {
            console.error('Request failed:', error);
        }
    );
}



function parkings(response, language = 'en') {
    // Extract the relevant data based on the language
    const data = response.data[language];
    const parkingFacilities = data.ParkingFacilities;
    const metroStationCharges = data.parkingCharges.metroStationCharges.typesOfVehicles;
    const delhiAirportLineCharges = data.parkingCharges.delhiAirportLineCharges;
    const nehruPlaceParkingCharge = data.parkingCharges.nehruPlaceParkingCharge;
    const nehruPlaceText = data.parkingCharges.nehruPlaceText;
    const millenniumCityCentreGurugramCharges = data.parkingCharges.millenniumCityCentreGurugramCharges.vehicles;
    const millenniumCityCentreGurugramTitle = data.parkingCharges.millenniumCityCentreGurugramCharges.title;

    // Generate the HTML content for parking facilities
    var facilitiesContent = `

        <div class="image-container">
            <img src="../assets/cars.jpg" alt="Parking Image" class="parking-image">
            <div class="gradient-overlay"></div>
        </div>
        <div class="content">
            <ul class="info-list">
                <li>${parkingFacilities.description}</li>
                <li>${parkingFacilities.outsourced}</li>
                <li>${parkingFacilities.subheading}</li>
                ${parkingFacilities.responsibilities.map(responsibility => `<li>${responsibility}</li>`).join('')}
                <li>${parkingFacilities.supervision}</li>
            </ul>

            <div id = "Metro-Station-Charges"  class = "diff">
   
            <div class="charges-section">
                ${metroStationCharges.map(vehicle => `
                    <h2>${data.parkingCharges.title}</h2>
               
                    <div class="charges">
                      <h3>${vehicle.vehicleType}</h3>
                        <p>${vehicle.day}</p>
                        <div class="charge-row">
                            <span>${vehicle.upTo6HrsText}</span>
                            <span>${vehicle.upTo6Hrs}</span>
                        </div>
                        <div class="charge-row">
                            <span>${vehicle.upTo12HrsText}</span>
                            <span>${vehicle.upTo12Hrs}</span>
                        </div>
                        <div class="charge-row">
                            <span>${vehicle.upTo24HrsText}</span>
                            <span>${vehicle.upTo24Hrs}</span>
                        </div>
                        <div class="charge-row">
                            <span>${vehicle.monthlyChargesText}:</span>
                            <span>${vehicle.monthlyCharges}</span>
                        </div>
                        <p>${vehicle.nightCharges.night}</p>
                        <div class="charge-row">
                            <span>${vehicle.nightCharges.textdaily}:</span>
                            <span>${vehicle.nightCharges.daily}</span>
                        </div>
                        <div class="charge-row">
                            <span>${vehicle.nightCharges.textmonth}:</span>
                            <span>${vehicle.nightCharges.monthly}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            </div>
           

            <!-- Delhi Airport Line Charges -->
                  <div id = "delhi-airport"  class = "diff">
            <h2>${delhiAirportLineCharges.title}</h2>
            <div class="charges-section">
                ${delhiAirportLineCharges.typesOfVehicles.map(vehicle => `
                    
                    <div class="charges">
                        <h3>${vehicle.vehicleType}</h3>
                        <div class="charge-row">
                            <span>${vehicle.upTo6HrsText}</span>
                            <span>${vehicle.upTo4Hrs}</span>
                        </div>

                        <div class="charge-row">
                            <span>${vehicle.upTo12HrsText}</span>
                            <span>${vehicle.upTo12Hrs}</span>
                        </div>
                        <div class="charge-row">
                            <span>${vehicle.upTo24HrsText}</span>
                            <span>${vehicle.upTo24Hrs}</span>
                        </div>
                        <div class="charge-row">
                            <span>${vehicle.monthlyChargesText}:</span>
                            <span>${vehicle.monthlyCharges}</span>
                        </div>
                      
                    </div>
                `).join('')}
            </div>
            </div>

            <!-- Nehru Place Parking Charges -->
                  <div id = "nehru-place"  class = "diff">
            <h2>${nehruPlaceText}</h2>
            <div class="charges-section">
                <div class="charges">
                    <p>${nehruPlaceParkingCharge}</p>
                </div>
            </div>
            </div>

                  <div id = "gurugram-carges"  class = "diff">
            <!-- Millennium City Centre Gurugram Charges -->
            <h2>${millenniumCityCentreGurugramTitle}</h2>
            <div class="charges-section">
                ${millenniumCityCentreGurugramCharges.map(vehicle => `
                   
                    <div class="charges">
                        <h3>${vehicle.vehicleType}</h3>
                        <div class="charge-row">
                            <span>${vehicle.upTo6HrsText}</span>
                            <span>${vehicle.upTo6Hrs}</span>
                        </div>
                        <div class="charge-row">
                            <span>${vehicle.upTo12HrsText}</span>
                            <span>${vehicle.upTo12Hrs}</span>
                        </div>
                        <div class="charge-row">
                            <span>${vehicle.upTo24HrsText}</span>
                            <span>${vehicle.upTo24Hrs}</span>
                        </div>
                        <div class="charge-row">
                            <span>${vehicle.nightChargesText}:</span>
                            <span>${vehicle.nightCharges}</span>
                        </div>
                        <div class="charge-row">
                            <span>${vehicle.monthlyCharges.monthlyChargesText}:</span>
                            <span>${vehicle.monthlyCharges.day}</span>
                        </div>
                        <div class="charge-row">
                            <span>${vehicle.monthlyCharges.night}:</span>
                            <span>${vehicle.monthlyCharges.dayAndNight}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
            </div>
        </div>
    `;
    $('.park-cont').empty();
    $('.park-cont').append(facilitiesContent);
}



    fetchmaininfo("feeder-buses", function(response) {
            
        parkings(response)
    });