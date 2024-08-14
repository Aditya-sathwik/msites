$(document).ready(function () {
    var accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        
        window.location.href = '../pages/home.html';
    } 
    console.log(accessToken)
    
    $('#requestOtpButton').on('click', function (event) {
        event.preventDefault(); // Prevent form submission

        const mobileNumber = $('#mobileNumber').val();
        const errorMessageContainer = $('#errorMessage');

        // Clear any previous error messages
        errorMessageContainer.text('');

        const mobileNumberPattern = /^[6-9][0-9]{9}$/;
        if (!mobileNumberPattern.test(mobileNumber)) {
            errorMessageContainer.text('Mobile Number is Invalid');
            return;
        }

        const requestBody = {
            mobileNumber: mobileNumber
        };

        $.ajax({
            url: 'http://34.93.164.215:3001/auth/v1/user/verify-mobile',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(requestBody),
            success: function (data) {
                if (data.success) {
                    console.log('OTP request successful:', data);

                    // Extract the last 4 digits of the mobile number
                    var lastFourDigits = mobileNumber.slice(-4);

                    // Display OTP input form with a message
                    $('#loginform').html(`
                        <h6>Enter OTP</h6>
                        <p>We have sent a verification code to your mobile number ending with xxxxxx${lastFourDigits}</p>
                        <div class="otp-container">
                            <input class="otp-input" type="text" maxlength="1" />
                            <input class="otp-input" type="text" maxlength="1" />
                            <input class="otp-input" type="text" maxlength="1" />
                            <input class="otp-input" type="text" maxlength="1" />
                            <input class="otp-input" type="text" maxlength="1" />
                            <input class="otp-input" type="text" maxlength="1" />
                        </div>
                        <div class="error-message-container" id="otpErrorMessage"></div>
                        <button id="submitOtpButton">SUBMIT OTP</button>
                    `);

                    // Add event listener for the OTP inputs
                    $('.otp-input').each(function (index, input) {
                        $(input).on('input', function () {
                            $(this).val($(this).val().replace(/[^0-9]/g, ''));  // Allow only numeric input
                            if ($(this).val().length === 1 && index < $('.otp-input').length - 1) {
                                $('.otp-input').eq(index + 1).focus();
                            }
                        });
                        $(input).on('keydown', function (e) {
                            if (e.key === "Backspace" && $(this).val().length === 0 && index > 0) {
                                $('.otp-input').eq(index - 1).focus();
                            }
                        });
                    });

                    // Add event listener for the new button
                    $('#submitOtpButton').on('click', function () {
                        // Collect the OTP value
                        let otp = '';
                        let allFilled = true;
                        $('.otp-input').each(function () {
                            otp += $(this).val();
                            if ($(this).val() === '') {
                                allFilled = false;
                            }
                        });

                        // Validate OTP length
                        if (allFilled && otp.length === 6) {
                            // Handle OTP submission here
                            const verificationRequestBody = {
                                mobileNumber: mobileNumber,
                                otp: otp,
                                lat: 22,
                                long: 22,
                                deviceModel: "Vivo"
                            };

                            $.ajax({
                                url: 'http://34.93.164.215:3001/auth/v1/otp/verify',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'key': mobileNumber
                                },
                                data: JSON.stringify(verificationRequestBody),
                                success: function (data) {
                                    if (data.success) {
                                        console.log('OTP verification successful:', data);
                                      console.log(data)
                                        // Store the accessToken in local storage
                                        localStorage.setItem('accessToken', data.data.accessToken);
                                        localStorage.setItem('mobileNumber', data.data.user.mobileNumber);
                                        // localStorage.setItem('username', data.data.username);

                                        // Check if profile is completed
                                        if (data.data.user.isProfileCompleted) {
                                            window.location.href = '../pages/home.html';
                                        } else {
                                            // Display the username and email input fields
                                            $('#loginform').html(`

                                                <h6>Complete Profile</h6>

                                                <div id = "profileinput">   
                                                    <input type="text" id="username" name="username" placeholder="Enter Name" required />
                                                </div>
                                                <div id = "profileinput"> 
                                                    <input type="email" id="email" name="email" placeholder="Enter Email" required/>
                                                </div>
                                                <button id="createAccountButton">Create Account</button>
                                            `);
             
                                            // Add event listener for the create account button
                                            $('#createAccountButton').on('click', function () {
                                                const username = $('#username').val();
                                                const email = $('#email').val();

                                                if (username && email) {
                                                    // Store the username and email in local storage
                                                    localStorage.setItem('username', username);
                                                    localStorage.setItem('email', email);

                                                    // Redirect to home.html
                                                    window.location.href = '../pages/home.html';
                                                } else {
                                                    alert('Please enter both username and email.');
                                                }
                                            });
                                        }
                                    } else {
                                        console.log('OTP verification failed:', data);
                                        $('#otpErrorMessage').html('OTP verification failed. Please try again.').addClass('error');
                                    }
                                },
                                error: function (error) {
                                    console.error('Error verifying OTP:', error);
                                    $('#otpErrorMessage').html('An error occurred. Please try again.').addClass('error');
                                }
                            });
                        } else {
                            // Show error message
                            $('#otpErrorMessage').html('Please enter the correct OTP.').addClass('error');
                        }
                    });
                } else {
                    console.log('OTP request failed:', data);
                    errorMessageContainer.text('Failed to request OTP. Please try again.');
                }
            },
            error: function (error) {
                console.error('Error requesting OTP:', error);
                errorMessageContainer.text('An error occurred. Please try again.');
            }
        });
    });

    // Additional input validation to allow only numeric input
    $('#mobileNumber').on('input', function (e) {
        const value = $(this).val().replace(/[^0-9]/g, '').slice(0, 10);
        $(this).val(value);

        // Validate first digit is greater than 5
        if (value.length > 0 && value[0] <= 5) {
            $('#errorMessage').text('Mobile Number is Invalid');
            $('#errorMessage').css("color", "red");
            $(this).css('border', '1px solid red');
        } else {
            $('#errorMessage').text('');
            $(this).css('border', '1px solid #ccc'); // Reset border color if first digit is valid
        }

        // Change border color to green if 10 digits are entered
        if (value.length === 10) {
            $(this).css('border', '1px solid green');
            $(".content").css("color","green");
        } else if (value[0] > 5) {
            $(this).css('border', '1px solid #ccc'); 
            $(".content").css("color","#ccc");
        }
    });
});
