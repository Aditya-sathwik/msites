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



function rails(response, language = 'en') {


    const railsnear = response.data[language]; 


    var helptext = `      <div class="container">
    
                ${railsnear.stations.map((item, index) => {
        return `
        <div class="station-card">
            <div class="icon">
                <img src="../assets/Delhi_Metro_logo.svg.png" alt="Metro Icon">
            </div>
            <div class="station-details">
                <h3>${item.name}</h3>
                <p>Nearest Metro Station: ${item.metroStation}</p>
                <p>Distance From Nearest Metro: ${item.distance}</p>
            </div>
        </div>
                 `;
    }).join('')}
    

       

    </div>`

        $('.rail-cont').empty()
        $('.rail-cont').append(helptext);

    }


    fetchmaininfo("railway-station-near-to-metro", function(response) {
            
       rails(response);
    });