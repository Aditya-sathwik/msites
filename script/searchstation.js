
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


function fetchmainstations() {
   

    var url = planyourjourney.stationslist;
    var method = 'GET';
    var authorizationKey = headers35;

    var requestData = null;

    fetchapiData(url, method, authorizationKey, requestData,
        function (data) {
            console.log('Request successful:', data);
            renderStations(data)
        },
        function (xhr, status, error) {
            console.error('Request failed:', error);
        }
    );
}


function renderStations(data) {
    
    const stationList = document.getElementById('stationList');
    if (!stationList) {
        console.error('stationList element not found');
        return;
    }

    const htmlContent = `
        <div class="station-list">
            ${data.results.map(station => `
                <div class="station"  data-code="${station.code}">
                    <div class="station-name"  >
                    
                    ${station.name}
                  
                    </div>
                    <div class = "station-colors">
                    ${station.lineCode.map(line => `
                        <span class="coloring" style="background-color:${line.backcolor}; color:${line.color}; border : 2px solid ${line.color} ">
                            ${line.name}
                        </span>
                    `).join('')}
                </div>
                </div>
            `).join('')}
        </div>
    `;

    stationList.innerHTML = htmlContent;



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
    


    $('.close-btn').on('click', function () {
        console.log("Close button clicked");
        $(this).closest(' .station-modal').hide();
    
    });
    
    // $('#station-search').on('input', function () {
    //     var searchTerm = $(this).val().toLowerCase();
    
    //     $('#main-name').each(function () {
    //         var stationName = $(this).text().toLowerCase();
    //         $(this).toggle(stationName.includes(searchTerm));
    //     });
    
    //     if (!searchTerm) {
    //         $('#station-list li').show();
    //     }
    // });

    $('#station-search').on('input', function () {
        var searchTerm = $(this).val().toLowerCase();
        
        $('.station').each(function () {
            var stationName = $(this).find('.station-name').text().toLowerCase();
            $(this).toggle(stationName.includes(searchTerm));
        });
    });

    



}



$(document).on('click', '.station', function () {
 
    var maincode = $(this).data('code');
    history.pushState({ page: 'aboutstation' }, '', '?state=aboutstation');
    $('.metrolines-list').show();
    $('.stations-list').hide();
  

        mainaboutstation(maincode, 'stationdiv');
   

});





fetchmainstations()








