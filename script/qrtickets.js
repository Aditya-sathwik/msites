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
    const faqSection = $('.topone');
    const data = response.data?.[language];

    const benefitsSection = `
        <div class="card-header" data-target="maincard">
            <div class="ico-img">
                <img src="${data.Benefits.image}" alt="Smart Card Icon">
                <h2>${data.Benefits.heading}</h2>
            </div>
            <div class="arrow-imgs" id="arrow-helpline1"></div>
        </div>
        <div class="card-body" id="maincard">
            <h3>${data.Benefits.title}</h3>
            <ul>${data.Benefits.bullets.map(item => `<li>${item}</li>`).join('')}</ul>
    `;

    const purchaseSection = `
        <h3>${data.Purchase.title}</h3>
        <ul>${data.Purchase.bullets.map(item => `<li>${item}</li>`).join('')}</ul>
    `;

    const rechargeSection = `
        <h3>${data.Recharge.title}</h3>
        <h4>${data.Recharge.subtitle}</h4>
        <ul>${data.Recharge.customerCareCentre.map(item => `<li>${item}</li>`).join('')}</ul>
        <h4>${data.Recharge.ticketVending}</h4>
        <ul>${data.Recharge.ticketVendingMachine.map(item => `<li>${item}</li>`).join('')}</ul>
        <h4>${data.Recharge.subtitleonline}</h4>
        <ul>${data.Recharge.creditDebitCard.map(item => `<li>${item}</li>`).join('')}</ul>
        <p>${data.Recharge.onlineRecharge}</p>
        <h4>${data.Recharge.autoTopUpSubTitle}</h4>
        <ul>${data.Recharge.autoTopUp.map(item => `<li>${item}</li>`).join('')}</ul>
        <p>${data.Recharge.maxAmount}</p>
        <p>${data.Recharge.validity}</p>



  `;


    const discountSection = `
    <h3>${data.Discount.title}</h3>
    <ul>
        ${data.Discount.bullets.map(item => `<li>${item}</li>`).join('')}
    </ul>
   <div class = "table">
  <h4>${data.Discount.table.heading[0]}</h4>
  <table class="discount-table">

        <thead>
            

            <tr>
                <th>From</th>
                <th>Till</th>
            </tr>
        </thead>
        <tbody>
            ${data.Discount.table.tableData[0].slice(1).map((_, index) => `
                <tr>
                    <td>${data.Discount.table.tableData[0][index + 1]}</td>
                    <td>${data.Discount.table.tableData[1][index + 1]}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
   
    </div>
     <p>${data.Discount.additionalNote}</p>
    </div>
`;


    const totalContent = benefitsSection + purchaseSection + rechargeSection + discountSection;
    
    faqSection.empty().append(totalContent);
    loadSVG('DownArrowSVG', '#arrow-helpline1');

    $(document).on('click', `.card-header`, function () {
        const target = $(this).data('target');
        $(`#${target}`).slideToggle();
        $(this).toggleClass('active');
    });
}

function renderTouristCard(response, language = 'en') {
    const tourdata = response.data?.[language].TouristCard;
    const tourbody = response.data?.[language].TouristCard.content[0];

    const tourists = `
        <div class="info-cont" id="touristes">
            <div class="card-header" data-target="maincard1">
                <div class="ico-img">
                    <img src="${tourdata.image}" alt="Smart Card Icon">
                    <h2>${tourdata.heading}</h2>
                </div>
                <div class="arrow-imgs"  id = "arrow-helpline2"></div>
            </div>
            <div class="card-body" id="maincard1">
                <h2>${tourbody.title}</h2>
                <h3>${tourbody.subtitleOne}</h3>
                <ul>${tourbody.bullets.map(item => `<li>${item}</li>`).join('')}</ul>
                <h3>${tourbody.subtitleThree}</h3>
                <ul>${tourbody.bulletsThree.map(item => `<li>${item}</li>`).join('')}</ul>
            </div>
        </div>
    `;

    $('.bottomone').append(tourists);
    loadSVG('DownArrowSVG', '#arrow-helpline2');
}

function renderMobility(response, language = 'en') {
    const mobilidata = response.data?.[language].NationalCommonMobilityCard;
    const mobilibody = response.data?.[language].NationalCommonMobilityCard.content;

    const mobilityContent = `
        <div class="info-cont" id="touristes">
            <div class="card-header" data-target="maincard2">
                <div class="ico-img">
                    <img src="${mobilidata.image}" alt="Smart Card Icon">
                    <h2>${mobilidata.heading}</h2>
                </div>
                <div class="arrow-imgs" id="arrow-helpline3"></div>
            </div>
            <div class="card-body" id="maincard2">
                <h3>${mobilidata.subtitleOne}</h3>
                <h3>${mobilidata.subtitleTwo}</h3>
                ${mobilibody.map(item => `
                    <h3>${item.title}</h3>
                    ${item.bullets.map(i => `
                        <ul><li>${i}</li></ul>
                    `).join('')}
                `).join('')}
                <h3>${mobilidata.subtitleThree}</h3>
            </div>
        </div>
    `;

    $('.bottomone').append(mobilityContent);
    loadSVG('DownArrowSVG', '#arrow-helpline3');
}

function renderAppQR(response, language = 'en') {
    const qrdata = response.data?.[language].QRSystem;
    const qrbody = response.data?.[language].QRSystem.content;

    const qrsContent = `
        <div class="info-cont" id="touristes">
            <div class="card-header" data-target="maincard3">
                <div class="ico-img">
                    <img src="${qrdata.image}" alt="Smart Card Icon">
                    <h2>${qrdata.heading}</h2>
                </div>
                           <div class="arrow-imgs" id="arrow-helpline4"></div>
            </div>
            <div class="card-body" id="maincard3">
                ${qrbody.map(item => `
                    <h3>${item.title}</h3>
                    ${item.bullets.map(i => `
                        <ul><li>${i}</li></ul>
                    `).join('')}
                `).join('')}
            </div>
        </div>
    `;

    $('.bottomone').append(qrsContent);
    loadSVG('DownArrowSVG', '#arrow-helpline4');
}

function renderPaperQR(response, language = 'en') {
    const paperdata = response.data?.[language].PaperQRTicket;
    const paperbody = response.data?.[language].PaperQRTicket.content;

    const paperContent = `
        <div class="info-cont" id="touristes">
            <div class="card-header" data-target="maincard4">
                <div class="ico-img">
                    <img src="${paperdata.image}" alt="Smart Card Icon">
                    <h2>${paperdata.heading}</h2>
                </div>
                <div class="arrow-imgs" id="arrow-helpline5"></div>
            </div>
            <div class="card-body" id="maincard4">
                ${paperbody.map(item => `
                    <h3>${item.title}</h3>
                    ${item.bullets.map(i => `
                        <ul><li>${i}</li></ul>
                    `).join('')}
                `).join('')}
            </div>
        </div>
    `;

    $('.bottomone').append(paperContent);
    loadSVG('DownArrowSVG', '#arrow-helpline5');
}

fetchmaininfo("token-smart-cards", function(response) {
    renderContent(response);
    renderTouristCard(response);
    renderMobility(response);
    renderAppQR(response);
    renderPaperQR(response);
});



