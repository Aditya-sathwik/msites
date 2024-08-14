// payment.js

function showPaymentPage(totalprice, orderid, purpose) {
    console.log(totalprice)
    console.log(orderid)
    console.log(purpose)
    console.log(purpose);

    var newPageContent = `
      <div id="Payheader">
          <img src="../assets/leftArrowBold.svg" alt="">
          <p> Payment</p>
      </div>
      <div id="receipt">
          <div class="payamount">
              <div id="payimg">
                  <img src="../assets/bank.svg" alt="">
                  <p> Total Payable Amount </p>
              </div>
              <p id="totalpayamount">₹ ${totalprice}</p>
          </div>
          <div class="payoptions">
              <a href="#">
                  <div class="walletpay">
                      <div class="walletpayimg">
                          <img src="../assets/QRWallet.svg" id="walletimg" alt="">
                          <div class="walletinfo">
                              <p> Pay with Wallet </p>
                              <p> </p>
                          </div>
                      </div>
                      <button class="addbalance"> ADD MONEY </button>
                  </div>
              </a>
              <div id="creditCard">
                  <div class="creditcard">
                      <img src="../assets/credit_card.svg" alt="">
                      <p>Pay with Credit Card </p>
                  </div>
              </div>
              <div id = "debitCard">
                  <div class="debitcard">
                      <img src="../assets/debitCard.svg" alt="">
                      <p>Pay with Debit Card </p>
                  </div>
              </div>
              <div id="upipageNew1">
                  <div class="upipay">
                      <img src="../assets/payupi.svg" alt="">
                      <p>Pay with UPI </p>
                  </div>
              </div>
          </div>
      </div>
    `;
    
    // Add the new content to the body
    $('body').children().hide();
    $('body').append(newPageContent);
    
    // Add a new entry to the browser's history
    history.pushState({ page: 'paypage' }, 'Payment Page', '?paypage');
    
    // Listen for the popstate event to handle the back navigation
    window.onpopstate = function(event) {
        if (event.state && event.state.page === 'paypage') {
            // Remove the new content from the body
            $('body').children().show();
            $('body').find('#Payheader, #receipt').remove();
    
            // Remove the `paypage` query parameter from the URL
            const newUrl = window.location.pathname + window.location.search.replace('?paypage', '');
            history.replaceState({}, document.title, newUrl);
        }
    };
    
    const $paymentFailed = $(`
    <div id="payment-failed" class="status-message">
        <img src="../assets/payment_failed_alert.svg" alt="Failed" style="width: 80px; height: 80px;">
        <h2>Transaction Failed</h2>
        <p>Payment Failed</p>
        <div class = "fail">
        <p>₹  <span id="failed-amount-upi"></span> </p>
        <p id ="orderid">Order ID: <span id="failed-order-id-upi"> </span></p>
        <p id ="refid"> Reference ID: <span id="failed-ref-id-upi"></span></p>
        </div>
        <p> <span id="failed-datetime-upi"></span></p>
        <button id="go-home">GO TO HOME</button>
    </div>
       `).appendTo('body');

    // Call the function to update the redirection

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

   

    // Event handler for UPI payment link
    $(document).on('click', '#upipageNew1', function (event) {
        event.preventDefault();
        $('body').children().hide();

        // Append the new input form for VPA ID
        $('body').append(`
        <div id="receipt">
            <div class="payamount">
                <div id="payimg">
                    <img src="../assets/bank.svg" alt="">
                    <p> Total Payable Amount </p>
                </div>
                <p id="totalpayamount">₹ ${totalprice}</p>
            </div>
            <div class="vpanumber">
                <input type="text" id="vpaid" placeholder="Enter Your VPA ID">
                <div class="invalidvpa"></div>
                <button class="submitvpa">PAY NOW</button>
            </div>
        </div>
    `);
        $('#vpaid').attr('autocomplete', 'off');
        $('#vpaid').on('focus', function () {
            $('.invalidvpa').empty();
        });

        // Event handler for PAY NOW button inside VPA form
        $('.submitvpa').on('click', function (event,) {
            event.preventDefault();
            const $button = $(this);
            $button.prop('disabled', true);
            var vpaInput = $('#vpaid').val();
            console.log('VPA1:', vpaInput);
            var error = "";

            // Make the API call to verify the UPI
            $.ajax({
                url: 'http://35.200.153.72:3002/external/v2/pg/verify-upi',
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer 87ee6b96642d5a8055d1ba72306116128d8fdf2bc173e9a230ba2fdf67d37dd914bbc492833e5e667eb0de9acc49e30fc117741db91c00823cc859f84a2b6435593f2e56e16932585e1407617d5fb4d5013b8f950770fe5f727b2494b89b2a4733da8bfc35925a64454f413c38fd2b4a5a7fab4d667d2bdc9d52bd677ef23a388d7196148f81aa359b651e2b740e770566f1d4445caa0fd86ec1a332ae9cb3a004012c455bbf082fe1102f43603d874d4abc62b1d2861efc6d72e37ac4ea893406281d0f7bd2b7d1c9a3c439ddba44e6c7aa738dd2c8aa2fde5c36d11abe5f3fcbd2e0da0ae00fcebc29c19436640490',
                    'key': 'rahul'
                },
                data: {
                    vpa: vpaInput
                },
                success: function (response, status, xhr) {
                    $button.prop('disabled', false);
                    console.log("Network status", status, xhr.status);
                    if (response.status === 'OK' && response.valid === true) {
                        $('body').children().hide();

                        $('body').append(`
                    <div id="receipt">
                        <div class="payamount">
                            <div id="payimg">
                                <img src="../assets/bank.svg" alt="">
                                <p> Total Payable Amount </p>
                            </div>
                            <p id="totalpayamount">₹ ${totalprice}</p>
                        </div>
                        <div id="newPageupi">
                            <form id="vpaForm">
                                <div class="containerupi">
                                    <div id="timerContainer">
                                        <div class="circle1 outerCircle" id="outer"></div>
                                        <div class="circle1 innerCircle" id="inner"></div>
                                        <div id="time">05:00 <p> mins remaining </p></div>
                                    </div>
                                </div>
                                <div class="openapp">
                                    <p> Open your UPI app like </p>
                                    <div class="openappimg">
                                        <img src="../assets/Paytm-Logo.wine.png" alt="">
                                        <img src="../assets/PhonePe_Logo.svg.png" alt="">
                                        <img src="../assets/Google_Pay_Logo.png" alt="">
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    `);

                        let timer = 300; // 5 minutes in seconds
                        const display = $('#time');

                        setInterval(function () {
                            let minutes = Math.floor(timer / 60);
                            let seconds = timer % 60;

                            seconds = seconds < 10 ? '0' + seconds : seconds;
                            display.contents().filter(function () {
                                return this.nodeType == 3;
                            })[0].nodeValue = `${minutes}:${seconds} `;

                            if (timer > 0) {
                                timer--;
                            }
                        }, 1000);

                        const phoneNumber = localStorage.getItem('mobileNumber');
                        const orderid = localStorage.getItem('orderid');

                        console.log(phoneNumber);
                        console.log(orderid);

                        // Make the second API call with additional data
                        const data = {
                            "orderId": orderid,
                            "type": "UP",
                            "payerAddress": vpaInput,
                            "payerPhone": phoneNumber
                        };

                        $.ajax({
                            url: 'http://35.200.153.72:3002/external/v2/pg/pay',
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer 87ee6b96642d5a8055d1ba72306116128d8fdf2bc173e9a230ba2fdf67d37dd914bbc492833e5e667eb0de9acc49e30fc117741db91c00823cc859f84a2b6435593f2e56e16932585e1407617d5fb4d5013b8f950770fe5f727b2494b89b2a4733da8bfc35925a64454f413c38fd2b4a5a7fab4d667d2bdc9d52bd677ef23a388d7196148f81aa359b651e2b740e770566f1d4445caa0fd86ec1a332ae9cb3a004012c455bbf082fe1102f43603d874d4abc62b1d2861efc6d72e37ac4ea893406281d0f7bd2b7d1c9a3c439ddba44e6c7aa738dd2c8aa2fde5c36d11abe5f3fcbd2e0da0ae00fcebc29c19436640490',
                                'key': 'rahul'
                            },
                            data: data,
                            success: function (response, status, xhr) {
                                console.log('Second API Response:', response);
                                console.log("Network status", status, xhr.status);
                            },
                            error: function (xhr, status, error) {
                                console.log(data)
                                console.log("Network status", status, xhr.status);
                                console.error('Second API Error:', error);
                            }

                        });
                        const apiURL_status = 'http://35.200.153.72:3002/external/v2/pg/status';
                        const orderId_status = orderid;


                        function checkPaymentStatus() {
                            console.log(purpose)
                            $.ajax({
                                url: apiURL_status,
                                method: 'POST',
                                headers: {
                                    'Authorization': 'Bearer 87ee6b96642d5a8055d1ba72306116128d8fdf2bc173e9a230ba2fdf67d37dd914bbc492833e5e667eb0de9acc49e30fc117741db91c00823cc859f84a2b6435593f2e56e16932585e1407617d5fb4d5013b8f950770fe5f727b2494b89b2a4733da8bfc35925a64454f413c38fd2b4a5a7fab4d667d2bdc9d52bd677ef23a388d7196148f81aa359b651e2b740e770566f1d4445caa0fd86ec1a332ae9cb3a004012c455bbf082fe1102f43603d874d4abc62b1d2861efc6d72e37ac4ea893406281d0f7bd2b7d1c9a3c439ddba44e6c7aa738dd2c8aa2fde5c36d11abe5f3fcbd2e0da0ae00fcebc29c19436640490',
                                    'key': 'rahul'
                                },
                                data: ({ orderId: orderId_status }),
                                success: function (response_status) {
                                    console.log(response_status)
                                    console.log(response_status.STATUS)
                                    const status = response_status.STATUS || response_status.pgStatus;
                                    const currentDateTime = new Date().toLocaleString();

                                    if (status === 'Rejected') {
                                        console.log(purpose)
                                        // $paymentFailed.show();
                                        clearInterval(intervalId);
                                        $('#payment-failed').show();

                                       $('#newPageupi').hide();
                                        $('.payamount').hide();
                                        $paymentFailed.find('#failed-amount-upi').text(response_status.TOTAL_AMOUNT);
                                        $paymentFailed.find('#failed-order-id-upi').text(response_status.ORDER_ID);
                                        $paymentFailed.find('#failed-ref-id-upi').text(response_status.PG_REF_NUM);
                                        $paymentFailed.find('#failed-datetime-upi').text(currentDateTime);
                                        function updateGoHomeRedirection(newPurpose) {
                                            console.log(newPurpose)
                                            const goHomeButton = $("#go-home");
                                            if (newPurpose === "qr ticket") {
                                                goHomeButton.attr("onclick", "window.location.href='/qr-ticket-home'");
                                    
                                            } else if (newPurpose === "locker") {
                                                const hi = 'hello9'
                                                console.log("jsdksdw")
                                                $("#go-home").text('jhgkhj')
                                                goHomeButton.attr("onclick", "window.location.href='../pages/myLocker.html'");
                                            } else {
                                                goHomeButton.attr("onclick", "window.location.href='/'"); // Default redirection
                                            }
                                        }
                                        updateGoHomeRedirection(purpose);
                                    } else if (status === 'Captured') {
                                        // $paymentSuccess.show();
                                        clearInterval(intervalId);
                                        $('#newPageupi').hide();
                                        $('#payment-success').show();
                                        $('.payamount').hide();
                                        $paymentSuccess.find('#success-amount').text(response_status.TOTAL_AMOUNT);
                                        $paymentSuccess.find('#success-order-id').text(response_status.ORDER_ID);
                                        $paymentSuccess.find('#success-ref-id').text(response_status.PG_REF_NUM);
                                        $paymentSuccess.find('#success-datetime').text(currentDateTime);
                                        function updateGoHomeRedirection(newPurpose) {
                                            console.log(newPurpose)
                                            const goPAGEButton = $("#go_my_tickets");
                                            if (newPurpose === "qrticket") {
                                                goPAGEButton.attr("onclick", "window.location.href='/qr-ticket-home'");
                                    
                                            } else if (newPurpose === "locker") {
                                               
                                                $("#go_my_tickets").text('GO TO MY LOCKER')
                                                goPAGEButton.attr("onclick", "window.location.href='../pages/myLocker.html'");
                                            } else {
                                                goPAGEButton.attr("onclick", "window.location.href='/'"); // Default redirection
                                            }
                                        }
                                        updateGoHomeRedirection(purpose);
                                    }
                                },
                                error: function (error) {
                                    console.error('Error:', orderId_status);
                                    console.error('Error:', orderId_status);
                                    // $paymentFailed.show();
                                    $("#go-home").text('jhgkhj')
                                    $('#payment-failed').show();
                                    clearInterval(intervalId);
                                    $('#newPageupi').hide();
                                    $('.payamount').hide();
                                    $('.fail').hide();
                                    ('#failed-datetime-upi').text(currentDateTime);
                                }

                            });
                            // Create the status message divs and append to the body



                        }

                        const intervalId = setInterval(checkPaymentStatus, 5000);
                        setTimeout(() => clearInterval(intervalId), 300000); //  5 minutes

                        // $(document).on('click', '#go-home', function () {
                        //     window.location.href = '../pages/home.html';
                        // });
                        $("#go_my_tickets-home").click(function () {
                            window.location.href = "../pages/myTickets.html";
                        });




                    }

                },
                error: function (xhr, status, error) {
                    console.log("Network status", status, xhr.status);
                    $button.prop('disabled', false);
                    error = 'Please enter a valid VPA ID';
                    $('.invalidvpa').text(error);
                }
               
            });
            $('#vpaid').attr('autocomplete', 'off');
            $('#vpaid').on('focus', function () {
                $('.invalidvpa').empty();
            });
        });

    });
    createDebitCardInputForm();
    addValidation();

    $(document).on('click', '#debitCard', function (event) {
        showDebitCardInput();
    });
    createCreditCardInputForm()
    addValidationCredit()

    $(document).on('click', '#creditCard', function (event) {
        showCreditCardInput();
    });

   
}
