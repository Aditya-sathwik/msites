function applyThemeProperties(properties) {
    const root = document.documentElement; // or use document.body
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
    // You can also set up for arrays or more complex structures if needed
}



function createFloatingBox(message) {
    // Create the floating-box structure using template literals
    const floatingBoxHTML = `
        <div class="floating-box">
            <div class="green-bar"></div>
            <p id="error-msg">${message}</p>
        </div>
    `;

    // Convert the HTML string into a jQuery object
    let floatingBox = $(floatingBoxHTML);

    // Append floatingBox to a container in your HTML (assuming the container has id "container")
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



function generateInputField(id, labelText, type = 'text', disabled = false, value = '', hasPlaceholder = false) {
    const placeholderClass = hasPlaceholder ? 'has-placeholder' : '';

    const inputHTML = `
        <div class="input-field">
            <input type="${type}" id="${id}" ${disabled ? 'disabled' : ''}   ${value ? 'value="' + value + '"' : ''}  required/>
            <label class="label-classe ${value ? 'active' : ''}" id="${id}-label" for="${id}">${labelText}</label>
            <p class="helper-text">Please fill out this field</p>
        </div>`;

    return inputHTML;
}
function generateArrowInputField(id, labelText, type = 'text', readOnly = false, value = '', hasPlaceholder = false) {
    const placeholderClass = hasPlaceholder ? 'has-placeholder' : '';
    const readOnlyAttribute = readOnly ? 'readonly' : '';
    const activeClass = value ? 'active' : '';

    // Generate the HTML string
    const inputHTML = `
        <div class="form-group floating">
            <input
                type="${type}"
                id="${id}"
                class="form-control ${placeholderClass}"
                placeholder="${hasPlaceholder ? 'Select Station' : ''}"
                ${readOnlyAttribute}
                value="${value}"
            />
            <label for="${id}" class="${activeClass}">${labelText}</label>
            <span class="arrow">
                <img src="../svg/downArrow.svg" alt="downArrow">
            </span>
        </div>`;

    return inputHTML;
}


function generateSelectField(id, labelText, index,disabled = false, showOptions = true,value = '', options = []) {
    var optionsHTML = '';
    
    if (showOptions) {
        optionsHTML = `<option value= ${value ? 'value="' + value + '"' : ''} selected>Select Type</option>`;
        
        options.forEach(option => {
            optionsHTML += `<option value="${option}">${option}</option>`;
        });
    }

    var inputSELECT = `
        <div class="input-field" id="select-one-${index}">
            <select id="${id}"  ${disabled ? 'disabled' : ''}  ${value ? 'value="' + value + '"' : ''}  required>
                ${optionsHTML}
            </select>
            <label for="${id}" class="label-classe ${value ? 'active' : ''}" id="${id}-label">${labelText}</label>
            <p class="helper-text">Select the Courier Type</p>
        </div>
    `;

    return inputSELECT;
}

function fetchoffice() {
    const url = lostandfound.office;
    const method = 'POST';
    const authorizationKey = headers35;
    const requestData = {
        "type": "staticPage",
        "slug": "lost-found",
        "version": 0
    }

    fetchapiData(url, method, authorizationKey, requestData,
        function (response) {
            console.log('Request successful:', response);
            maintab(response)
        

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






function maintab(response){
     
 
        let language = 'en'; 
        const { instructions, dmrc, rapidMetro } = response.data[language];

        const instructionsHtml = createInstructionsHtml(instructions);
        $('#lost-found-container').append(instructionsHtml);


        const dmrcHtml = createContentHtml(dmrc);
        $('#lost-found-container').append(dmrcHtml);

        const rapidMetroHtml = createContentHtml(rapidMetro);
        $('#lost-found-container').append(rapidMetroHtml);
    
};
    function createInstructionsHtml(instructions) {
        const contentHtml = instructions.content.map(item => `<li>${item}</li>`).join('');
        return `
            <div class="instructions">
                <h3><img src="${instructions.icon}" alt="icon">${instructions.title}</h3>
                <div class = "main-box">
                <ul>${contentHtml}</ul>
                </div>
            </div>
        `;
    }

    function createContentHtml(section) {
        const contentHtml = section.content.map(item => `<li><img src="${item.icon}" alt="icon">${item.text}</li>`).join('');
        return `
            <div class = "maincontent" id="${section.title.toLowerCase()}">


                <h3><img src="${section.icon}" alt="icon">${section.title}</h3>

                <div class = "main-box">
                <h4>${section.label}</h4>
                <ul>${contentHtml}</ul>
                 </div>
            </div>
        `;
    }


    
var lostform = 
`
<h3> Report Lost Item</h3>
<div id="lost-form" class="lost-form">

    ${generateInputField('item-name', 'Enter Item Name')}
    ${generateInputField('item-description', 'Enter Item Description')}
    ${generateInputField('item-quantity', 'Enter Item Quantity', 'number')}
    ${generateArrowInputField('select-dropbox-station', 'Select Station', 1, false)}
    ${generateInputField('name', 'Enter Your Name','text',false)}
    ${generateInputField('mobile', 'Enter Your mobile number', 'number')}
    ${generateInputField('date', 'Date', 'date')}
    ${generateInputField('time', 'Time', 'time')}

  <div class = "button-div">
        <button id="submit-lost" class="btn">SUBMIT</button>
    </div>
</div> 
`;
var foundform = 
`
<h3> Report Found Item</h3>
<div id="found-form" class="lost-form">

    ${generateInputField('found-item-name', 'Enter Item Name')}
    ${generateInputField('found-item-description', 'Enter Item Description')}
    ${generateInputField('found-item-quantity', 'Enter Item Quantity', 'number')}
    ${generateArrowInputField('found-select-dropbox-station', 'Select Station', 1, false)}
    ${generateInputField('found-name', 'Enter Your Name','text',false)}
    ${generateInputField('found-mobile', 'Enter Your mobile number', 'number')}
    ${generateInputField('date', 'Date', 'date')}
    ${generateInputField('time', 'Time', 'time')}

  <div class = "button-div">
         <button id="submit-found" class="btn">SUBMIT</button>
    </div>
</div> 
`;


$(document).on('input', '#mobile, #found-mobile', function () {
    var $this = $(this);
    var mobileNumber = $this.val();
    var firstDigit = mobileNumber.charAt(0);
    var isValid = mobileNumber.length === 10 && !isNaN(firstDigit) && parseInt(firstDigit, 10) >= 6 && parseInt(firstDigit, 10) <= 9;

    // Limit the input length to 10 characters
    if (mobileNumber.length > 10) {
        $this.val(mobileNumber.slice(0, 10));
        mobileNumber = $this.val(); // Update the mobileNumber after trimming
    }

    // Check if the mobile number is valid
    if (isValid) {
        $this.css('border', '1px solid green');
        $('#receiver-mobile-label').css('color', 'green');
        $this.siblings('.helper-text').hide(); // Hide helper text if valid
    } else {
        if (mobileNumber.length === 0) {
            $this.siblings('.helper-text').text('Please fill out this field').css('color', 'red').show();
        } else {
            $this.siblings('.helper-text').text('Invalid mobile number').css('color', 'red').show();
        }
        $this.css('border', '1px solid red'); // Add a red border for invalid input
    }
});




function validateForm(formId) {
    let isValid = true;
    const form = $(`#${formId}`);
    form.find('input[required]').each(function() {
        const $input = $(this);
        
        const value = $input.val().trim();

        if ($input.attr('type') === 'number' && $input.attr('id').includes('mobile')) {
            // Phone number validation: starts with 6-9 and has 10 digits
            const phonePattern = /^[6-9]\d{9}$/;
            if (!phonePattern.test(value)) {
                isValid = false;
                $(this).siblings('.helper-text').show();
            } else {
                $(this).siblings('.helper-text').hide();
                $(this).removeClass('error');
            }
        } else if (!value) {
            isValid = false;
            $(this).siblings('.helper-text').show();
        } else {
            $(this).siblings('.helper-text').hide();
            $(this).removeClass('error');
        }
    });
    return isValid;
}


        // Function to format date to DD/MM/YYYY
        function formatDate(dateString) {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }

        // Function to format time to HH:mm:ss
        function formatTime(dateString) {
            const date = new Date(dateString);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }

        // Function to format ISO 8601 date-time string
        function formatISODateTime(dateString) {
            const date = new Date(dateString);
            return date.toISOString(); // ISO 8601 format
        }

function postaddlostitem() {



    
    const itemName = $('#item-name').val();
    const itemDescription = $('#item-description').val();
    const itemQuantity = $('#item-quantity').val();
    const station = $('#select-dropbox-station').val();
    const name = $('#name').val();
    const mobile = $('#mobile').val();
    const date = $('#date').val();
    const time = $('#time').val();
    let StationCode = $('#select-dropbox-station').data('station-code');
    const dateTimeString = `${date}T${time}`;
    const complaintDate = formatDate(date);
    const complaintTime = formatTime(dateTimeString);
    const receivedAt = formatISODateTime(dateTimeString);

    var currentDate = new Date().toISOString().slice(0, 10);
    var currentTime = new Date().toTimeString().slice(0, 5);
    
    var formattedtime = currentDate+" "+currentTime
    console.log(formattedtime)
    const dataToSend = {
        "itemName": itemName,
        "itemType": "lost",
        "description": itemDescription,
        "itemQuantity": itemQuantity,
        "stationCode": StationCode,
        "complaintDate": complaintDate,
        "complaintTime": complaintTime,
        "receivedAt": receivedAt,
        "name": name,
        "contact": mobile
    };
console.log(dataToSend)
    const url = lostandfound.addlostitem;
    const method = 'POST';
    const authorizationKey = headers35;
    const requestData = dataToSend

    fetchapiData(url, method, authorizationKey, requestData,
        function (response) {
            console.log('Request successful:', response);
            window.location.reload();
            createFloatingBox("sucessfully Added");

        
        

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
function postaddfounditem() {

             const itemName = $('#found-item-name').val();
            const itemDescription = $('#found-item-description').val();
            const itemQuantity = $('#found-item-quantity').val();
            const station = $('#found-select-dropbox-station').val();
            const name = $('#found-name').val();
            const mobile = $('#found-mobile').val();
            const date = $('#date').val();
            const time = $('#time').val();
            let StationCode = $('#found-select-dropbox-station').data('station-code');

            // Combine date and time into a single Date object
            const dateTimeString = `${date}T${time}`;
            const complaintDate = formatDate(date);
            const complaintTime = formatTime(dateTimeString);
            const receivedAt = formatISODateTime(dateTimeString);

    var currentDate = new Date().toISOString().slice(0, 10);
    var currentTime = new Date().toTimeString().slice(0, 5);
    
    var formattedtime = currentDate+" "+currentTime
    console.log(formattedtime)
    const dataToSend = {
        "itemName": itemName,
        "itemType": "found",
        "description": itemDescription,
        "itemQuantity": itemQuantity,
        "stationCode": StationCode,
        "receivingDate": complaintDate,
        "receivingTime": complaintTime,
        "receivedAt": receivedAt,
        "name": name,
        "contact": mobile

    };
console.log(dataToSend)
    const url = lostandfound.addfounditem;
    const method = 'POST';
    const authorizationKey = headers35;
    const requestData = dataToSend

    fetchapiData(url, method, authorizationKey, requestData,
        function (response) {
            console.log('Request successful:', response);
            window.location.reload();
            createFloatingBox("sucessfully Added");

        
        

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

$(document).on('change', '#mobile', function() {
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
    if (this.value.length === 10) {
        $(this).css("border", "1px solid green");
        $('#sender-mobile').css("color", "green")
    } else {
        $(this).css("border", "1px solid red");
    }
});





// Form submission event listeners
$(document).on('click', '#submit-lost', function() {
    if (validateForm('lost-form')) {
        // Submit form or handle valid data
        console.log('Lost item form submitted successfully');

        postaddlostitem()
    } else {
        console.log('Please fill out all required fields');
    }
});

$(document).on('click', '#submit-found', function() {
    if (validateForm('found-form')) {
        // Submit form or handle valid data
        console.log('Lost item form submitted successfully');
        postaddfounditem()
    } else {
        console.log('Please fill out all required fields');
    }
});



var headerbar = `         <div class="sheet-header">
<div class="drag-icon"><span></span></div>
</div>`



$(document).on('click', '#lost-item', function () {

initializeBottomSheet(
    'bottomSheetContainerid', // containerId
    'bottomSheetOverlayid',   // overlayId
    'bottomSheetContentid',
    headerbar,   // contentId
    lostform, 
    '',
    20,                     // minHeight (in vh)
    100,                     // maxHeight (in vh)
    90,                     // defaultHeight (in vh)
    'b-cont'  
);
initializeDateTimeInputs();
});
$(document).on('click', '#found-item', function () {

initializeBottomSheet(
    'bottomSheetContainerid1', // containerId
    'bottomSheetOverlayid1',   // overlayId
    'bottomSheetContentid1', 
    headerbar,  // contentId
    foundform, 
    '',
    20,                     // minHeight (in vh)
    100,                     // maxHeight (in vh)
    90,                     // defaultHeight (in vh)
    'b-cont'  
);
initializeDateTimeInputs();
});


var stations = [];
var currentInputField = null;
var journeydetails = []

function fetchStations() {

  $.ajax({
        url: planyourjourney.stationslist,
        method: 'GET',
        headers:headers35,
        success: function (data) {
            console.log("Stations fetched successfully", data);
            stations = data.results.map(result => ({
                code: result.code,
                name: result.name,
              
            }));
            populateStationList();


        },
        error: function (error) {
            console.error('Error fetching station data:', error);
        }
    });
}







function populateStationList() {
    console.log("Populating station list...");

    var stationList = $('#station-list');
    stationList.empty();

    stations.forEach(function (station)  {
        // Create a list item
        var listItem = $('<li  id = "main-list" >');
        var lineCodeName = $('<p>').text(station.name)


      

        stationList.find('span').each(function () {
            var spanText = $(this).text().trim();
            if (spanText === '') {
                $(this).hide(); 
            }
        })


        listItem.append(lineCodeName, ' '); // Add a space between name and code
    




        listItem.on('click', function () {
            var stationName = station.name; // Use station.name directly
            if (currentInputField) {
                var stationCode = station.code; // Get the station code
                currentInputField.val(stationName);



                var selectedStationName = stationName;

                // Find the selected station object
                var selectedStation = stations.find(station => station.name === selectedStationName);


                $('#station-selection').hide();

                currentInputField.data('station-code', station.code);
                console.log(stationCode)

            }
        });



        stationList.append(listItem);
    });
}



$(document).on('change', '.form-control', function () {

    var inputField = $(this);
    var stationName = inputField.val().trim();
    var station = station.find(s => s.name === stationName);
    if (station) {
        inputField.data('station-code', station.code);
    } else {
        inputField.data('station-code', ''); // Clear if station is not found
    }

});




$(document).on('click', '.form-control', function () {
    currentInputField = $(this); // Update the current input field
    console.log("Input field clicked:", currentInputField.attr('id'));
    $('#station-selection').show();
    clearsearch(); 

    if ($(this).attr('id') === 'select-dropbox-station') {
        $('#station-selection').scrollTop(0); // Reset scroll position to top
    }
    if ($(this).attr('id') === 'found-select-dropbox-station') {
        $('#station-selection').scrollTop(0); // Reset scroll position to top
    }
});


function showStationSelection(inputId) {
    $('#station-selection').show();
    $('#station-selection .modal-body').scrollTop(0);  // Reset scroll position to top
    $('#station-list li').off('click').on('click', function () {
        var stationName = $(this).text();
        $('#' + inputId).val(stationName);
        $('#station-selection').hide();
    });
}







// Event listener for closing modals
$('.close-btn').on('click', function () {
    console.log("Close button clicked");
    $(this).closest(' .station-modal').hide();

});

$('#station-search').on('input', function () {
    var searchTerm = $(this).val().toLowerCase();

    $('#station-list li').each(function () {
        var stationName = $(this).text().toLowerCase();
        $(this).toggle(stationName.includes(searchTerm));
    });

    if (!searchTerm) {
        $('#station-list li').show();
    }
});




// $('#station-search').hide();
// $('#clear-icon').hide();
// $('#search-icon2').hide();
// Initially hide the search bar by accessing it within its container
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








$('#station-list li').on('click', function () {
    var stationName = $(this).text();
    resetSearch(); // Call resetSearch to clear the search input and show all stations
    if (currentInputField) {
        currentInputField.val(stationName);
        $('#station-selection').hide();
    }
});

function resetSearch() {
    $('#station-search').val(''); // Clear the search input
    $('#station-list li').show(); // Show all stations
}



function initializeDateTimeInputs() {
    var now = new Date();
    var currentDate = now.toISOString().slice(0, 10);
    var currentTime = now.toTimeString().slice(0, 5);

    // Set the default value for the date and time inputs
    $('#date').val(currentDate);
    $('#time').val(currentTime);

    // Set the minimum allowed date to the current date
    $('#date').attr('min', currentDate);
    // Set the maximum allowed date to the current date (prevent future dates)
    $('#date').attr('max', currentDate);
    $('#time').attr('max', currentTime);

    // Set the minimum allowed time to the current time for today
    $('#time').attr('min', currentTime);


    // $('#date').on('change', function() {
    //     var selectedDate = $(this).val();

    //     if (selectedDate === currentDate) {
    //         // If the selected date is today, set the min time to the current time
    //         $('#time').attr('min', currentTime);
    //     } else {
    //         // If the selected date is not today, allow any time
    //         $('#time').attr('min', '00:00');
    //     }

    //     // Prevent user from selecting future dates
    //     $('#date').attr('max', currentDate);
    // });

    $('#time').on('input', function() {
        var selectedDate = $('#date').val();
        var selectedTime = $(this).val();

        if (selectedDate === currentDate && selectedTime > currentTime) {
            // If the selected date is today but the selected time is in the future
            $(this).val(currentTime); // Set the time back to the current time
        }
    });
}






// $('#date, #time').on('change', function () {
//     var selectedDate = $('#date').val();
//     var selectedTime = $('#time').val();


//     var selectedDateTime = {
//         date: selectedDate,
//         time: selectedTime
//     };

//     console.log('Selected Date and Time:', selectedDateTime);
// });




    




function generateTable(data,currentPage,limit) {
    // Get headers from the first item
    const headers = Object.keys(data.results[0]);

    // Generate table HTML
    const tableHtml = `
        <table class="contact-table">
            <thead>
                <tr>
                    ${headers.map(header => `<th>${header.replace(/([A-Z])/g, ' $1').trim()}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${data.results.map(item => `
                    <tr>
                        ${headers.map(header => `<td>${item[header] !== undefined ? item[header] : ''}</td>`).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
  

    var  bottomcontent = `
            <div id="pagination">
                <button id="prev" ${currentPage === 1 ? 'disabled' : ''} class="sm-btn ${currentPage === 1 ? 'disabled' : ''}">Previous</button>
                <span id="page-info">Page ${currentPage} out of ${limit}</span>
                <button id="next" ${currentPage === limit ? 'disabled' : ''} class="sm-btn ${currentPage === limit ? 'disabled' : ''}">Next</button>
            </div>
    `

    var crossone = `
    <div class = "cross">
    <h4>Lost & Found</h4>

       <img id = "crossicon" src="../assets/CrossBasic.svg" alt="crossicon">

</div>

    
    `
    initializeBottomSheet(
        'bottomSheetContainer', // containerId
        'bottomSheetOverlay',   // overlayId
        'bottomSheetContent',   // contentId
        crossone,
       tableHtml, // bodyContent
    bottomcontent,
       20,                     // minHeight (in vh)
        80,                     // maxHeight (in vh)
        90,                     // defaultHeight (in vh)
        'b-cont1'  // inputdiv (the div where the bottom sheet will be appended)
    );


   
}



function fetchlostlist(currentPage,limit) {

    const pages = `getList?page=${currentPage}&limit=${limit}`
    const url =  lostandfound.lostlist+ pages ;
    const method = 'GET';
    const authorizationKey = headers35;

    var requestData = null;

    fetchapiData(url, method, authorizationKey, requestData,
        function (data) {
            console.log('Request successful:', data);
            generateTable(data,currentPage,limit) 
      
        

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



 

$(document).on('click', '#lost', function () {

    let currentPage = 1;
    const limit = 20; 

    function updatePagination() {

        console.log('Current Page:', currentPage);
        console.log('Total Pages:', limit);
        
        $('#prev').prop('disabled', currentPage === 1).toggleClass('disabled', currentPage === 1);
        $('#next').prop('disabled', currentPage === limit).toggleClass('disabled', currentPage === limit);
        $('#page-info').text(`Page ${currentPage} out of ${limit}`);
    }
    $(document).on('click', '#prev', function() {
        if (currentPage > 1) {
            currentPage--;
            fetchlostlist(currentPage, limit);
        }
    });

    $(document).on('click', '#next', function() {
        // Make sure you have totalPages variable set
        if (currentPage < limit) {
            currentPage++;
            fetchlostlist(currentPage, limit);
        }
    });


    
    fetchlostlist(currentPage, limit);

 
    updatePagination()
});


fetchoffice()
fetchStations()

