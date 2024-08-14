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



function helplines(response, language = 'en') {


    const help = response.data[language]; 


    var helptext = `        <div class="content">
            <img src="${help.icon}" alt="Operator" class="operator-image">
            <h2>${help.sectionTitle}</h2>

            <div class="contact-list">
                ${help.data.map((item, index) => {
        return `

                <div class="contact-item" id = "item-${index}">
                <span class = "label">${item.label}</span>
                <span class = "number">${item.number}</span>
                </div>
                 `;
    }).join('')}
            </div>

        
        </div>`

        $('.others-container').empty()
        $('.others-container').append(helptext);

    }

function emergency(response, language = 'en') {


    const emer = response.data[language]; 


    var emertext = `    
    
        <div class="contacts-container">
        <h2>${emer.heading}</h2>



    
                ${emer.contacts.map((item, index) => {
        return `

                <div class="number-item">
            <img src="${item.icon}" alt="All Emergencies">
            <div>
                <span>${item.label}</span>
                <span>${item.number}</span>
            </div>
        </div>
               
                 `;
    }).join('')}

<p> ${emer.infoText} <span></span></p>


<h2>${emer.disclaimerHeading}</h2>

<p id = "dis-text"> ${emer.disclaimerText} </p>

    </div>

 `

        $('.others-container').empty()
        $('.others-container').append(emertext);

    }














    $(document).on('click', '#helpline', function () {

        fetchmaininfo("dmrc-helpline", function(response) {
            
            helplines(response);
        });
        
        $('.info-list').hide()
        $('.infos-container').show()
     
    })
    $(document).on('click', '#general-info', function () {

        fetchmaininfo("general-information-on-delhi", function(response) {
            
            emergency(response);
        });
        
        $('.info-list').hide()
        $('.infos-container').show()
     
    })


loadSVG('info', '#info-icon');
loadSVG('network_info', '#network-info-icon');
loadSVG('card_token', '#ticket-card-icon');
loadSVG('near_metro', '#near-metro-icon');
loadSVG('geninfo', '#general-info-icon');
loadSVG('website', '#dmrc-website-icon');
loadSVG('feedback', '#feedback-icon');
loadSVG('tnc', '#terms-icon');
loadSVG('arrownext', '#arrow-helpline');
loadSVG('arrownext', '#arrow-network-info');
loadSVG('arrownext', '#arrow-ticket-card');
loadSVG('arrownext', '#arrow-near-metro');
loadSVG('arrownext', '#arrow-general-info');
loadSVG('arrownext', '#arrow-dmrc-website');
loadSVG('arrownext', '#arrow-feedback');
loadSVG('arrownext', '#arrow-terms');