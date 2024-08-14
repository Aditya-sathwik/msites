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



function fetchtermsandconditions() {
    const url = allinfo.static;
    const method = 'POST';
    const authorizationKey = headers34;
    const requestData = ({
        "type": "staticPage",
        "slug":"metro-museum",
        "version": 0
    }); 
    fetchapiData(url, method, authorizationKey, requestData,
        function (response) {
            console.log('Request successful:', response);
         
           
         allterms(response)



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


function allterms(response, language = 'en') {

    if (!response || !response.data || !response.data[language] || !response.data[language].data || response.data[language].data.length === 0) {
        console.error('Invalid response data');
        return;
    }

    
    const musemdata = response.data[language].data[0]; 

    const contdata = `
        <div class="services">
            <h3>${musemdata.timings}</h3>
            <p>${musemdata.answer}</p>
        </div>
        <div class="services">
            <h3>${musemdata.curatorServices}</h3>
            <ul>
                ${musemdata.curatorServicesDetails ? musemdata.curatorServicesDetails.map(detail => `<li>${detail}</li>`).join('') : '<li>Details not available</li>'}
            </ul>
        </div>
        <div class="services">
            <h3>${musemdata.souvenirShop}</h3>
            <ul>
                ${musemdata.souvenirShopDetails ? musemdata.souvenirShopDetails.map(detail => `<li>${detail}</li>`).join('') : '<li>Details not available</li>'}
            </ul>
        </div>
        <div class="services">
            <h3>${musemdata.howToReach}</h3>
            <p>${musemdata.museumLocation}</p>
        </div>
        <div class="icon">
            <img src= "${response.data[language].icon} " alt="Museum Icon">
        </div>
    `;

    // Append the HTML content to the container
    $('.container').append(contdata);
}



fetchtermsandconditions()