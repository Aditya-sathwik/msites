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

    // Convert the HTML string into a jQuery object
    let floatingBox = $(floatingBoxHTML);

    $('body').append(floatingBox);

    // Set a timeout to hide the floating box after 5 seconds
    setTimeout(function () {
        floatingBox.hide();
    }, 3000); // 5000 milliseconds = 5 seconds

    // Return the jQuery object representing the complete floatingBox structure
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

    // Include data only if requestData is not null
    if (requestData !== null && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        ajaxSettings.data = JSON.stringify(requestData);
    }

    // Make the AJAX call
    $.ajax(ajaxSettings);
}



function requestcallback() {
    const url = profilebar.phonecallback;
    const method = 'POST';
    const authorizationKey = headers35;
    const requestData = null; 
    fetchapiData(url, method, authorizationKey, requestData,
        function (data) {
            console.log('Request successful:', data);
            

            createFloatingBox(`created sucessfully`);


        },
        function (xhr, status, error) {
            console.error('Request failed:', error);
            console.error('Response:', xhr.responseText);

            try {
                
                const response = JSON.parse(xhr.responseText);

                if (response && response.message) {
         
                    console.log('Message:', response.message);
                    createFloatingBox(response.message);
                } else {
                    console.error('No message found in response');
                }
            } catch (e) {
                console.error('Error parsing JSON:', e);
            }
        }

    );
}

$(document).on('click', '#Requestcallbacks', function () {
    requestcallback() 
});

$('#emailoption').click(function() {
    window.location.href = 'mailto:support@autope.in?subject=Inquiry&body=Hello,%20I%20would%20like%20to%20inquire%20about...';
});
