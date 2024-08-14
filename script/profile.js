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



function generateInputField(id, labelText, type = 'text', disabled = false, value = '', hasPlaceholder = false) {
    const placeholderClass = hasPlaceholder ? 'has-placeholder' : '';

    const inputHTML = `
        <div class="input-field">
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



var options = ['Male', 'Female', 'Other'];
var profileform = `
    <div class="profile-form">
        ${generateInputField('full-name', 'Full Name')}
        ${generateInputField('email', 'Email', 'email')}
        ${generateInputField('mobile', 'Mobile', 'number',)}
        ${generateInputField('birthdate', 'Date of birth', 'date', false, '', false)}
        ${generateSelectField('gender', 'Gender', 1, true, options)}
        ${generateInputField('income', 'Income(Lac Per annum)', 'number')}
      <div class = "button-div" >
            <button id="update-button" class = "btn">UPDATE</button>
        </div>
    </div> 
`;





$('.form').append(profileform);
const fullName1 = $('#full-name').val(localStorage.getItem('username'))|| '';
const email1 = $('#email').val(localStorage.getItem('email'))|| '';
const mobile1 = $('#mobile').val(localStorage.getItem('mobileNumber'))|| '';
const birthdate1 = $('#birthdate').val(localStorage.getItem('dateOfBirth'))|| '';
const gender1 = $('#gender').val(localStorage.getItem('gender'))|| '';
const income1 = $('#income').val(localStorage.getItem('income'))|| '';






function validateForm1() {
    let isValid = true;

    // Validate required fields
    $('.profile-form input[required], .profile-form select[required]').each(function () {
        const fieldId = $(this).attr('id');

        // Email validation
        if (fieldId === 'email') {
            const email = $(this).val();
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                isValid = false;
                $(this).siblings('.helper-text').text("Please enter a valid email address.").show();
                $(this).addClass('error');
                $(this).css("border", "1px solid red");
            } else {
                $(this).siblings('.helper-text').hide();
                $(this).removeClass('error');
                $(this).css("border", "1px solid green");
            }
        }
        // Full name validation
        else if (fieldId === 'full-name') {
            const fullName = $(this).val();
            const namePattern = /^[a-zA-Z\s]*$/; // Only letters and spaces allowed
            if (!namePattern.test(fullName)) {
                isValid = false;
                $(this).siblings('.helper-text').text("Please enter a valid name (letters and spaces only).").show();
                $(this).addClass('error');
                $(this).css("border", "1px solid red");
            } else {
                $(this).siblings('.helper-text').hide();
                $(this).removeClass('error');
                $(this).css("border", "1px solid green");
            }
        }
        // General required field validation
        else {
            if ($(this).val() === '' || !$(this).val()) {
                isValid = false;
                $(this).siblings('.helper-text').show();
                $(this).addClass('error');
            } else {
                $(this).siblings('.helper-text').hide();
                $(this).removeClass('error');
            }
        }
    });

    // If form is valid, gather data
    if (isValid) {
        updateprofile();
        console.log('Form validation successful.');
        return true; // Indicate that the form is valid
    } else {
        console.log('Form validation failed.');
        return false;
    }
}



$('#mobile').on('input', function () {
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }
});


$('#full-name').on('input', function () {
    this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
});




$('#email').on('input', function () {
    var emailField = $('#email');

    var email = emailField.val();

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

});


function updateprofile() {
    console.log("Sending data to server:");


    const fullName = $('#full-name').val();
    const email = $('#email').val();
    const mobile = $('#mobile').val();
    const birthdate = $('#birthdate').val();
    const gender = $('#gender').val();
    const income = $('#income').val();


    const dataToSend = {
        "name": fullName,
        "email": email,
        "gender": gender,
        "dateOfBirth": birthdate,
        "income": income,
        "mobileNumber": "9963126117",
        "countryCode": "+91",


    };

    console.log(dataToSend)
    $.ajax({
        url: profilebar.updateprofileapi, // Ensure this URL is correctly defined
        method: 'POST',
        headers: headers35, // Check that headers35 is defined correctly
        data: JSON.stringify(dataToSend),
        contentType: 'application/json',
        success: function (response) {
            console.log('Data sent successfully:', response);
            if (response.success === true) {
                $('.floating-box').show();
                $('.section-container').hide();

                localStorage.setItem('username', dataToSend.name);
                localStorage.setItem('email', dataToSend.email);
                localStorage.setItem('gender', dataToSend.gender);
                localStorage.setItem('dateOfBirth', dataToSend.dateOfBirth);
                localStorage.setItem('income', dataToSend.income);
                localStorage.setItem('mobileNumber', dataToSend.mobileNumber);

        
                setTimeout(function () {
                    $('.floating-box').hide();
                }, 5000);

                window.location.reload();


            }

        },
        error: function (xhr, status, error) {
            console.log('Request failed:', error);
        }
    });

}

$(document).on('click', `#update-button`, function () {
    validateForm1()
})