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



function fetchfaqs() {
   

    var url = profilebar.faqslist;
    var method = 'GET';
    var authorizationKey = headers35;

    var requestData = null;

    fetchapiData(url, method, authorizationKey, requestData,
        function (data) {
            console.log('Request successful:', data);
            const generatedfaq = generateFAQHTML(data);
            $('.faq-container').html(generatedfaq);
        },
        function (xhr, status, error) {
            console.error('Request failed:', error);
        }
    );
}




function generateFAQHTML(data) {
    let htmlContent = '';

    $.each(data, function(index, category) {
        let categoryHtml = `
            <div class="category" key="${index}">
                <h3>${category.parentTitle}</h3>
                <ul>
        `;
        
        $.each(category.result, function(subIndex, item) {
            categoryHtml += `
                <li key="${subIndex}" class = "clicked-slug" data-slug = "${item.slug}">
                   <span > ${item.title}</span>
                    <img src="../assets/arrow_indicator.svg" alt="Arrow" class="arrow" />
                </li>
            `;
        });

        categoryHtml += `
                </ul>
            </div>
        `;

        htmlContent += categoryHtml;
    });

    return htmlContent;
}


fetchfaqs() 

$(document).on('click', '.clicked-slug', function () {
 var slugused =  $(this).data('slug');
 fetchtermsandconditions(slugused) 
  console.log(slugused)
        
    });



function fetchtermsandconditions(slugused) {
    const url = profilebar.termsandconditions;
    const method = 'POST';
    const authorizationKey = headers34;
    const requestData = ({
        "type": "staticPage",
        "slug":`${slugused}`,
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
    var faqSection = $('.c-container');
    var faqData = response.data?.[language]?.data; 
    var sectionTitle = response.data?.[language]?.sectionTitle;
    if (!faqData || !sectionTitle) {
        console.error('Invalid response format', response);
        return;
    }

    var html = `<h2>${sectionTitle}</h2>`;
    $('#mtickets').html(`${sectionTitle}`)
    faqData.forEach((item, index) => {
        var bulletsHtml = item.bullets ? 
            `<ul>${item.bullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>` : '';

        if (!item.answer && item.bullets) {
            html += `
                <div class="faq-item">
                    <h3>Q${index + 1}: ${item.question}</h3>
                    ${bulletsHtml}
                </div>
            `;
        } else if (!item.answer && !item.bullets) {
            var tableHtml = `
                <table class="contact-table">
                    <thead>
                        <tr>
                            ${item.head.map(header => `<th>${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${item.data.map(row => `
                            <tr>
                                <td>${row.caseNumber}</td>
                                <td>${row.caseDescription}</td>
                                <td>${row.contact}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
            html += `<div class="faq-item"><h3>Q${index + 1}: ${item.question}</h3>${tableHtml}</div>`;
        } else {
            var faqItemHtml = `
                <div class="faq-item">
                    <h3>Q${index + 1}: ${item.question}</h3> 
                    <p>${Array.isArray(item.answer) ? item.answer.join('<br>') : item.answer}</p>
                    ${bulletsHtml}
                </div>
            `;
            html += faqItemHtml; 
        }
    });

    $('.faqs-list').hide();
    $('.faqs-body').show();
    faqSection.append(html);
}



$(document).on('click', '#backimg1', function () {
    $('.faqs-body').hide();
    $('.faqs-list').show();
});
