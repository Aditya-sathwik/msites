
function applyThemeProperties(properties) {
    const root = document.documentElement; // or use document.body

    // Background colors
    root.style.setProperty('--bgColor', properties.bgColor);
    root.style.setProperty('--bottomBgColor', properties.bottomBgColor);
    root.style.setProperty('--headerColor1', properties.headerColor1);
    root.style.setProperty('--headerColor2', properties.headerColor2);
    root.style.setProperty('--iconBgColor', properties.iconBgColor);
    root.style.setProperty('--specialButtonBackgroundColor', properties.specialButtonBackgroundColor);
    root.style.setProperty('--statusBarColor', properties.statusBarColor);

    // Text colors
    root.style.setProperty('--bottomTextActiveColor', properties.bottomTextActiveColor);
    root.style.setProperty('--bottomTextInActiveColor', properties.bottomTextInActiveColor);
    root.style.setProperty('--buttonTextColor', properties.buttonTextColor);
    root.style.setProperty('--buttonTextInActiveColor', properties.buttonTextInActiveColor);
    root.style.setProperty('--checkBoxInActiveColor', properties.checkBoxInActiveColor);
    root.style.setProperty('--headerTextColor', properties.headerTextColor);
    root.style.setProperty('--iconBgFrontColor', properties.iconBgFrontColor);
    root.style.setProperty('--radioBoxInActiveColor', properties.radioBoxInActiveColor);
    root.style.setProperty('--subTextColor', properties.subTextColor);
    root.style.setProperty('--textColor', properties.textColor);
    root.style.setProperty('--viewAllTextColor', properties.viewAllTextColor);

    // Button colors
    root.style.setProperty('--buttonBgColor', properties.buttonBgColor);
    root.style.setProperty('--buttonBgInActiveColor', properties.buttonBgInActiveColor);

    // Checkbox and radio button colors
    root.style.setProperty('--checkBoxActiveColor', properties.checkBoxActiveColor);
    root.style.setProperty('--checkBoxBorderColor', properties.checkBoxBorderColor);
    root.style.setProperty('--radioBoxActiveColor', properties.radioBoxActiveColor);

    // Icon and shadow colors
    root.style.setProperty('--iconBorderColor', properties.iconBorderColor);
    root.style.setProperty('--iconWidgetColor', properties.iconWidgetColor);
    root.style.setProperty('--shadowColor', properties.shadowColor);
}



var cachedTermsData = null;


// Function to fetch terms and conditions and render based on type
function fetchTermsAndRender(type) {
    // Check if data is already cached
    if (cachedTermsData) {
        // Render immediately from cache
        renderData(cachedTermsData, type);
    } else {
        // Make API call to fetch data
        $.ajax({
            url: couriers.termsandconditions,
            method: 'POST',
            headers: headers34,
            data: JSON.stringify({
                "type": "staticPage",
                "slug": "courier-terms-and-conditions",
                "version": 0
            }),
            contentType: 'application/json',
            success: function (response) {
                console.log('Request successful:', response);
          
                cachedTermsData = response.data;
                // Render based on type
                renderData(response.data, type);
            },
            error: function (xhr, status, error) {
                console.error('Request failed:', error);
            }
        });
    }
}

// Function to render data based on type
function renderData(data, type) {
    if (type === 'modal') {
        renderModal(data);
    } else if (type === 'instructions') {
        renderInstructions(data);
    }
}

// Function to render terms and conditions in a modal
function renderModal(data) {
    // Extract the English terms by default
    var terms = data.en;

    // Prepare modal HTML
    var modalContent = `
    <div id="termsModal" class="modal">
        <div class="slide-bar"> <div class="slide-bar1"></div></div>
        <div class="terms-modal-content">
            <h1>Terms and Conditions</h1>
            <h2 class="terms-modal-title">${terms.title}</h2>
            <p class="terms-modal-description">${terms.description}</p>
            <ul class="terms-list">`;

    // Loop through subpoints and render them
    terms.subPoints.forEach(function (subPoint) {
        modalContent += `
        <li>
            <h3 class="subpoint-title">${subPoint.Title}</h3>
            <p class="subpoint-text">${subPoint.point}</p>
            ${subPoint.subPoint ? '<ul class="subpoint-list">' : ''}
            ${subPoint.subPoint ? subPoint.subPoint.map(sub => `<li>${sub.point}</li>`).join('') : ''}
            ${subPoint.subPoint ? '</ul>' : ''}
        </li>`;
    });

    modalContent += `
        </ul>
    </div>
     </div>
    <button class="got-it-btn">GOT IT</button>
   `;

    // Append modal HTML to body
    $('.tc2').html(modalContent);

    // Display modal when ready
    $('.tc2').css('display', 'flex');

    // Hide main content when modal is displayed
    $('#courier-body').css('display', 'none');

    // Close modal when user clicks close button
    $('.got-it-btn').on('click', function () {
        $('#courier-body').css('display', 'block');
        $('.term_conditions').css('display', 'none');
    });
}

// Function to render instructions
function renderInstructions(data) {
    var instructions = data.en.instructions;

    var instructionContent = `
     
        <div id="termsmodal1" class="modal">
            <h2>${instructions.title}</h2>
            <div class="terms-modal-content">
                <ul class="instruction-list">`;

    instructions.subPoints.forEach(function (point) {
        instructionContent += `
            <li>
                <p class="instruction-text">${point.point}</p>
                ${point.subPoints ? '<ul class="instruction-subpoints">' : ''}
                ${point.subPoints ? point.subPoints.map(sub => `<li>${sub.point}</li>`).join('') : ''}
                ${point.subPoints ? '</ul>' : ''}
            </li>`;
    });

    instructionContent += `
                </ul>
                <h2 id="booking-title">${instructions.BookingTitle}</h2>
                <ul class="booking-points">`;

    instructions.BookingPoints.forEach(function (point) {
        instructionContent += `
            <li>
                <h4 class="booking-title">${point.title} <span class="booking-text">${point.points}</span></h4>
            </li>`;
    });

    instructionContent += `
                </ul>
            </div>
        </div>
        <div class="actions">
            <input type="checkbox" id="agree" name="agree">
            <label for="agree">I have read the general instructions above and agree to follow them.</label>
            <div class = "action-buttons">
                <button id="cancel" disabled>Cancel</button>
                <button id="next" disabled>Next</button>
            </div>
        </div>`;

    // Append instructions HTML to the instructions body div
    $('.ib2').html(instructionContent);

    // Display instructions when ready
    // $('.instructions').css('display', 'flex');


    $('#agree').change(function () {
        if ($(this).is(':checked')) {
            $('#next').removeClass('disabled').addClass('enabled').prop('disabled', false);
        } else {
            $('#next').removeClass('enabled').addClass('disabled').prop('disabled', true);
        }
    });

    $('#next').on('click', function () {
        console.log("clicked");
        $('.instructions-body').css('display', 'none');
        $('#courier-body').hide()
        $('.result-container').css('display', 'none');
        $('.dc2-buttons').css('display', 'none');
        $('#pincode-input').val('');
        $('.delivery-time').html('');
        $('#pincode-input').css('border', ' 1px solid var(--iconBorderColor)');
        $('#pincode-input-label').css('color', '  var(--textcolor)');
        $('.delivery-checker').css('display', 'block');

        history.pushState({ page: 'deliverychecker' }, '', '?state=deliverychecker');
    });
}


$('.term_conditions').hide();
$('.tcn').hide();


// Click event handler for terms and conditions modal
$('.ibutton').on('click', function () {
    fetchTermsAndRender('modal');
    $('.tcn').show();

    $('.term_conditions').css('display', 'block');

});

// Click event handler for instructions
$('#goins').on('click', function () {
    fetchTermsAndRender('instructions');
    $('#instructions-body').show();
    $('.delivery-checker').css('display', 'none');
    $('.term_conditions').css('display', 'none');

    $('#courier-body').hide();

    history.pushState({ page: 'instructions' }, '', '?state=instructions');

});
$(document).on('click', '#next-form', function () {
    fetchparcel();
    $('#delivery-form input[required], #delivery-form select[required]').not('#pincode, #weight-unit,.fragile,.packed').each(function () {
        $(this).val(''); // Reset the value
    });
    $('#delivery-form input[type="radio"]').prop('checked', false);

    //   Optionally, reset any validation styles or messages
    $('#delivery-form input[required], #delivery-form select[required]').not('#pincode-input').removeClass('error');
    $('#delivery-form input[required], #delivery-form select[required]').not('#pincode-input').siblings('.helper-text').hide();
    $('#receiver-mobile').css('border', ' 1px solid var(--iconBorderColor)');
    $('#receiver-mobile-label').css('color', '  var(--textcolor)');
    fetchPincode('pincode', 'city-name', 'state-name')
    fetchTermsAndRender('instructions');

    $('#delivery-form').show();
    // Push state to the URL
    history.pushState({ page: 'deliveryform' }, '', '?state=deliveryform');

});


$('#pincode-input').on('input', function () {
    if (this.value.length > 6) {
        this.value = this.value.slice(0, 6);
    }
    if (this.value.length === 6) {

        const pincodeInput = $('#pincode-input').val();
        $(this).css("border", "1px solid green");
        $('#pincode-input-label').css("color", "green")
        fetchPincodeData(pincodeInput);
        $('#pincode').val(pincodeInput);

        $('.result-container').css('display', 'flex');
        $('.dc2-buttons').css('display', 'flex');
    } else {
        $(this).css("border", "1px solid red");
    }
});


let cachedPincodeData = null;

function fetchPincodeData(pincodeInput) {
    // Make API call to fetch data
    $.ajax({
        url: couriers.pincodes,
        method: 'POST',
        headers: headers35,
        data: JSON.stringify({
            "pincode": pincodeInput
        }),
        contentType: 'application/json',
        success: function (response) {
            console.log('Request successful:', response);
            // Check if pincode is serviceable


            // Cache the fetched data
            cachedPincodeData = { pincode: pincode, result: response.result };
            // Render the data
            renderPincodeData(response.result);

        },
        error: function (xhr, status, error) {
            console.error('Request failed:', error);
            // Display image and message for not serviceable pincode
            renderPincodeNotServiceable();
        }
    });
}



function renderPincodeNotServiceable() {
    $('#pincode-input').css('border', ' 1px solid red');
    $('#pincode-input-label').css('color', '  red');
    $('.delivery-time').html('');
    $('.result-container').html(`
        <div class= "error-img-div">
        <img src="../svg/PinLocation.svg"  alt="Image Description">
        </div>
        <p>Pincode is not serviceable</p>
          <button class="cancel-btn">cancel</button>    
    `);




}

function renderPincodeData(data) {

    // Convert estimated delivery time to days
    const hours = parseInt(data.message.match(/(\d+)-(\d+)/)[1]);
    const days = Math.ceil(hours / 24);
    const deliveryMessage = `Estimated Delivery Time within ${days} ${days > 1 ? 'days' : 'day'} on working days.`;
    // $(document).$('.courier-service').css('border', ' 1px solid var(--iconBorderColor)');
    $('.delivery-time').html(` ${deliveryMessage}`);




    $('.result-container').html(`
            <p class = "courier-service">Courier Service is Available at  <span> ${$('#pincode-input').val()} </span></p>
               <button class="next-btn" id="next-form">Next</button>
        `);


}







$(document).on('click', '.cancel-btn', function () {
    console.log("cancel-button-clicked")
    $('.delivery-checker').css('display', 'none');
    $('.cancel-btn').css('display', 'none');
    $('#courier-body').css('display', 'block');
});





function generateInputField(id, labelText, type = 'text', disabled = false, value = '') {
    var inputHTML = `
        <div class="input-field">
            <input type="${type}" id="${id}" ${disabled ? 'disabled' : ''} ${value ? 'value="' + value + '"' : ''} required>
            <label class="label-classe ${value ? 'active' : ''}" id="${id}-label"  for="${id}">${labelText}</label>
            <p class="helper-text">Please fill out this field</p>
        </div>`;
    return inputHTML;
}


function generateSelectField(id, labelText, index, showOptions = true, option1, option2) {
    var optionsHTML = '';
    if (showOptions) {
        optionsHTML = `
            <option value="" disabled selected>Select Type</option>
            <option value="${option1}">${option1}</option>
            <option value="${option2}">${option2}</option>
        `;
    }

    var inputSELECT = `
        <div class="input-field" id="select-one-${index}">
            <select id="${id}" required>
                ${optionsHTML}
            </select>
            <label for="${id}">${labelText}</label>
            <p class="helper-text">Select the Courier Type</p>
        </div>
    `;

    return inputSELECT;
}

// Generate the entire delivery form structure
var deliveryForm = `
    <div class="delivery-form">
        <h2>Shipment Type</h2>
        ${generateSelectField('select-type', 'Select Type', 1, true)}
        ${generateSelectField('select-package-category', 'Select Package Category', 2)}

        <h3>Receiver Details</h3>
        ${generateInputField('receiver-name', 'Receiver Name')}
        ${generateInputField('receiver-mobile', 'Enter receiver 10 digit mobile no.', 'number')}
        ${generateInputField('receiver-email', 'Enter your email ID')}

        <h3>Delivery Address</h3>
        ${generateInputField('delivery-address', 'Flat/House No./Floor/Building')}
        ${generateInputField('delivery-locality', 'Area/Sector/Locality')}
        ${generateInputField('landmark', 'Nearby Landmark')}
        ${generateInputField('pincode', 'Enter Pincode')}
        ${generateInputField('city-name', 'City Name', 'text', true, 'New York')}
        ${generateInputField('state-name', 'State Name', 'text', true)}
<div class="parcel-weight-section">
            <h3 id="parcel-weight-heading">Parcel Weight</h3>
            <p class ="side-text">*Maximum Weight Allowed: 10 kg or 10000 gms.</p>
         <div class = "weight-boxes">
  <div class="input-field" id="weight-input-field">
                    <input type="number" id="item-weight" required>
                    <label for="item-weight" id="weight-label">Approx. Item Weight</label>
             <p class="helper-text">Enter Package Weight</p>
                </div>

      <div class="input-field  " id="unit-select-field">
           <select id="weight-unit" required>
                        <option value="kg">kg</option>
                        <option value="gms">gms</option>
                    </select>
                    <label for="weight-unit" id="unit-label">Unit</label>
                    <p class="helper-text">Please select a unit</p>
                </div>
            </div>


           
        <div class="radio-group" id="fragile-radio-group" style="display: none;">
            <p id="fragile-question">Does your package contain fragile items?</p>
            <div class="radio-buttons" id="fragile-radio-buttons">
                <label><input type="radio" name="fragile"  class="fragile" value="YES" required> Yes</label>
                <label><input type="radio" name="fragile" class="fragile" value="NO" required> No</label>
            </div>
            <p class="helper-text">Please select whether the item is fragile.</p>
        </div>

     
        <div class="radio-group" id="packed-radio-group">
            <p id="packed-question">Is your Package packed?</p>
            <div class="radio-buttons" id="packed-radio-buttons">
                <label><input type="radio" name="packed" class ="packed" value="YES" required> Yes</label>
                <label><input type="radio" name="packed" class ="packed" value="NO" required> No</label>
            </div>
            <p class="helper-text">Please select if the package is packed.</p>
        </div>

   
               

          
      
       
     </div>
      <div class = "button-div">
            <button id="next-button" class = "next-button">Next</button>
        </div>
    </div> 
`;




// Append the form structure to the container

$('.delivary-form').append(deliveryForm);

$(document).on('change', 'input[name="packed"]', function () {
    if ($(this).val() === 'NO') {
        $('#custom-alert').show();
    }
});
// Event listener for OK button in custom alert
$('#ok-button').click(function () {
    $('#custom-alert').hide();
    $('.delivery-form').css('display', 'none');
    $('#courier-body').css('display', 'block');
});



$('#select-type').change(function () {
    var selectedValue = $(this).val();
    if (selectedValue === 'PARCEL') {
        $('#fragile-radio-group').show(); // Show fragile-radio-group
        $('#parcel-weight-heading').text('Parcel Weight'); // Change heading
        $('.side-text').text('*Maximum Weight Allowed: 10 kg or 10000 gms.');
    } else if (selectedValue === 'DOCUMENT') {
        $('#fragile-radio-group').hide(); // Hide fragile-radio-group
        $('#parcel-weight-heading').text('Weight'); // Change heading
        $('.side-text').text('*Maximum Weight Allowed: 5 kg or 5000 gms.');
    }
});

// Event listeners for input restrictions
$('#receiver-mobile').on('input', function (e) {
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
});

$(document).on('input', '#receiver-mobile', function () {
    var mobileNumber = $(this).val();
    var firstDigit = parseInt(mobileNumber.charAt(0), 10);

    if (mobileNumber.length === 10 && firstDigit >= 6 && firstDigit <= 9) {
        $(this).css('border', '1px solid green');
        $('#receiver-mobile-label').css('color', 'green');
    } else {
        if (mobileNumber.length === 0) {
            $(this).siblings('.helper-text').text('Please fill out this field').css('color', 'red');
        } else {
            $(this).siblings('.helper-text').text('Invalid mobile number').css('color', 'red').show()
        }
    }
});


$('#pincode').on('input', function () {
    if (this.value.length > 6) {
        this.value = this.value.slice(0, 6);
    }
    if (this.value.length === 6) {
        $(this).css("border", "1px solid green");
        $('#pincode-label').css("color", "green")
        fetchPincode('pincode', 'city-name', 'state-name')
    } else {
        $(this).css("border", "1px solid red");
    }
});



$('#item-weight').on('input', function () {
    var weight = parseFloat(this.value);
    var unit = $('#weight-unit').val();
    var maxWeight = $('#select-type').val() === 'DOCUMENT' ? (unit === 'kg' ? 5 : 5000) : (unit === 'kg' ? 10 : 10000);

    if (weight > maxWeight) {
        this.value = maxWeight;
    }

});



$('#weight-unit').on('change', function () {

    $('#item-weight').trigger('input');

});










function fetchPincode(pincodeId, cityId, stateId) {
    var pincodeInput = $('#' + pincodeId).val();

    $.ajax({
        url: couriers.pincodes,
        method: 'POST',
        headers: headers35,
        data: JSON.stringify({
            "pincode": pincodeInput
        }),
        contentType: 'application/json',
        success: function (response) {
            console.log('Request successful:', response);

            $('#' + cityId).val(response.result.city);
            $('#' + stateId).val(response.result.state);

        },
        error: function (xhr, status, error) {
            console.log('Request failed:', error);
            $('#' + pincodeId).siblings('.helper-text').text("pincode " + pincodeInput + "  is not serviceable").show();
            $('#' + pincodeId).css("border", "1px solid red");

            $('#' + cityId).val("");
            $('#' + stateId).val("");
        }
    });
}

function hideShowElements() {
    console.log('All validations passed. Hiding/showing elements...');
    // $('.instructions-body').css('display', 'none');
    // $('.delivery-checker').css('display', 'none');
    // $('.term_conditions').css('display', 'none');
    $('#delivery-form').css('display', 'none');
    $('#senders-form').css('display', 'block');
    // $('#courier-body').css('display', 'none');
}



$('.input-field input, .input-field select').on('input change', function () {
    if (this.checkValidity()) {
        $(this).siblings('.helper-text').hide();
        $(this).removeClass('error');
    } else {
        $(this).siblings('.helper-text').show();
        $(this).addClass('error');
    }
});




// Append the form structure to the container

function validateForm() {
    var isValid = true;

    // Existing validations
    console.log('Performing existing validations...');
    $('.delivery-form input[required], .delivery-form select[required]').each(function () {
        console.log('Validating:', this);

        if ($(this).val() === '' || !$(this).val()) {
            isValid = false;
            $(this).siblings('.helper-text').show();
            $(this).addClass('error');
            console.log('Validation failed for:', this);
        } else {
            $(this).siblings('.helper-text').hide();
            $(this).removeClass('error');
            console.log('Validation passed for:', this);
        }
    });

    // New validations
    console.log('Performing new validations...');

    var emailField = $('#receiver-email');
    var weightField = $('#item-weight');
    var weightUnitField = $('#weight-unit');
    var selectedType = $('#select-type').val();
    var fragileField = $('input[name="fragile"]:checked').val();
    var packedField = $('input[name="packed"]:checked').val();

    console.log('Email field value:', emailField.val());
    console.log('Weight field value:', weightField.val());
    console.log('Weight unit field value:', weightUnitField.val());
    console.log('Selected type value:', selectedType);
    console.log('Fragile field value:', fragileField);
    console.log('Packed field value:', packedField);



    var email = emailField.val();
    var weight = parseFloat(weightField.val());
    var weightUnit = weightUnitField.val();

    // Validate email address
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        isValid = false;
        emailField.siblings('.helper-text').text("Please enter a valid email address.").show();
        emailField.addClass('error');
        emailField.css("border", "1px solid red");
        console.log('Invalid email format:', email);
    } else {
        emailField.siblings('.helper-text').hide();
        emailField.removeClass('error');
        emailField.css("border", "1px solid green");
        console.log('Valid email format:', email);
    }

    // Validate weight
    var maxWeight = selectedType === 'DOCUMENT' ? (weightUnit === 'kg' ? 5 : 5000) : (weightUnit === 'kg' ? 10 : 10000);
    console.log('Maximum allowed weight:', maxWeight);
    if (isNaN(weight) || weight <= 0 || weight > maxWeight) {
        isValid = false;
        weightField.siblings('.helper-text').text("Maximum Weight Allowed: " + maxWeight + (weightUnit === 'kg' ? " kg" : " gms")).show();
        weightField.addClass('error');
        weightField.css("border", "1px solid red");
        console.log('Invalid weight:', weight);
    } else {
        weightField.siblings('.helper-text').hide();
        weightField.removeClass('error');
        weightField.css("border", "1px solid green");
        console.log('Valid weight:', weight);
    }

    // Validate fragile selection if type is PARCEL
    if (selectedType === 'PARCEL' && !fragileField) {
        isValid = false;
        $('#fragile-radio-group .helper-text').text("Please select whether the item is fragile.").show();
        $('#fragile-radio-group input[name="fragile"]').addClass('error');
        console.log('Fragile selection missing.');
    } else {
        $('#fragile-radio-group .helper-text').hide();
        $('#fragile-radio-group input[name="fragile"]').removeClass('error');
        console.log('Fragile selection valid.');
    }

    // Validate packed selection
    if (!packedField) {
        isValid = false;
        $('#packed-radio-group .helper-text').text("Please select if the package is packed.").show();
        $('#packed-radio-group input[name="packed"]').addClass('error');
        console.log('Packed selection missing.');
    } else {
        $('#packed-radio-group .helper-text').hide();
        $('#packed-radio-group input[name="packed"]').removeClass('error');
        console.log('Packed selection valid.');
    }




    // Final validation check
    if (isValid) {
        console.log('Form validation passed.');
        hideShowElements(); // Call function to hide/show elements as needed
    } else {
        console.log('Form validation failed.');
    }
}




$(document).on('click', '#next-button', function () {
    $('.senders-form input[required], .senders-form select[required]').each(function () {
        $(this).val(''); // Reset the value
    });

    // Optionally, reset any validation styles or messages
    $('.senders-form input[required], .senders-form select[required]').removeClass('error');
    $('.senders-form input[required], .senders-form select[required]').siblings('.helper-text').hide();

    validateForm();

    history.pushState({ page: 'result' }, '', '?state=result');
});
// Add change event to remove error class on input when valid


function fetchDataapi(url, method,  requestData, successCallback, errorCallback) {
    // Make the AJAX call
    $.ajax({
        url: url,
        method: method,
        headers: headers35,
        data: JSON.stringify(requestData),
        contentType: 'application/json',
        success: function (response) {
            successCallback(response);
        },
        error: function (xhr, status, error) {
            errorCallback(xhr, status, error);
        }
    });
}


// Example usage:
function fetchparcel() {
    var url = couriers.parcelist;
    var method = 'GET';


    // No requestData needed for GET method, so pass null
    var requestData = null;

    fetchDataapi(url, method,  requestData,
        function (data) {
            console.log('Request successful:', data);
            populateOptions(data)
        },
        function (xhr, status, error) {
            console.error('Request failed:', error);
            // Handle error here
        }
    );
}

// Function to populate options
function populateOptions(data) {


    const selectElement = $('#select-type');

    // Clear existing options
    selectElement.empty();

    // Add default option
    selectElement.append($('<option>').val('').text('Select Type').prop('disabled', true).prop('selected', true));

    // Add options from API data
    data.forEach(function (item) {
        selectElement.append($('<option>').val(item.value).text(item.label));
    });


}

function fetchparceltype() {
    var selectedValue = $('#select-type').val();
    var url = couriers.parcel2+ selectedValue;
    var method = 'GET';


    // No requestData needed for GET method, so pass null
    var requestData = null;

    fetchDataapi(url, method, requestData,
        function (data) {
            console.log('Request successful:', data);
            populateOptionstype(data)
        },
        function (xhr, status, error) {
            console.error('Request failed:', error);
            // Handle error here
        }
    );
}


function populateOptionstype(data) {



    const selectElement = $('#select-package-category');

    // Clear existing options
    selectElement.empty();

    // Add default option
    selectElement.append($('<option>').val('').text('Select Type').prop('disabled', true).prop('selected', true));

    // Add options from API data
    data.forEach(function (item) {
        selectElement.append($('<option>').val(item.value).text(item.label));
    });


}




function getSelectedValue() {
    var selectedValue = $('#select-type').val();
    console.log('Selected Value:', selectedValue);
    // Use the selectedValue as needed
}

$('#select-type').on('change', function () {
    var selectedValue = $('#select-type').val();
    console.log('Selected Value:', selectedValue);
    $('#select-one-2').css('display', 'block');
    fetchparceltype(selectedValue)
});


var senderForm = `
    <div class="senderss-form">
        <h3 class="sender-details-heading">sender Details</h3>
        ${generateInputField('sender-name', 'Enter the Name of sender ')}
        ${generateInputField('sender-mobile', 'Enter Your 10 digit mobile no.', 'number')}

        <h3 class="sender-details-heading">sender Address</h3>
        ${generateInputField('sender-address', 'Flat/House No./Floor/Building')}
        ${generateInputField('sender-locality', 'Area/Sector/Locality')}
        ${generateInputField('sender-pincode', 'Senders Pincode', 'number')}
        ${generateInputField('sender-city-name', 'City Name', 'text', true)}
        ${generateInputField('sender-state-name', 'State Name', 'text', true)}

        <div class="Drop-Location-section">
            <h3 id="droplocation-heading">Drop Location</h3>
            <p class ="side-text-sender">*Select the Metro Station where you would want to drop the package</p>
               ${generateInputField('select-dropbox-station', 'Select Dropbox Station', 3)}

               <h3>Locker Size</h3>
               <div id = "loker-buttons">
          <div class="Drop-Location-section1" id = "buttonContainer">    </div>
          <div id = "lokerimage"> </div>
          <p id = "size-text"></p>
       </div>
       

             <div class = "button-div">
               <button id="Proceed-to-pay" class = "next-button"> Proceed to Pay</button>
        </div>
        </div>
    </div> 
`;

// Append the form structure to the container




$('.sender-form').append(senderForm);

function validateForm1() {
    var isValid = true;


    $('.senderss-form input[required], .senderss-form select[required]').each(function () {
        if ($(this).val() === '' || !$(this).val()) {
            isValid = false;
            $(this).siblings('.helper-text').show();


            $(this).addClass('error');
        } else {
            $(this).siblings('.helper-text').hide();
            $(this).removeClass('error');
        }
    });



    if (isValid) {
        fetchtariff()



    } else {
        console.log('Form validation failed.');
    }
}

// Event listeners for input restrictions
$('#sender-mobile').on('input', function (e) {
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
});


function fetchcity(pincodeId, cityId, stateId) {
    var selectedValue = $('#' + pincodeId).val();

    var url = couriers.fetchpincodes+selectedValue;
    var method = 'GET';
  

    // No requestData needed for GET method, so pass null
    var requestData = null;

    fetchDataapi(url, method, requestData,
        function (data) {

            console.log('Request successful:', data);
            $('#' + cityId).val(data.city);
            $('#' + stateId).val(data.state);

        },
        function (xhr, status, error) {
            console.error('Request failed:', error);
            // Handle error here
        }
    );
}

$(document).ready(function () {
    $('#sender-pincode').on('input', function () {
        if (this.value.length > 6) {
            this.value = this.value.slice(0, 6);
        }
        if (this.value.length === 6) {
            $(this).css("border", "1px solid green");
            $('#sender-pincode-label').css("color", "green")
            fetchcity('sender-pincode', 'sender-city-name', 'sender-state-name')
        } else {
            $(this).css("border", "1px solid red");
        }
    });
});



$('#sender-mobile').on('input', function () {
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




$(document).on('click', '#Proceed-to-pay', function () {

    validateForm1();
    




});
// Add change event to remove error class on input when valid
$('.input-field input, .input-field select').on('input change', function () {
    if (this.checkValidity()) {
        $(this).siblings('.helper-text').hide();
        $(this).removeClass('error');
    } else {
        $(this).siblings('.helper-text').show();
        $(this).addClass('error');
    }
});



function label(sizesLabels) {
    var buttons = sizesLabels.map((label, index) => `<a class="cont-size" data-index="${index}">${label}</a>`).join('');
    $('#buttonContainer').html(buttons);
}

$(document).on('click', '.cont-size', function () {
    // Reset styles for all buttons
    $('.cont-size').css({
        'background-color': 'var(--buttonBgInActiveColor)',
        'color': 'black',
    });

    // Apply styles to clicked button
    $(this).css({
        'background-color': 'var(--bottomTextActiveColor)',
        'color': 'white',
    });

    // Get index of clicked button
    var index = $(this).data('index');

    fetchlockerimage(index)
    console.log(index);
});


let imagesize

function fetchlockerimage(index) {
    var url = couriers.lokerimage;
    var method = 'GET';
    var authorizationKey = headers35;

    // No requestData needed for GET method, so pass null
    var requestData = null;

    fetchDataapi(url, method, authorizationKey, requestData,
        function (data) {
            console.log('Request successful:', data);
            var imageUrl = data[index].image;
            imagedimensions = data[index].title;
            imagesize = data[index].lockersize;

            const uri = `data:image/svg+xml,${encodeURIComponent(imageUrl)}`;

            var imag = `  <img src='${uri}' alt="${index}">`
            var sizess = `${imagedimensions}`

            $('#lokerimage').html(imag);
            $('#size-text').html(sizess);
        },
        function (xhr, status, error) {
            console.error('Request failed:', error);
            // Handle error here
        }
    );
}










//<-----------------selecting Stations---------------------------------------------------->

var lokerstations = [];
var currentInputField = null;

function fetchlokerStations() {
    $.ajax({
        url: couriers.lokerstationslist,
        method: 'GET',
        headers:headers35,
        success: function (data) {
            console.log("Loker Stations fetched successfully:", data);


            lokerstations = [];




            if (data && data.length > 0) {
                lokerstations = data.map(item => ({
                    name: item.station.name,
                    code: item.station.code,
                    sizes: item.sizes



                }));
                console.log("Mapped Loker Stations:", lokerstations);



            } else {
                console.error('Invalid or empty data received:', data);
            }
            populatelokerStationList();

        },
        error: function (error) {
            console.error('Error fetching station data:', error);
        }
    });
}

fetchlokerStations();





function populatelokerStationList() {
    console.log("Populating station list...");

    var stationList = $('#station-list');
    stationList.empty();

    lokerstations.forEach(function (station) {
        // Create a list item
        var listItem = $('<li  id = "main-list" >');
        var lineCodeName = $('<p>').text(station.name)


        // Create the line code span with inline styling
        var lineCodeSpan = $('<span>').text(station.lineCodeName)
        // Set inline background color
        var lineCodeSpan1 = $('<span id = "sec">').text(station.lineCodeName1)
            .css({
                'background-color': station.lineCodeColor1,
                'border': '2px solid ' + station.lineCodeColor1,
            });

        stationList.find('span').each(function () {
            var spanText = $(this).text().trim();
            if (spanText === '') {
                $(this).hide(); // Hide empty spans using CSS display: none;
            }
        })


        listItem.append(lineCodeName, ' '); // Add a space between name and code
        listItem.append(lineCodeSpan);
        listItem.append(lineCodeSpan1);




        listItem.on('click', function () {
            var stationName = station.name; // Use station.name directly
            if (currentInputField) {
                var stationCode = station.code; // Get the station code
                currentInputField.val(stationName);



                var selectedStationName = stationName;

                // Find the selected station object
                var selectedStation = lokerstations.find(station => station.name === selectedStationName);


                if (selectedStation) {
                    // Extract sizes labels
                    var sizesLabels = selectedStation.sizes.map(size => size.label);
                    console.log("Sizes Labels for selected station:", sizesLabels);

                    label(sizesLabels)


                } else {
                    console.error('Selected station not found:', selectedStationName);
                }
                currentInputField.data('station-code', stationCode);
                $('#station-selection').hide();
                console.log(stationCode)
            }
        });



        stationList.append(listItem);
    });
}









$('#select-dropbox-station').on('change', function () {
    var inputField = $(this);
    var stationName = inputField.val().trim();
    var station = stations.find(s => s.name === stationName);
    if (station) {
        inputField.data('station-code', station.code);
    } else {
        inputField.data('station-code', ''); // Clear if station is not found
    }

});





$('#select-dropbox-station').on('click', function () {
    currentInputField = $(this); // Update the current input field
    console.log("Input field clicked:", currentInputField.attr('id'));
    $('#station-selection').show();
    clearsearch(); // Call clearsearch to reset search input and list

    if ($(this).attr('id') === 'destination') {
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
// <-----------------selecting Stations---------------------------------------------------->






function fetchtariff() {

    const pincodeInput = $('#pincode-input').val();
    var senderPincode = $('#sender-pincode').val();
    var itemWeight = $('#item-weight').val();
    var weightUnit = $('#weight-unit').val();
    if (weightUnit === 'kg') {
        itemWeight = itemWeight * 1000;

    }
    $.ajax({
        url: couriers.tariffcal,
        method: 'POST',
        headers:headers34 ,
        data: JSON.stringify({
            "sourceType": "locker", //these are fixed values
            "source": senderPincode,
            "destinationType": "address", //these are fixed values
            "destination": pincodeInput,
            "weight": itemWeight


           


        }),

        contentType: 'application/json',
        success: function (response) {
            console.log('Request successful:', response);
            tarifcalc(response)

        },
        error: function (xhr, status, error) {
            console.error('Request failed:', error);
            console.error('Response:', xhr.responseText);
        }
    });
}




function tarifcalc(response) {
    $('#tarrif').empty();
    response.result.map((item, index) => {
        var tarifbox = `<div class="tarif-show">
    <div class="tarif-price">
      <div class="tarif-message">
        <h3 class="tarif-heading">${item.message}</h3>
        <p>${item.time}Day</p>
        <h3 id= "courier-patner-name">Courier Service:<span>${item.courierPartnerName}</span></h3>
      </div>
      <div class="price-heading">
        <h3>₹${item.tariff}</h3>
      </div>
    </div>
    <div class="coupon-section" >
      <div  class = "tarif-coupen" id="tarif-coupen-${index}" >
        <h3>Apply Coupon <span>(optional)</span></h3>
        <span class="arrow"><img src="../svg/downArrow.svg" alt="downArrow"></span>
      </div>
      <div class = 'total-input-check' id= "total-input-check-${index}">
      <div class="input-check">
             ${generateInputField(`coupen-code-${index}`, 'Enter Coupon Code')}
        <button class="check-button">CHECK</button>
     </div>
     </div>
   

    </div>

       <div class="button-div">
                    <button class="tarif-btn" id = "payment-${index}" data-courier="${item.courierPartnerName}" data-tariff="${item.tariff} " data-time ="${item.time}" >PAY ₹${item.tariff}</button>
      </div>
</div>


`

        $('#tarrif').append(tarifbox);

        $(document).on('click', `#tarif-coupen-${index}`, function () {

            $(`#total-input-check-${index}`).toggle();
            if ($(`#total-input-check-${index}`).is(':visible')) {
                $(this).closest('.tarif-show').css('height', 'auto');
            } else {
                $(this).closest('.tarif-show').css('height', 'initial');
            }
        })
        // $(document).on('click', `#payment-${index}`, function () {

        //     var tariff = $(this).data('tariff');
        //     mainpay(tariff)

        // })



    });



    $('#tarrif').css('display', 'block');

    $('.sf2').css('filter', 'blur(10px)');




}

$(document).click(function (event) {
    if (!$(event.target).closest('#tarrif').length && !$(event.target).is('#tarrif')) {
        $('#tarrif').hide();
        $('.sf2').css('filter', 'blur(0px)');

        // $('.sf-tiket_header').show();

    }
});



$(document).on('click', `.tarif-btn`, function () {


    let lokStationCode = $('#select-dropbox-station').data('station-code');



    var courierPartnerName = $(this).data('courier');
    var tariff = $(this).data('tariff');
    var time = $(this).data('time');

    // fetchcourierbooking();
    var selectType = $('#select-type').val();
    var selectPackageCategory = $('#select-package-category').val();
    var receiverName = $('#receiver-name').val();
    var receiverMobile = $('#receiver-mobile').val();
    var receiverEmail = $('#receiver-email').val();
    var deliveryAddress = $('#delivery-address').val();
    var deliveryLocality = $('#delivery-locality').val();
    var landmark = $('#landmark').val();
    var pincode = $('#pincode').val();
    var cityName = $('#city-name').val();
    var stateName = $('#state-name').val();
    var itemWeight = $('#item-weight').val();
    var weightUnit = $('#weight-unit').val();
    var fragile = $('input[name="fragile"]:checked').val();
    var packed = $('input[name="packed"]:checked').val();
var newweight 
    if (weightUnit === "kg") {
       newweight = itemWeight * 1000;

    }
    else{
        newweight = itemWeight
    }
    //<------------------------------------- dlivary-form--------------------------------------->



    var senderName = $('#sender-name').val();
    var senderMobile = $('#sender-mobile').val();
    var senderAddress = $('#sender-address').val();
    var senderLocality = $('#sender-locality').val();
    var senderPincode = $('#sender-pincode').val();
    var senderCityName = $('#sender-city-name').val();
    var senderStateName = $('#sender-state-name').val();
    var selectDropboxStation = $('#select-dropbox-station').val();
    //<------------------------------------- dlivary-form--------------------------------------->

    var currentDate = new Date().toISOString().slice(0, 10);
    var currentTime = new Date().toTimeString().slice(0, 5);
    
    var formattedtime = currentDate+" "+currentTime
    console.log(formattedtime)

    
    console.log(selectType, selectPackageCategory, receiverName, receiverMobile, receiverEmail, deliveryAddress, deliveryLocality, landmark, pincode, cityName, stateName, itemWeight, weightUnit, fragile, packed, senderName, senderMobile, senderAddress, senderLocality, senderPincode, senderCityName, senderStateName, selectDropboxStation);

    console.log(fragile)
    let requetstBody = {
        "itemType": selectType, //PARCEL
        "contentType": selectPackageCategory, //HARDWARE, ELECTRONICS, etc..
        "senderName": senderName,
        "senderMobileNo": senderMobile,
        "senderAddress": senderAddress +"," +senderLocality + ','+ senderCityName + ","+senderStateName + ","+ senderPincode,
        "senderEmail": "shubham.gwari@anduriltechnologies.com",
        "receiverName": receiverName,
        "receiverMobileNo": receiverMobile,
        "receiverAddress": deliveryAddress +"," + deliveryLocality + ','+ landmark + ","+ cityName+ ","+stateName + ","+ pincode,
        "receiverEmail": receiverEmail,
        "type": "SELF_DROP", //If user wants to drop it in the locker himself. Otherwise: HOME_PICKUP
        "fragileItem": fragile, //Other value: YES
        "isPacked": packed, // ONLY IN CASE OF itemType "PARCEL"
        "dropboxStation": lokStationCode,
        "dropTime":formattedtime, //only DATE to be asked and time should be today's current time
        "itemWeight":`${newweight}`, //value must be in grams only
        "courierPartner": courierPartnerName, //RECEIVED FROM THE TARIFF API
        "finalAmount": tariff, //RECEIVED FROM THE TARIFF API
        "estimatedTAT": time,//RECEIVED FROM THE TARIFF API
         "dropboxSize" : "small"



    }

    if (selectType === 'PARCEL') {
        delete requetstBody.isPacked
    }
    if (selectType === 'DOCUMENT') {
        delete requetstBody.isPacked
        delete requetstBody.fragileItem
        
    }
   

console.log(requetstBody)
    fetchcourierbooking(requetstBody)


});

//<------------------------------------- dlivary-form--------------------------------------->

let globalBookingId;
let tariff;
function fetchcourierbooking(requetstBody) {
    console.log(requetstBody)
    $.ajax({
        url:couriers.orderplace,
        method: 'POST',
        headers:headers35,
        data: JSON.stringify(requetstBody),
        contentType: 'application/json',
        success: function (data) {
            console.log('Request successful:', data);
            globalBookingId = data.bookingID;
            tariff = data.finalAmount

            console.log('Global Booking ID:', globalBookingId);

            Paymentgate (globalBookingId, tariff)
        },
        error: function (xhr, status, error) {
            console.error('Request failed:', error);
            console.error('Response:', xhr.responseText);
        }

    });
}





// <------------------------------payment gate------------------------------------------->




 function Paymentgate (globalBookingId,tariff) {
    console.log(globalBookingId)
    
    console.log(tariff)

    console.log("Pay button clicked");
   
    
    const totalamount = tariff;
    const totalprice = Math.floor(totalamount);
    console.log(totalprice)
    var secretKey = "64c7cc9b8017a71f0dca9be96e980ed1536228d2eefd74202e4d7730ea33d988";
    var encrypted = CryptoJS.AES.encrypt(totalprice.toString(), secretKey).toString();
    console.log(encrypted);
    const apiData = {
        
            "serviceAmount": totalamount,
            "amount": totalamount,
            "purpose": "courier",
            "paymentGateway": "Autope",
            "hash": encrypted,
            "bookingID": globalBookingId
        
    };
    console.log(apiData)

    const apiUrl = 'http://35.200.153.72:3002/external/v2/pg/options';

    $.ajax({
        url: apiUrl,
        method: 'POST',
        contentType: 'application/json',
        headers: headers35,
        data: JSON.stringify(apiData),
        success: function (response) {
            // Check if the response is successful
            if (response.statusCode === 200) {
               
                console.log(response)
                totalamount: response.data;
                orderid = response.ORDER_ID;
                console.log(orderid);
                localStorage.setItem('orderid', orderid);
   let purpose = "Courier";
                showPaymentPage(totalprice, orderid,purpose)
            
            } else {
                console.log(apiData)

                // alert('Failed to fetch data from the API');
            }
        },
        error: function (error) {
            console.log(apiData)

           console.log('Error while fetching data from the API', error);
        }
    });









};



















// // <------------------------------payment gate------------------------------------------->





$(' #instructions-body, #delivery-checker,#delivery-form, #senders-form').hide()
// $(' #instructions-body, #delivery-checker,#delivery-form').hide()


$(document).on('click', '#backimg', function () {
    $('#instructions-body').hide();
    $('#courier-body').show();
});


// Back button click handler for courier-body section
$(document).on('click', '#dcbackimg', function () {

    $('#instructions-body').show();
    $('#delivery-checker').hide();
});

$(document).ready(function() {

window.addEventListener('popstate', function(event) {
    var state = event.state ? event.state.page : null;

    switch (state) {
        case 'instructions':
            $('#courier-body').hide();
            $('#instructions-body').show();
            $('#delivery-checker').hide();
            $('#senders-form').hide();
            $('#delivery-form').hide();


            break;
        case 'deliverychecker':
            $('#courier-body').hide();
            $('#instructions-body').hide();
            $('#delivery-checker').show();
            $('#senders-form').hide();
            $('#delivery-form').hide();
           
            break;
        case 'deliveryform':
            $('#courier-body').hide();
            $('#instructions-body').hide();
            $('#delivery-checker').hide();
            $('#delivery-form').show();
            $('#senders-form').hide();
           
            break;
        case 'result':
            $('#courier-body').hide();
            $('#instructions-body').hide();
            $('#delivery-checker').hide();
            $('#senders-form').hide();
            $('#delivery-form').show();
            break;
        default:
            $('#courier-body').show();
            $('#instructions-body').hide();
            $('#delivery-checker').hide();
            $('#senders-form').hide();
            $('#delivery-form').hide();
            break;
    }
});

function checkInitialState() {
    const params = new URLSearchParams(window.location.search);
    const state = params.get('state');
    
    switch (state) {
        case 'instructions':
            $('#courier-body').hide();
            $('#instructions-body').show();
            $('#delivery-checker').hide();
            $('#senders-form').hide();
            $('#delivery-form').hide();


            break;
        case 'deliverychecker':
            $('#courier-body').hide();
            $('#instructions-body').hide();
            $('#delivery-checker').show();
            $('#senders-form').hide();
            $('#delivery-form').hide();
         
            break;
        case 'deliveryform':
            $('#courier-body').hide();
            $('#instructions-body').hide();
            $('#delivery-checker').hide();           
            $('#delivery-form').show();
            $('#senders-form').hide();
            break;
        case 'result':
            $('#courier-body').hide();
            $('#instructions-body').hide();
            $('#delivery-checker').hide();
            $('#delivery-form').hide();
            $('#senders-form').show();
            break;
        default:
            $('#courier-body').show();
            $('#instructions-body').hide();
            $('#delivery-checker').hide();
            $('#senders-form').hide();
            $('#delivery-form').hide();
            break;
    }
}


    checkInitialState();
    // Existing code...
});
$(document).on('click', '#dfbackimg', function () {
    $('#delivery-form').hide();
    $('#delivery-checker').show();
});

$(document).on('click', '#sfbackimg', function () {
    $('#senders-form').hide();
    $('#delivery-form').show();
});





