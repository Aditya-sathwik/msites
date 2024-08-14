var cardNumber
var orderId

var currentDateTime = new Date().toLocaleString();
var $paymentFailedDebit = $(`
    <div id="payment-failed" class="status-message">
        <img src="../assets/payment_failed_alert.svg" alt="Failed" style="width: 80px; height: 80px;">
        <h2>Transaction Failed</h2>
        <p>Payment Failed</p>
        <p>₹  <span id="failed-amount"></span> </p>
        <p id ="orderid">Order ID: <span id="failed-order-id"> </span></p>
        <p id ="refid"> Reference ID: <span id="failed-ref-id"></span></p>
        <p> <span id="failed-datetime"></span></p>
        <button id="go-home">GO TO HOME</button>
    </div>
`).appendTo('body');
$(document).on('click', '#go-home', function () {
    window.location.href = 'home.html';
});


const $paymentSuccess = $(`
    <div id="payment-success" class="status-message">
        <img src="../assets/sucessTick.svg" alt="" style="width: 80px; height: 80px;">
        <h2>Congratulation!</h2>
        <p>Payment Successful</p>
         <p>₹  <span id="success-amount"></span>

        <p id ="orderid">Order ID: <span id="success-order-id"> </span></p>
        <p id ="refid"> Reference ID: <span id="success-ref-id"></span></p>
        <p> <span id="success-datetime"></span></p>
        <button id="go_my_tickets">GO TO MY TICKETS</button>
    </div>
`).appendTo('body');
$("#go_my_tickets").click(function () {
    window.location.href = "myTickets.html";
});

// the debit card input form
function createDebitCardInputForm() {
    const formHtml = `
        <div id="card-input-form" class="hidden">
            <div class="close-icon" id="close-card-input">✖</div>
            <div class="cardNumber">
                <input type="text" id="debit-card-number" placeholder="Enter Debit Card Number" maxlength="19">
                <div id="card-number-error" class="error-message"></div>
            </div>
            <div class="cardDetails">
                <div id="cardDetailsError">
                    <input type="text" id="debit-card-EXPIRY" placeholder="MM/YY" maxlength="5">
                    <div id="expiry-error" class="error-message"></div>
                </div>
                <div id="cardDetailsError">
                    <input type="text" id="debit-card-CCV" placeholder="CCV" maxlength="3">
                    <div id="ccv-error" class="error-message"></div>
                </div>
            </div>
            <div class="cardHOLDER">
                <input type="text" id="debit-card-HOLDER" placeholder="Cardholder Name" maxlength="70">
                <div id="cardholder-error" class="error-message"></div>
            </div>
            <button id="submit-card">PROCEED TO PAY</button>
        </div>
    `;

    $('body').append(formHtml);
}

//  show the debit card input form
function showDebitCardInput() {
    $('body > *').not('#card-input-form, #debitCard').addClass('hidden');
    $('#card-input-form').removeClass('hidden').addClass('show');
}

//  validation to the debit card input form
function addValidation() {
    function setError(inputId, errorId, message) {
        $(`#${inputId}`).css('border-color', 'red');
        $(`#${errorId}`).text(message).css('color', 'red');
    }

    function clearError(inputId, errorId) {
        $(`#${inputId}`).css('border-color', '');
        $(`#${errorId}`).text('');
    }

    $('#debit-card-number').on('input', function () {
        let input = $(this).val().replace(/\D/g, '');
        if (input.length > 16) {
            input = input.substring(0, 16);
        }
        const formattedInput = input.replace(/(\d{4})(?=\d)/g, '$1 ');
        $(this).val(formattedInput);
        clearError('debit-card-number', 'card-number-error');

        if (input.length >= 9) {
            fetchCardInfo(input);
        }

        if (input.length === 16) {
            $('#debit-card-EXPIRY').focus();
        }
    });

    $('#debit-card-EXPIRY').on('input', function () {
        let input = $(this).val().replace(/\D/g, '');
        if (input.length > 4) {
            input = input.substring(0, 4);
        }
        if (input.length >= 2) {
            input = input.substring(0, 2) + '/' + input.substring(2);
        }
        $(this).val(input);
        clearError('debit-card-EXPIRY', 'expiry-error');

        // Validate MM/YY format and ensure it's a valid future date
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(input)) {
            setError('debit-card-EXPIRY', 'expiry-error', 'Invalid expiry date.');
            return;
        }

        // Validate against current month/year
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear() % 100; // Current year's last two digits
        const enteredMonth = parseInt(input.substring(0, 2), 10);
        const enteredYear = parseInt(input.substring(3, 5), 10);

        if (enteredYear < currentYear || (enteredYear === currentYear && enteredMonth < currentMonth)) {
            setError('debit-card-EXPIRY', 'expiry-error', 'Expiry date must be in the future.');
            return;
        }

        if (/^(0[1-9]|1[0-2])\/\d{2}$/.test(input)) {
            $('#debit-card-CCV').focus();
        }
    });

    $('#debit-card-CCV').on('input', function () {
        let input = $(this).val().replace(/\D/g, '');
        if (input.length > 3) {
            input = input.substring(0, 3);
        }
        $(this).val(input);
        clearError('debit-card-CCV', 'ccv-error');

        if (input.length === 3) {
            $('#debit-card-HOLDER').focus();
        }
    });

    $('#debit-card-HOLDER').on('input', function () {
        let input = $(this).val().replace(/[^a-zA-Z\s]/g, '');
        if (input.length > 70) {
            input = input.substring(0, 70);
        }
        $(this).val(input);
        clearError('debit-card-HOLDER', 'cardholder-error');

        // Validate if cardholder name is empty
        if (input.trim().length === 0) {
            setError('debit-card-HOLDER', 'cardholder-error', 'Cardholder name is required.');
        }
    });

    // Add green border on focus
    $('#card-input-form input').on('focus input', function () {
        $(this).css('border', '2px solid green');
    }).on('blur', function () {
        $(this).css('border', '');

    });

    $('#submit-card').on('click', function (event) {



        event.preventDefault();
        let valid = true;
        let cardNumber = $('#debit-card-number').val().replace(/\s/g, ''); // Remove spaces
        const expiry = $('#debit-card-EXPIRY').val();
        const ccv = $('#debit-card-CCV').val();
        const cardHolder = $('#debit-card-HOLDER').val();

        // Basic validation
        if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
            setError('debit-card-number', 'card-number-error', 'Invalid card number.');
            valid = false;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            setError('debit-card-EXPIRY', 'expiry-error', 'Invalid expiry date.');
            valid = false;
        }

        if (ccv.length !== 3 || !/^\d+$/.test(ccv)) {
            setError('debit-card-CCV', 'ccv-error', 'Invalid CCV.');
            valid = false;
        }

        if (cardHolder.trim().length === 0) {
            setError('debit-card-HOLDER', 'cardholder-error', 'Cardholder name is required.');
            valid = false;
        }

        if (valid) {
            const [expMonth, expyear] = expiry.split('/');
            const apiBody = {
                orderId: localStorage.getItem('orderid'),
                type: "DC",
                cardNumber: cardNumber,
                cvv: ccv,
                expMonth: expMonth,
                expYear: "20" + expyear
            };

            const url = "http://35.200.153.72:3002/external/v2/pg/pay";
            const headers = {
               'Authorization': 'Bearer 87ee6b96642d5a8055d1ba72306116128d8fdf2bc173e9a230ba2fdf67d37dd914bbc492833e5e667eb0de9acc49e30fc117741db91c00823cc859f84a2b6435593f2e56e16932585e1407617d5fb4d5013b8f950770fe5f727b2494b89b2a4733da8bfc35925a64454f413c38fd2b4a5a7fab4d667d2bdc9d52bd677ef23a388d7196148f81aa359b651e2b740e770566f1d4445caa0fd86ec1a332ae9cb3a004012c455bbf082fe1102f43603d874d4abc62b1d2861efc6d72e37ac4ea893406281d0f7bd2b7d1c9a3c439ddba44e6c7aa738dd2c8aa2fde5c36d11abe5f3fcbd2e0da0ae00fcebc29c19436640490',
                'key': 'rahul'
            };

            $.ajax({
                url: url,
                type: 'POST',
                headers: headers,
                contentType: 'application/json',
                data: JSON.stringify(apiBody),
                success: function (response, textStatus, xhr) {
                    if (xhr.status === 200 && response.statusCode === 200) {
                        window.open(response.RequestUrl, );

                        // Start polling for status
                        let pollInterval = setInterval(function () {
                            $.ajax({
                                url: "http://35.200.153.72:3002/external/v2/pg/status",
                                type: 'POST',
                                headers: headers,
                                contentType: 'application/json',
                                data: JSON.stringify({ orderId: apiBody.orderId }),
                                success: function (statusResponse) {
                                    console.log(statusResponse.STATUS)
                                    if (statusResponse.STATUS === 'Captured') {
                                        clearInterval(pollInterval);
                                        $('#card-input-form-credit').hide();
                                        $('#card-input-form').hide();
                                        $('#Payheader').hide();
                                        $paymentSuccess.show();
                                        $paymentSuccess.find('#failed-amount').text(statusResponse.TOTAL_AMOUNT);
                                        $paymentSuccess.find('#failed-order-id').text(statusResponse.ORDER_ID);
                                        $paymentSuccess.find('#failed-ref-id').text(statusResponse.PG_REF_NUM);
                                        $paymentSuccess.find('#failed-datetime').text(currentDateTime);

                                    }
                                    else if (statusResponse.STATUS === "Sent to Bank") {
                                        // Do nothing and continue
                                    }
                                    else {
                                        clearInterval(pollInterval);
                                        console.log(statusResponse);
                                        $('#card-input-form').hide();
                                        $('#card-input-form-credit').hide();
                                        $('#Payheader').hide();
                                        $paymentFailedDebit.show();
                                        $paymentFailedDebit.find('#failed-amount').text(statusResponse.TOTAL_AMOUNT);
                                        $paymentFailedDebit.find('#failed-order-id').text(statusResponse.ORDER_ID);
                                        $paymentFailedDebit.find('#failed-ref-id').text(statusResponse.PG_REF_NUM);
                                        $paymentFailedDebit.find('#failed-datetime').text(currentDateTime);

                                    }
                                },
                                error: function (xhr, status, error) {
                                    console.error('Status API Error:', error);
                                }

                            });
                        }, 5000); // 5000 ms = 5 seconds

                        // Stop polling after 5 minutes
                        setTimeout(function () {
                            clearInterval(pollInterval);
                        }, 300000); // 300000 ms = 5 minutes

                    } else {
                        console.error('Unexpected response status:', xhr.status);
                        setError('debit-card-number', 'card-number-error', 'Invalid Card Number.');
                        setError('debit-card-CCV', 'ccv-error', 'Invalid CCV.');
                        valid = false;
                    }

                },
                error: function (xhr, status, error) {
                    console.error('API Error:', error);
                    setError('debit-card-number', 'card-number-error', 'Invalid Card Number.');
                }
            });
        }
    });

    function setError(inputId, errorId, message) {
        $(`#${inputId}`).addClass('error');
        $(`#${errorId}`).text(message);
    }



    $('#close-card-input').on('click', function () {
        $('#card-input-form').addClass('hidden');
        $('#card-input-form').hide();
        $('#card-input-form-credit').hide();
        $('body > *').removeClass('hidden');
    });
    $('#debitCard').on('click', function () {
        $('#card-input-form').removeClass('hidden');
        $('#card-input-form').show();
        orderId = localStorage.getItem('orderid');
        console.log(orderId)
    });

    function fetchCardInfo(cardNumber) {
        const url = "http://35.200.153.72:3002/external/v2/pg/card-info";
        const headers = {
           'Authorization': 'Bearer 87ee6b96642d5a8055d1ba72306116128d8fdf2bc173e9a230ba2fdf67d37dd914bbc492833e5e667eb0de9acc49e30fc117741db91c00823cc859f84a2b6435593f2e56e16932585e1407617d5fb4d5013b8f950770fe5f727b2494b89b2a4733da8bfc35925a64454f413c38fd2b4a5a7fab4d667d2bdc9d52bd677ef23a388d7196148f81aa359b651e2b740e770566f1d4445caa0fd86ec1a332ae9cb3a004012c455bbf082fe1102f43603d874d4abc62b1d2861efc6d72e37ac4ea893406281d0f7bd2b7d1c9a3c439ddba44e6c7aa738dd2c8aa2fde5c36d11abe5f3fcbd2e0da0ae00fcebc29c19436640490',
           'key': 'rahul'
        };
        const cardData = {
            cardNumber: cardNumber
        };

        $.ajax({
            url: url,
            type: 'POST',
            headers: headers,
            contentType: 'application/json',
            data: JSON.stringify(cardData),
            success: function (response, textStatus, xhr) {
                if (xhr.status === 200) {
                    console.log(response);

                } else {
                    console.log(hello)
                    console.error('Unexpected response status:', xhr.status);
                    setError('debit-card-number', 'card-number-error', 'Invalid card number.');

                }
            },
            error: function (xhr, status, error) {
                console.error('API Error:', error);
                setError('debit-card-number', 'card-number-error', 'Invalid card.');
            }

        });

    }
}






//the credit card input form
function createCreditCardInputForm() {
    const formHtml = `
        <div id="card-input-form-credit" class="hidden">
            <div class="close-icon-credit" id="close-card-input-credit">✖</div>
            <div class="cardNumber">
                <input type="text" id="credit-card-number" placeholder="Enter Credit Card Number" maxlength="19">
                <div id="card-number-error-credit" class="error-message"></div>
            </div>
            <div class="cardDetails">
                <div id="cardDetailsError">
                    <input type="text" id="credit-card-EXPIRY" placeholder="MM/YY" maxlength="5">
                    <div id="expiry-error-credit" class="error-message"></div>
                </div>
                <div id="cardDetailsError">
                    <input type="text" id="credit-card-CCV" placeholder="CCV" maxlength="3">
                    <div id="ccv-error-credit" class="error-message"></div>
                </div>
            </div>
            <div class="cardHOLDER">
                <input type="text" id="credit-card-HOLDER" placeholder="Cardholder Name" maxlength="70">
                <div id="cardholder-error-credit" class="error-message"></div>
            </div>
            <button id="submit-card-credit">PROCEED TO PAY</button>
        </div>
    `;

    $('body').append(formHtml);
}

// show the credit card input form
function showCreditCardInput() {
    $('body > *').not('#card-input-form-credit, #creditCard').addClass('hidden');
    $('#card-input-form-credit').removeClass('hidden').addClass('show');
}
function setError1(inputId, errorId, message) {
    $(`#${inputId}`).css('border-color', 'red');
    $(`#${errorId}`).text(message).css('color', 'red');
}
function clearError1(inputId, errorId) {
    $(`#${inputId}`).css('border-color', 'green');
    $(`#${errorId}`).text('');
}
// validation to the credit card input form
function addValidationCredit() {
    $('#credit-card-number').on('input', function () {
        let input = $(this).val().replace(/\D/g, '');
        if (input.length > 16) {
            input = input.substring(0, 16);
        }
        const formattedInput = input.replace(/(\d{4})(?=\d)/g, '$1 ');
        $(this).val(formattedInput);

        if (input.length >= 9) {
            fetchCardInfo(input);
        }

        if (input.length === 16) {
            $('#credit-card-EXPIRY').focus();
            clearError1('credit-card-number', 'card-number-error-credit');
        } else {
            setError1('credit-card-number', 'card-number-error-credit', 'Invalid card number.');
        }
    });

    $('#credit-card-EXPIRY').on('input', function () {
        let input = $(this).val().replace(/\D/g, '');
        if (input.length > 4) {
            input = input.substring(0, 4);
        }
        if (input.length >= 2) {
            input = input.substring(0, 2) + '/' + input.substring(2);
        }
        $(this).val(input);

        if (/^(0[1-9]|1[0-2])\/\d{2}$/.test(input)) {
            const today = new Date();
            const currentMonth1 = today.getMonth() + 1; // January is 0
            const currentYear1 = today.getFullYear() % 100; // Current year's last two digits
            const enteredMonth1 = parseInt(input.substring(0, 2), 10);
            const enteredYear1 = parseInt(input.substring(3, 5), 10);

            if (enteredYear1 < currentYear1 || (enteredYear1 === currentYear1 && enteredMonth1 < currentMonth1)) {
                setError1('credit-card-EXPIRY', 'expiry-error-credit', 'Expiry date must be in the future.');
            } else {
                clearError1('credit-card-EXPIRY', 'expiry-error-credit');
                $('#credit-card-CCV').focus();
            }
        } else {
            setError1('credit-card-EXPIRY', 'expiry-error-credit', 'Invalid expiry date.');
        }
    });

    $('#credit-card-CCV').on('input', function () {
        let input = $(this).val().replace(/\D/g, '');
        if (input.length > 3) {
            input = input.substring(0, 3);
        }
        $(this).val(input);

        if (input.length === 3) {
            clearError1('credit-card-CCV', 'ccv-error-credit');
            $('#credit-card-HOLDER').focus();
        } else {
            setError1('credit-card-CCV', 'ccv-error-credit', 'Invalid CCV.');
        }
    });

    $('#credit-card-HOLDER').on('input', function () {
        let input = $(this).val().replace(/[^a-zA-Z\s]/g, '');
        if (input.length > 70) {
            input = input.substring(0, 70);
        }
        $(this).val(input);

        if (input.trim().length > 0) {
            clearError1('credit-card-HOLDER', 'cardholder-error-credit');
        } else {
            setError1('credit-card-HOLDER', 'cardholder-error-credit', 'Cardholder name is required.');
        }
    });

    // Add green border on focus
    $('#card-input-form-credit input').on('focus', function () {
        $(this).css('border', '2px solid green');
    }).on('blur', function () {
        if ($(this).val().trim().length === 0 || $(this).siblings('.error-message').text().length > 0) {
            $(this).css('border', '2px solid red');
        } else {
            $(this).css('border', '2px solid green');
        }
    });

    $('#submit-card-credit').on('click', function (event) {

        event.preventDefault();
        let valid = true;
        let cardNumber = $('#credit-card-number').val().replace(/\s/g, ''); // Remove spaces
        const expiryCredit = $('#credit-card-EXPIRY').val();
        const ccv = $('#credit-card-CCV').val();
        const cardHolder = $('#credit-card-HOLDER').val();
        console.log(cardNumber)
        // Basic validation
        if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
            setError1('credit-card-number', 'card-number-error-credit', 'Invalid card number.');
            valid = false;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryCredit)) {
            setError1('credit-card-EXPIRY', 'expiry-error-credit', 'Invalid expiry date.');
            valid = false;
        }

        if (ccv.length !== 3 || !/^\d+$/.test(ccv)) {
            setError1('credit-card-CCV', 'ccv-error-credit', 'Invalid CCV.');
            valid = false;
        }

        if (cardHolder.trim().length === 0) {
            setError1('credit-card-HOLDER', 'cardholder-error-credit', 'Cardholder name is required.');
            valid = false;
        }

        if (valid) {
            const [expMonth, expYear] = expiryCredit.split('/');
            const apiBody = {
                orderId: localStorage.getItem('orderid'),
                type: "CC",
                cardNumber: cardNumber,
                cvv: ccv,
                expMonth: expMonth,
                expYear: "20" + expYear
            };

            const url = "http://35.200.153.72:3002/external/v2/pg/pay";
            const headers = {
               'Authorization': 'Bearer 87ee6b96642d5a8055d1ba72306116128d8fdf2bc173e9a230ba2fdf67d37dd914bbc492833e5e667eb0de9acc49e30fc117741db91c00823cc859f84a2b6435593f2e56e16932585e1407617d5fb4d5013b8f950770fe5f727b2494b89b2a4733da8bfc35925a64454f413c38fd2b4a5a7fab4d667d2bdc9d52bd677ef23a388d7196148f81aa359b651e2b740e770566f1d4445caa0fd86ec1a332ae9cb3a004012c455bbf082fe1102f43603d874d4abc62b1d2861efc6d72e37ac4ea893406281d0f7bd2b7d1c9a3c439ddba44e6c7aa738dd2c8aa2fde5c36d11abe5f3fcbd2e0da0ae00fcebc29c19436640490',
               'key': 'rahul'
            };

            $.ajax({
                url: url,
                type: 'POST',
                headers: headers,
                contentType: 'application/json',
                data: JSON.stringify(apiBody),
                success: function (response, textStatus, xhr) {
                    console.log(response)
                    if (xhr.status === 200 && response.statusCode === 200) {
                        window.open(response.RequestUrl, '_blank');
                        // Start polling for status
                        let pollInterval = setInterval(function () {
                            $.ajax({
                                url: "http://35.200.153.72:3002/external/v2/pg/status",
                                type: 'POST',
                                headers: headers35,
                                contentType: 'application/json',
                                data: JSON.stringify({ orderId: apiBody.orderId }),
                                success: function (statusResponse) {
                                    console.log(statusResponse.STATUS)
                                    if (statusResponse.STATUS === 'Captured') {
                                        clearInterval(pollInterval);
                                        $('#card-input-form-credit').hide();
                                        $('#Payheader').hide();
                                        $paymentSuccess.show();
                                        $paymentSuccess.find('#failed-amount').text(statusResponse.TOTAL_AMOUNT);
                                        $paymentSuccess.find('#failed-order-id').text(statusResponse.ORDER_ID);
                                        $paymentSuccess.find('#failed-ref-id').text(statusResponse.PG_REF_NUM);
                                        $paymentSuccess.find('#failed-datetime').text(currentDateTime);

                                    }
                                    else if (statusResponse.STATUS === "Sent to Bank") {
                                        // Do nothing and continue
                                    }
                                    else {
                                        $('#Payheader').hide();
                                        clearInterval(pollInterval);
                                        console.log(statusResponse);
                                        $('#card-input-form-credit').hide();
                                        $paymentFailedDebit.show();
                                        $paymentFailedDebit.find('#failed-amount').text(statusResponse.TOTAL_AMOUNT);
                                        $paymentFailedDebit.find('#failed-order-id').text(statusResponse.ORDER_ID);
                                        $paymentFailedDebit.find('#failed-ref-id').text(statusResponse.PG_REF_NUM);
                                        $paymentFailedDebit.find('#failed-datetime').text(currentDateTime);

                                    }
                                },
                                error: function (xhr, status, error) {
                                    console.error('Status API Error:', error);
                                }

                            });
                        }, 5000); // 5000 ms = 5 seconds

                        // Stop polling after 5 minutes
                        setTimeout(function () {
                            clearInterval(pollInterval);
                        }, 300000); // 300000 ms = 5 minutes

                    } else {
                        console.error('Unexpected response status:', xhr.status);
                        setError('debit-card-number', 'card-number-error', 'Invalid Card Number.');
                        setError('debit-card-CCV', 'ccv-error', 'Invalid CCV.');
                        valid = false;
                    }

                },
                error: function (xhr) {
                    alert("An error occurred while initiating payment.");
                }
            });
        }
    });

    $('#close-card-input-credit').on('click', function () {
        $('#card-input-form-credit').addClass('hidden');
        $('#card-input-form-credit').hide();
        $('#card-input-form').hide();
        $('body > *').removeClass('hidden');
    });

    $('#creditCard').on('click', function () {
        $('#card-input-form-credit').removeClass('hidden');
        $('#card-input-form-credit').show();
        orderId = localStorage.getItem('orderid');
        console.log(orderId)
    });

}

// Function to fetch credit card info
function fetchCardInfo(cardNumber) {
    const urlcredit = "http://35.200.153.72:3002/external/v2/pg/card-info";
    // const headerscredit = {
    //     'Authorization': 'Bearer 87ee6b96642d5a8055d1ba72306116128d8fdf2bc173e9a230ba2fdf67d37dd914bbc492833e5e667eb0de9acc49e30fc117741db91c00823cc859f84a2b6435593f2e56e16932585e1407617d5fb4d5013b8f950770fe5f727b2494b89b2a4733da8bfc35925a64454f413c38fd2b4a5a7fab4d667d2bdc9d52bd677ef23a388d7196148f81aa359b651e2b740e770566f1d4445caa0fd86ec1a332ae9cb3a004012c455bbf082fe1102f43603d874d4abc62b1d2861efc6d72e37ac4ea893406281d0f7bd2b7d1c9a3c439ddba44e6c7aa738dd2c8aa2fde5c36d11abe5f3fcbd2e0da0ae00fcebc29c19436640490',
    //     'key': 'rahul'
    // };
    const creditData = {
        cardNumber: cardNumber
    };

    $.ajax({
        url: urlcredit,
        type: 'POST',
        headers: headers35,
        contentType: 'application/json',
        data: JSON.stringify(creditData),
        success: function (response, textStatus, xhr) {
            if (xhr.status === 200) {
                console.log(response);

            } else {
                console.log(hello)
                console.error('Unexpected response status:', xhr.status);
                setError1('credit-card-number', 'card-number-error-credit', 'Invalid card number.');

            }
        },
        error: function (xhr, status, error) {
            console.error('API Error:', error);
            setError1('credit-card-number', 'card-number-error-credit', 'Invalid card number.');

        }

    });

}



