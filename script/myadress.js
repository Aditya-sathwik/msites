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



function alladdress(callback) {
    var url = profilebar.addressapi;
    var method = 'GET';
    var authorizationKey = headers35;

    // For GET requests, requestData can be omitted or set to an empty object
    var requestData = null;

    fetchapiData(url, method, authorizationKey, requestData,
        function (data) {
            console.log('Request successful:', data);
            if (callback && typeof callback === 'function') {
                callback(data);
            }
        },
        function (xhr, status, error) {
            console.error('Request failed:', error);
        }
    );
}




function myaddresses(data) {
    console.log('Data received:', data);

    if (data.length === 0) {
        // Append image if no addresses
        var noDataImage = `<div id="no-courier">
            <img src="../svg/noaddress.svg" alt="No addresses available" class="no-bookings-image">
            <h3>No Addresses Added</h3>
            <h4>Please add  your address for us to be able to serve you better<h4>

                <div class = "button-div">
            <button id="new-form" class = "btn">ADD ADDRESS</button>
        </div>
        </div>`;
        $('#bookingcontainer').append(noDataImage);
        return;
    }

    $('#bookingcontainer').empty();

    // Iterate over each address and generate the HTML content
    data.forEach((item, index) => {
        var bookingsbox = `
            <div class="address-card">
                <div class="home-icon">
                    <img src="../svg/homeryder.svg" alt="Home Icon">
                    <p>${item.addressType}</p>
                </div>
                <h3>${item.name}</h3>
                <p id = "adressp">${item.houseNumber}, ${item.street},${item.landmark}</p>
                <p>${item.city}, ${item.state}, ${item.pin}, ${item.country}</p>
                <p>Phone: ${item.mobile}</p>
                <div class="buttons">
         <button class="edit-button" data-id="${item._id}" data-index="${index}">EDIT</button>
        <button class="delete-button" data-id="${item._id}" data-index="${index}">DELETE</button>
                </div>
            </div>
        `;

        $('#bookingcontainer').append(bookingsbox);
    });
}

alladdress(myaddresses)


$(document).on('click', `.delete-button`, function () {

    $('#custom-alert').show();

    var addressId = $(this).data('id');
    $('#cancel-delete').one('click', function () {
        $('#custom-alert').hide();
    });
    $('#delete-continue').one('click', function () {

        function deleteAddress(addressId) {
            var url = profilebar.addressapi + addressId;
            var method = 'DELETE';
            var authorizationKey = headers35;
            var requestData = null;

            fetchapiData(url, method, authorizationKey, requestData,
                function (data) {
                    window.location.reload();
                    alladdress(myaddresses)
                    console.log('Delete request successful:');
                    createFloatingBox(`sucessfully deleted`);

                    
                },
                function (xhr, status, error) {
                    console.error('Delete request failed:', error);
                    console.error('Response:', xhr.responseText);
                    createFloatingBox(`${xhr.responseText}`);
                }
            );
        }

        deleteAddress(addressId); 



    });
});

function editform(data, index) {
    var profileaddressform = `
        <div class="profile-form">
            ${generateInputField('full-name-edit', 'Full Name')}
            ${generateInputField('mobile-edit', 'Enter alternate mobile number', 'number')}
            ${generateInputField('address-edit', 'House No./Building/Apartment')}
            ${generateInputField('locality-edit', 'Area/Sector/Locality/village')}
            ${generateInputField('pincode-edit', 'Pincode', 'number')}
            ${generateInputField('landmark-edit', 'Landmark(Optional)')}
            ${generateInputField('district-edit', 'District', 'text', true)}
            <div class="states">
                ${generateInputField('city-name-edit', 'City Name', 'text', true)}
                ${generateInputField('state-name-edit', 'State Name', 'text', true)}
            </div>
            <div class="radio-buttons" id="packed-radio-buttons">
                <label><input type="radio" id="home-radio" name="packed" class="packed" value="Home" required> Home</label>
                <label><input type="radio" id="office-radio" name="packed" class="packed" value="office" required> Office</label>
                <label><input type="radio" id="others-radio" name="packed" class="packed" value="others" required> Others</label>
            </div>
            <div class="button-div">
                <button id="update-button-edit" class="btn"  data-id="${data[index]._id}">UPDATE</button>
            </div>
        </div> 
    `;

    // 

    console.log(index)

    // Show container and replace form content
    $('.section-container').show();
    $('.form').empty().append(profileaddressform);

    const addressData = data[index];

    $('#full-name-edit').val(addressData.name); 
    $('#mobile-edit').val(addressData.mobile); 
    $('#address-edit').val(addressData.houseNumber); 
    $('#locality-edit').val(addressData.street); 
    $('#pincode-edit').val(addressData.pin); 
    $('#landmark-edit').val(addressData.landmark); 
    $('#district-edit').val(addressData.district); 
    $('#city-name-edit').val(addressData.city); 
    $('#state-name-edit').val(addressData.state); 

    const addressType = addressData.addressType.toLowerCase();
    if (addressType === 'home') {
        $('#home-radio').prop('checked', true);
    } else if (addressType === 'office') {
        $('#office-radio').prop('checked', true);
    } else if (addressType === 'others') {
        $('#others-radio').prop('checked', true);
    }
}



$(document).on('click', '.edit-button', function () {
    var index = $(this).data('index');
    alladdress(function (data) {
        editform(data, index);
    });
});



$(document).on('click', '#update-button-edit', function () {
    var addressId = $(this).data('id'); 
    console.log(addressId);

    // Collect form data
    const formData1 = {
        name: $('#full-name-edit').val(),
        mobile: $('#mobile-edit').val(),
        houseNumber: $('#address-edit').val(),
        street: $('#locality-edit').val(),
        pin: $('#pincode-edit').val(),
        district: $('#district-edit').val(),
        city: $('#city-name-edit').val(),
        state: $('#state-name-edit').val(),
        country: 'India', 
        landmark: $('#landmark-edit').val(),
        addressType: $('input[name="packed"]:checked').val().toLowerCase(),
    };

    console.log(formData1);

    const url = profilebar.addressapi + addressId;
    const method = 'PATCH';
    const authorizationKey = headers35;
    const requestData = formData1;

    fetchapiData(
        url,
        method,
        authorizationKey,
        requestData,
        function (response) {
            console.log('Address updated successfully:', response);
            window.location.reload();
            alladdress(myaddresses)
            $('.booking-row').show();
            $('.section-container').hide();
            createFloatingBox('Address updated successfully');

        },
        function (xhr, status, error) {
            console.error('Request failed:', error);
            console.log('Response:', xhr.responseText);
            createFloatingBox(xhr.responseText.message);

        }
    );

});








function generateInputField(id, labelText, type = 'text', disabled = false, value = '', hasPlaceholder = false) {
    const placeholderClass = hasPlaceholder ? 'has-placeholder' : '';

    const inputHTML = `
        <div class="input-field" id="${id}-top">
            <input type="${type}" id="${id}" ${disabled ? 'disabled' : ''} ${value ? 'value="' + value + '"' : ''} class="${placeholderClass}" required>
            <label class="label-classe ${value ? 'active' : ''}" id="${id}-label" for="${id}">${labelText}</label>
            <p class="helper-text">Please fill out this field</p>
        </div>`;

    return inputHTML;
}


function generateSelectField(id, labelText, index, showOptions = true, options = []) {
    var optionsHTML = '';

    if (showOptions) {
        optionsHTML = '<option value="" disabled selected>Select Type</option>';

        options.forEach(option => {
            optionsHTML += `<option value="${option}">${option}</option>`;
        });
    }

    var inputSELECT = `
        <div class="input-field" id="select-one-${index}">
            <select id="${id}" required>
                ${optionsHTML}
            </select>
            <label for="${id}" id="${id}-label">${labelText}</label>
            <p class="helper-text">Select the Courier Type</p>
        </div>
    `;

    return inputSELECT;
}




function fetchcity(pincodeId, cityId, stateId, districtid) {
    var selectedValue = $('#' + pincodeId).val();

    var url = couriers.fetchpincodes + selectedValue;
    var method = 'GET';
    var authorizationKey = headers35;


    // No requestData needed for GET method, so pass null
    var requestData = null;

    fetchapiData(url, method, authorizationKey, requestData,
        function (data) {
            console.log('Request successful:', data);
            $('#' + cityId).val(data.city);
            $('#' + districtid).val(data.city);
            $('#' + stateId).val(data.state);

        },
        function (xhr, status, error) {
            console.error('Request failed:', error);
        }
    );
}




var profileaddressform = `
    <div class="profile-form">
        ${generateInputField('full-name', 'Full Name')}
        ${generateInputField('mobile', 'Enter alternate mobile number', 'number')}
        ${generateInputField('address', 'House No./Building/Apartment')}
        ${generateInputField('locality', 'Area/Sector/Locality/village')}
        ${generateInputField('pincode', ' Pincode', 'number')}
        ${generateInputField('landmark', 'Landmark(Optional)')}
        ${generateInputField('district', 'District', 'text', true)}
        <div class = "states">
        ${generateInputField('city-name', 'City Name', 'text', true)}
        ${generateInputField('state-name', 'State Name', 'text', true)}
        </div>

             <div class="radio-buttons" id="packed-radio-buttons">
                <label><input type="radio" name="packed" class ="packed" value="Home" required> Home</label>
                <label><input type="radio" name="packed" class ="packed" value="office" required> Office</label>
                <label><input type="radio" name="packed" class ="packed" value="others" required> Others</label>
            </div>
      <div class = "button-div">
            <button id="update-button" class = "btn">UPDATE</button>
        </div>
    </div> 
`;

$('.form').append(profileaddressform);

$(document).on('input', '#mobile', function () {
    var mobileNumber = $(this).val();
    var firstDigit = parseInt(mobileNumber.charAt(0), 10);

    if (mobileNumber.length === 10 && firstDigit >= 6 && firstDigit <= 9) {
        $(this).css('border', '1px solid green');
        $('#mobile-label').css('color', 'green');
        $(this).siblings('.helper-text').text('Invalid mobile number').css('color', 'red').hide()
    } else {
        if (mobileNumber.length === 0) {
            $(this).siblings('.helper-text').text('Please fill out this field').css('color', 'red');
        } else {
            $(this).siblings('.helper-text').text('Invalid mobile number').css('color', 'red').show()
        }
    }
});


function validateForm1() {
    let isValid = true;

    // Validate required fields
    $('.profile-form input[required], .profile-form select[required]').each(function () {
        if ($(this).attr('id') === 'landmark') {
            
            return true; 
        }
        if ($(this).val() === '' || !$(this).val()) {
            isValid = false;
            $(this).siblings('.helper-text').show();
            $(this).addClass('error');
        } else {
            $(this).siblings('.helper-text').hide();
            $(this).removeClass('error');
        }
    });

    // If form is valid, gather data
    if (isValid) {
        const fullName = $('#full-name').val();
        const mobile = $('#mobile').val();
        const address = $('#address').val();
        const locality = $('#locality').val();
        const pincode = $('#pincode').val();
        const landmark = $('#landmark').val();
        const district = $('#district').val();
        const cityName = $('#city-name').val();
        const stateName = $('#state-name').val();
        const packedValue = $('input[name="packed"]:checked').val();

        const formData = {
            "name": fullName,
            "mobile": mobile,
            "houseNumber": address,
            "street": address,
            "pin": pincode,
            "district": district,
            "city": cityName,
            "state": stateName,
            "country": "India",
            "landmark": landmark,
            "addressType": packedValue,


        };

        console.log('Form Data:', formData);
        addaddress(formData);
    } else {
        console.log('Form validation failed.');
    }
}

// Handle input restrictions
$('#mobile').on('input', function () {
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
});

$('#pincode').on('input', function () {
    if (this.value.length > 6) {
        this.value = this.value.slice(0, 6);
    }
    if (this.value.length === 6) {
        $(this).css("border", "1px solid green");
        $('#pincode-label').css("color", "green");
        fetchcity('pincode', 'city-name', 'state-name', 'district');
    } else {
        $(this).css("border", "1px solid red");
    }
});


function addaddress(formData) {
    const url = profilebar.addressapi;
    const method = 'POST';
    const authorizationKey = headers35;
    console.log(formData)
    fetchapiData(url, method, authorizationKey, formData,
        function (data) {
            console.log('Request successful:', data);
            window.location.reload();
            $('.booking-row').show();
            $('.section-container').hide();

            alladdress(myaddresses)

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

$(document).on('click', '#update-button', function () {
    validateForm1();
});



$(document).on('click', `#new-form`, function () {
    $('.booking-row').hide();
    $('.section-container').show();
})



$(document).on('click', '#backimg', function () {
    $('.section-container').hide();
    $('.booking-row').show();
});