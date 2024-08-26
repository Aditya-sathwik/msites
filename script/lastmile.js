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
    const url = allinfo.static;
    const method = 'POST';
    const authorizationKey = headers35;

    const requestData = {
        type: "staticPage",
        slug: slug,
        version: 0
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


function renderContent(response, language = 'en') {
    // Ensure response and language data are available
    if (!response || !response.data || !response.data[language]) {
        console.error('Data not available for the specified language.');
        return;
    }
    
    const data = response.data[language].data;
    
    // Check if data contains the expected properties
    if (!data.Erikshaw || !data.EScooter || !data.EAutos || !data.PublicBicycle || !data.CabServices) {
        console.error('Required data properties (Erikshaw, EScooter, EAutos, PublicBicycle, or CabServices) are missing.');
        return;
    }

    // Helper function to render tables
    const renderTable = (tableData, widthArr) => {
        if (!tableData || !widthArr) {
            console.error('Table data or width array is missing.');
            return '';
        }

        const rows = tableData.map(row => 
            `<tr>${row.map((cell, index) => `<td style="width: ${widthArr[index]}px;">${cell || ''}</td>`).join('')}</tr>`
        ).join('');
       
        return `<div class = "tabless"><table>${rows}</table></div>`;

    };

    // Helper function to render bullet points
    const renderBullets = (bullets) => {
        if (!bullets) {
            // console.error('Bullets data is missing.');
            return '';
        }

        return `<ul>${bullets.map(item => `<li>${item}</li>`).join('')}</ul>`;
    };

    // Render E-Rickshaw content
    const eRickshawContent = data.Erikshaw.map(service => {
        if (!service.answer || !service.answer[0] || !service.answer[1] || !service.answer[2]) {
            console.error('Incomplete E-Rickshaw service data.');
            return '';
        }

        return `
            <div class="info-cont" id="e-rickshaw">
                <div class="card-header" data-target="e-rickshaw-card">
                    <h2>${service.question}</h2>
                    <div class="arrow-imgs" id="arrow-e-rickshaw"></div>
                </div>
                <div class="card-body" id="e-rickshaw-card">
                    <h3>Stations with E-Rickshaw Facility</h3>
                    ${renderTable(service.answer[0].tableData, service.answer[0].widthArr)}
                    <h3>Fare</h3>
                    ${renderBullets(service.answer[1].bullets)}
                    <h3>Timings</h3>
                    ${renderBullets(service.answer[2].bullets)}
                </div>
            </div>
        `;
    }).join('');

    // Render E-Scooter content
    const eScooterContent = data.EScooter.map(service => {
        if (!service.answer || !service.answer[0] || !service.answer[1] || !service.answer[2] || !service.answer[3]) {
            console.error('Incomplete E-Scooter service data.');
            return '';
        }

        return `
            <div class="info-cont" id="e-scooter">
                <div class="card-header" data-target="e-scooter-card">
                      <h2>${service.question}</h2>
                    <div class="arrow-imgs" id="arrow-e-scooter"></div>
                </div>
                <div class="card-body" id="e-scooter-card">
                    <h3>Available at Stations</h3>
                    ${renderBullets(service.answer[0].bullets)}
                    <h3>Stations with E-Scooter Facility</h3>
                    ${renderTable(service.answer[1].tableData, service.answer[1].widthArr)}
                    <h3>Fare</h3>
                    ${renderBullets(service.answer[2].bullets)}
                    <h3>Timings</h3>
                    ${renderBullets(service.answer[3].bullets)}
                </div>
            </div>
        `;
    }).join('');

    // Render E-Autos content
    const eAutosContent = data.EAutos.map(service => {
        if (!service.answer || !service.answer[0] || !service.answer[1] || !service.answer[2] || !service.answer[3]) {
            console.error('Incomplete E-Autos service data.');
            return '';
        }

        return `
            <div class="info-cont" id="e-autos">
                <div class="card-header" data-target="e-autos-card">
                      <h2>${service.question}</h2>
                    <div class="arrow-imgs" id="arrow-e-autos"></div>
                </div>
                <div class="card-body" id="e-autos-card">
                    <h3>Available at Stations</h3>
                    ${renderBullets(service.answer[0].bullets)}
                    <h3>Stations with E-Autos Facility</h3>
                    ${renderTable(service.answer[1].tableData, service.answer[1].widthArr)}
                    <h3>Fare</h3>
                    ${renderBullets(service.answer[2].bullets)}
                    <h3>Timings</h3>
                    ${renderBullets(service.answer[3].bullets)}
                </div>
            </div>
        `;
    }).join('');

    // Render Public Bicycle content
    const publicBicycleContent = data.PublicBicycle.map(service => {
        if (!service.answer || !service.answer[0] || !service.answer[1] || !service.answer[2] || !service.answer[3] || !service.answer[4] || !service.answer[5]) {
            console.error('Incomplete Public Bicycle service data.');
            return '';
        }

        return `
            <div class="info-cont" id="public-bicycle">
                <div class="card-header" data-target="public-bicycle-card">
                        <h2>${service.question}</h2>
                    <div class="arrow-imgs" id="arrow-public-bicycle"></div>
                </div>
                <div class="card-body" id="public-bicycle-card">
                    <h3>${service.answer[0].subheading}</h3>
                    <h3>${service.answer[1].subheading}</h3>
                    <h3>${service.answer[2].subheading}</h3>
                    <h3>Stations with Pedal Cycle Facility</h3>
                    ${renderTable(service.answer[3].tableData, service.answer[3].widthArr)}
                    <h3>Stations with Battery Operated Cycle Facility</h3>
                    ${renderTable(service.answer[4].tableData, service.answer[4].widthArr)}
                    <h3>Fare</h3>
                    <h4>For Pedal cycles</h4>
                    ${renderBullets(service.answer[5].bullets)}
                    <h4>For Battery Operated Cycles</h4>
                    ${renderBullets(service.answer[6].bullets)}
                    <h3>Timings</h3>
                    ${renderBullets(service.answer[7].bullets)}
                </div>
            </div>
        `;
    }).join('');

    // Render Cab Services content
    const cabServicesContent = data.CabServices.map(service => {
        if (!service.answer || !service.answer[0] || !service.answer[1] || !service.answer[2]) {
            console.error('Incomplete Cab Services data.');
            return '';
        }

        return `
            <div class="info-cont" id="cab-services">
                <div class="card-header" data-target="cab-services-card">
                       <h2>${service.question}</h2>
                    <div class="arrow-imgs" id="arrow-cab-services"></div>
                </div>
                <div class="card-body" id="cab-services-card">
                    <h3>${service.answer[0].bullets.join('</li><li>')}</h3>
                    <h3>${service.answer[1].subheading}</h3>
                    ${renderTable(service.answer[1].tableData, service.answer[1].widthArr)}
                    <h3>${service.answer[2].subheading}</h3>
                    ${renderBullets(service.answer[2].bullets)}
                    <h3>${service.answer[3].subheading}</h3>
                    ${renderBullets(service.answer[3].bullets)}
                </div>
            </div>
        `;
    }).join('');
   // Render Auto Service content
   const autoServiceContent = data.AutoService.map(service => {
    if (!service.answer || !service.answer[0] || !service.answer[1] || !service.answer[2] || !service.answer[3]) {
        console.error('Incomplete Auto Service data.');
        return '';
    }

    return `
        <div class="info-cont" id="auto-service">
            <div class="card-header" data-target="auto-service-card">
                   <h2>${service.question}</h2>
                <div class="arrow-imgs" id="arrow-auto-service"></div>
            </div>
            <div class="card-body" id="auto-service-card">
                <h3>${service.answer[0].bullets.join('</li><li>')}</h3>
                <h3>${service.answer[1].subheading}</h3>
                ${renderBullets(service.answer[1].bullets)}
                <h3>${service.answer[2].subheading}</h3>
                ${renderBullets(service.answer[2].bullets)}
                <h3>${service.answer[3].subheading}</h3>
                ${renderBullets(service.answer[3].bullets)}
            </div>
        </div>
    `;
}).join('');

// Render Electric Vehicles content
const electricVehiclesContent = data.ElectricVehicles.map(service => {
    if (!service.answer || !service.answer[0] || !service.answer[1] || !service.answer[2] || !service.answer[3]) {
        console.error('Incomplete Electric Vehicles data.');
        return '';
    }

    return `
        <div class="info-cont" id="electric-vehicles">
            <div class="card-header" data-target="electric-vehicles-card">
                  <h2>${service.question}</h2>
                <div class="arrow-imgs" id="arrow-electric-vehicles"></div>
            </div>
            <div class="card-body" id="electric-vehicles-card">
                <h3>${service.answer[0].subheading}</h3>
                ${renderBullets(service.answer[0].bullets)}
                <h3>${service.answer[1].subheading}</h3>
                ${renderTable(service.answer[1].tableData, service.answer[1].widthArr)}
                <h3>${service.answer[2].subheading}</h3>
                ${renderTable(service.answer[2].tableData, service.answer[2].widthArr)}
                <h3>${service.answer[3].subheading}</h3>
                ${renderBullets(service.answer[3].bullets)}
                <h3>${service.answer[4].subheading}</h3>
                ${renderBullets(service.answer[4].bullets)}
            </div>
        </div>
    `;
}).join('');




    // Append content to the page
    $('.last-container').append(eRickshawContent + eScooterContent + eAutosContent + publicBicycleContent + cabServicesContent + autoServiceContent + electricVehiclesContent);

    // Load SVG icons
    loadSVG('DownArrowSVG', '#arrow-e-rickshaw');
    loadSVG('DownArrowSVG', '#arrow-e-scooter');
    loadSVG('DownArrowSVG', '#arrow-e-autos');
    loadSVG('DownArrowSVG', '#arrow-public-bicycle');
    loadSVG('DownArrowSVG', '#arrow-cab-services');
    loadSVG('DownArrowSVG', '#arrow-auto-service');
    loadSVG('DownArrowSVG', '#arrow-electric-vehicles');

    // Toggle card content on click
    $(document).on('click', `.card-header`, function () {
        const target = $(this).data('target');
        $(`#${target}`).slideToggle();
        $(this).toggleClass('active');
    });
}

    






fetchmaininfo("instructions-for-commuters", function(response) {
    renderContent(response);

});