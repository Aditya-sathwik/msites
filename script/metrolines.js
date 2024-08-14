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



function fetchlinesdata(callback) {
   

    var url = metrolines.lines;
    var method = 'GET';
    var authorizationKey = headers34;

    var requestData = null;

    fetchapiData(url, method, authorizationKey, requestData,
        function (response) {
            console.log('Request successful:', response);
            if (callback && typeof callback === 'function') {
                callback(response);
            }
          
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

function fetchstationsdata(item2) {
   

    var url = metrolines.station;
    var method = 'GET';
    var authorizationKey = headers34;

    var requestData = null;

    fetchapiData(url, method, authorizationKey, requestData,
        function (response) {
            console.log('Request successful:', response);
            var results = response.results;
            var matchedStations = [];
            for (var i = 0; i < item2.length; i++) {
                var stationCode = item2[i];
                for (var j = 0; j < results.length; j++) {
                    if (results[j].code === stationCode) {
                        matchedStations.push({
                            code: results[j].code,
                            name: results[j].name
                        });
                        break;
                    }
                }
            }

            console.log(matchedStations);
            stationss(matchedStations)





            
          
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




fetchlinesdata(alllines)
function alllines(response) {

    window.metroData = response;
    response.results.forEach((item, index) => {
     
        if (item.status === `active`) {
            var lines = `
                <div class="line"  data-index="${index}"   id="line-${index}" style="border-color: ${item.color}; border-left: 8px solid ${item.color};">
                    <div class="icon">
                        <object id="svgObject-${index}-1" type="image/svg+xml" data="../assets/metro_line.svg" width="50" height="50"></object>
                    </div>
                    <div class="info">
                        <div class="line-name"  style="color: ${item.color};" >${item.subName}</div>
                        <div class="line-color">${item.name}</div>
                    </div>
                    <div class="nxt-arrow"   >
                        <object id="svgObject-${index}-2" type="image/svg+xml" data="../assets/arrow_indicator.svg" width="20" height="20"></object>
                    </div>
                </div>
            `;

            $('#line-cont').append(lines);

            // Function to change fill color
            function changeFillColor(svgId, color, changeId) {
                const svgObject = document.getElementById(svgId);
                if (svgObject && svgObject.contentDocument) {
                    const svgDoc = svgObject.contentDocument;
                    const path1 = svgDoc.getElementById(changeId);
                    const path2 = svgDoc.getElementById('Path_6166');
                    const path3 = svgDoc.getElementById('Path_6167');
                    
                    if (path1) path1.setAttribute('fill', color);
                    if (path2) path2.setAttribute('fill', 'white');
                    if (path3) path3.setAttribute('fill', 'white');
                }
            }

            $(`#svgObject-${index}-1`).on('load', function () {
                changeFillColor(`svgObject-${index}-1`, item.color, `Path_6165`);
            });

            $(`#svgObject-${index}-2`).on('load', function () {
                changeFillColor(`svgObject-${index}-2`, item.color, `Path_6186`);
            });
        }
    });
}
function linedata(response, mainindex) {

    if (response && response.results) {
        const item = response.results[mainindex];

        if (item) {
            
                var detailline = `
                    <div class="line-detail-cont" id="line-detail-cont">
                        <div class="route-info" style=" border: 1px solid ${item.color};">
                            <div class="station">
                                <span>${item.firstStation.name}</span>
                            </div>
                            <div class="logo">
                                <object id="svgObject-3" type="image/svg+xml" data="../assets/updown.svg" width="50" height="50"></object>
                            </div>
                            <div class="station">
                                <span>${item.lastStation.name}</span>
                            </div>
                        </div>
                        <div class="line-about-details">
                            <div class="line-about-detail">
                                <div class="icon2">
                                <object id="svgObject-4" type="image/svg+xml" data="../assets/kms.svg" width="50" height="50"></object>
                                </div>
                                <p class="ut">${(item.distance).toFixed(2)}</p>
                                <p class="lt">Kms</p>
                            </div>
                            <div class="line-about-detail">
                                <div class="icon2">
                                <object id="svgObject-5" type="image/svg+xml" data="../assets/rupees.svg" width="50" height="50"></object>
                            </div>
                                <p class="ut">${item.rupees}</p>
                                <p class="lt">Rupees</p>
                            </div>
                            <div class="line-about-detail">
                              
                                
                                <p class="ut">${item.time}</p>
                                <p class="lt">Mins</p>
                            </div>
                            <div class="line-about-detail">
                                <div class="icon2">
                                 <object id="svgObject-6" type="image/svg+xml" data="../assets/train.svg" width="50" height="50"></object>
                                </div>
                                <p class="ut">${item.noOfStation}</p>
                                <p class="lt">Stations</p>
                            </div>
                            <div class="line-about-detail">
                                <div class="icon2">
                                <object id="svgObject-7" type="image/svg+xml" data="../assets/interchnages.svg" width="50" height="50"></object>
                                </div>
                                <p class="ut">${item.juncations}</p>
                                <p class="lt">Interchange</p>
                            </div>
                        </div>
                    </div>
                `;
    
                $('#topcont').empty();
                $('#topcont').append(detailline);
                $('#mline').html(item.name);
                $('.metrolines-list').hide();
                $('.metrolines-details').show();
    
                // Function to change fill color
                function changeFillColor(svgId, color, changeId) {
                    const svgObject = document.getElementById(svgId);
                    if (svgObject && svgObject.contentDocument) {
                        const svgDoc = svgObject.contentDocument;
                        const path1 = svgDoc.getElementById(changeId);
                        const path2 = svgDoc.getElementById('Path_6166');
                        const path3 = svgDoc.getElementById('Path_6167');
                        
                        if (path1) path1.setAttribute('fill', color);
                        if (path2) path2.setAttribute('fill', 'white');
                        if (path3) path3.setAttribute('fill', 'white');
                    }
                }
                function changeFillColor2(svgId, color, changeId , changeId2, changeId3) {
                    const svgObject = document.getElementById(svgId);
                    if (svgObject && svgObject.contentDocument) {
                        const svgDoc = svgObject.contentDocument;
                        const path1 = svgDoc.getElementById(changeId);
                        const path2 = svgDoc.getElementById(changeId2);
                        const path3 = svgDoc.getElementById(changeId3);
                        
                        if (path1) path1.setAttribute('fill', color);
                        if (path2) path2.setAttribute('fill', color);
                        if (path3) path3.setAttribute('stroke', color);
                    }
                }
    
                $(`#svgObject-3`).on('load', function () {
                    changeFillColor2(`svgObject-3`, item.color, `Path_299-2`, `Path_299`,`Ellipse_21`);
                });
    
                // $(`#svgObject-4`).on('load', function () {
                //     changeFillColor2(`svgObject-4`, item.color, `Path_309`, `Path_309  `,`Path_308`);
                // });
                // $(`#svgObject-5`).on('load', function () {
                //     changeFillColor(`svgObject-5`, item.color, `Path_6153`);
                // });
                // $(`#svgObject-6`).on('load', function () {
                //     changeFillColor2(`svgObject-6`, item.color, `Path_6204`,`Path_6204-2`);
                // });
                // $(`#svgObject-7`).on('load', function () {
                //     changeFillColor(`svgObject-7`, item.color, `Path_6238`);
                // });
            
         
        } else {
            console.error('Item not found for index:', mainindex);
        }
    } else {
        console.error('Response is invalid or empty');
    }
}
function stationss(matchedStations) {

    let stationsslist = '';

    // Loop through matchedStations and build the HTML string
    matchedStations.forEach((item, index) => {
        stationsslist += `
            <div class="station-item" data-index="${index}" data-code="${item.code}">
                <p>${item.name}</p>
                <img src="../assets/rightArrowBold.svg" alt id="backimg">
            </div>
        `;
    });

    $('#bottomcont').empty();
    $('#bottomcont').append(stationsslist);
}
               


$(document).on('click', '.line', function () {
    var mainindex = $(this).data('index');

    var response = window.metroData; 
    const item2 = response.results[mainindex].station;
    fetchstationsdata(item2) 
    linedata(response, mainindex);
    history.pushState({ page: 'linedetails' }, '', '?state=linedetails');

    
});
// $(document).on('click', '.station-item', function () {
//     // Retrieve the data attributes
//     var mainindex = $(this).data('index');
//     var maincode = $(this).data('code');
    
//     // Store them in local storage
//     localStorage.setItem('mainindex', mainindex);
//     localStorage.setItem('maincode', maincode);
// });

$(document).on('click', '.station-item', function () {
    // Retrieve the data attributes
    var mainindex = $(this).data('index');
    var maincode = $(this).data('code');
    history.pushState({ page: 'aboutstation' }, '', '?state=aboutstation');
    $('.metrolines-list').hide();
    $('.metrolines-details').hide();
    $('.metrolines-station-details').show();

        mainaboutstation(maincode, 'stationdiv');
   
    // Store them in local storage
    // localStorage.setItem('mainindex', mainindex);
    // localStorage.setItem('maincode', maincode);
    
    // // Verify if the values are stored correctly
    // var storedIndex = localStorage.getItem('mainindex');
    // var storedCode = localStorage.getItem('maincode');
    
    // if (storedIndex === mainindex.toString() && storedCode === maincode.toString()) {
    //     console.log('Stored successfully');
    // } else {
    //     console.log('Failed to store');
    // }
});

$(document).on('click', '.leftMetro', function () {
    $('.metrolines-list').show();
    $('.metrolines-details').hide();
    $('.metrolines-station-details').hide();


})
$(document).on('click', '.mainback', function () {
    $('.metrolines-list').hide();
    $('.metrolines-details').show();
    $('.metrolines-station-details').hide();


})


$(document).ready(function() {

    window.addEventListener('popstate', function(event) {
        var state = event.state ? event.state.page : null;
    
        switch (state) {
       
            case 'linedetails':
                $('.metrolines-list').hide();
                $('.metrolines-details').show();
                $('.metrolines-station-details').hide();
                break;
            case 'aboutstation':
                $('.metrolines-list').hide();
                $('.metrolines-details').hide();
                $('.metrolines-station-details').show();
                break;
            default:
                $('.metrolines-list').show();
                $('.metrolines-details').hide();
                $('.metrolines-station-details').hide();
                break;
        }
    });
    
    function checkInitialState() {
        const params = new URLSearchParams(window.location.search);
        const state = params.get('state');
        
        switch (state) {
       
            case 'linedetails':
                $('.metrolines-list').hide();
                $('.metrolines-details').show();
                $('.metrolines-station-details').hide();
                break;
            case 'aboutstation':
                $('.metrolines-list').hide();
                $('.metrolines-details').hide();
                $('.metrolines-station-details').show();
                break;
            default:
                $('.metrolines-list').show();
                $('.metrolines-details').hide();
                $('.metrolines-station-details').hide();
                break;
        }
    }
    
    
        checkInitialState();
     
    });
