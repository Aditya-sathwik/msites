
$(document).ready(function () {
    //variables
    var stations = [];
    var fareOptions = [];
    var IsAirportline = ''
    var price = '0'
    var travelingtime = ''
    var fromname = ''
    var accessToken = localStorage.getItem('accessToken');
    var phoneNumber = localStorage.getItem('mobileNumber');
    console.log(phoneNumber)
    let val = ''
    var totalbill = ''
    let ticket0
    var ticket1
    var orderid;
    // signin check
    if (!accessToken) {

        window.location.href = 'index.html';
    }
    console.log(accessToken)

    //  API calling for station selection
    function fetchStations() {
        $.ajax({
            url: 'http://34.93.164.215:3000/metro/v1/stations?page=1&limit=300',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer 87ee6b96642d5a8055d1ba72306116128d8fdf2bc173e9a230ba2fdf67d37dd914bbc492833e5e667eb0de9acc49e30f7aa4eab6b279eef6971064b833af618a35562d5362fe5289c03f08590c9c03799a2ab82753037c132883a7d71c0236e278a1455f6feaacaca1d5ad51777758777463e5498ca09042ee43c9cadf086460f88463801cef52000099043a13ea34207333d07e7f5fec6b63458f0e0f2ae0aac5f11ad2943899c3596a7baff4098789a7f4b5a40dd4008e171d3c65ceec27672face8e70606ffc8233c1400c09d5367423058c9fb106c6ba5ecb5dd6b93631223fb336b0948b003998f3b8efb5f851a',
                'key': 'rahul'
            },
            success: function (data) {
                console.log(data);
                stations = data.results
                    .map(results => ({
                        name: results.name,
                        lineCodeName: results.lineCode.length > 0 ? results.lineCode[0].name : "",
                        lineCodeBackColor: results.lineCode.length > 0 ? results.lineCode[0].backcolor : "",
                        lineCodeBackColor1: results.lineCode.length > 1 ? results.lineCode[1].backcolor : "",
                        lineCodeColor: results.lineCode.length > 0 ? results.lineCode[0].color : "",
                        lineCodeColor1: results.lineCode.length > 1 ? results.lineCode[1].color : "",
                        stationCode: results.code
                    }))
                populateDropdowns();
                // setupAutocomplete();
            },
            error: function (error) {
                console.error('Error fetching station data:', error);
            }
        });
    }

    // Fetch fare API call
    function fetchFareOptions(fromStationCode, toStationCode) {
        console.log("fromStationCode " + fromStationCode);
        console.log("toStationCode " + toStationCode);
        var apiUrl = `http://35.200.153.72:3002/external/v1/ticket/options/${fromStationCode}/${toStationCode}/least-distance`;
        $.ajax({
            url: apiUrl,
            crossDomain: true,
            method: 'GET',
            headers: {
              'Authorization': 'Bearer 87ee6b96642d5a8055d1ba72306116128d8fdf2bc173e9a230ba2fdf67d37dd914bbc492833e5e667eb0de9acc49e30fc117741db91c00823cc859f84a2b6435593f2e56e16932585e1407617d5fb4d5013b8f950770fe5f727b2494b89b2a4733da8bfc35925a64454f413c38fd2b4a5a7fab4d667d2bdc9d52bd677ef23a388d7196148f81aa359b651e2b740e770566f1d4445caa0fd86ec1a332ae9cb3a004012c455bbf082fe1102f43603d874d4abc62b1d2861efc6d72e37ac4ea893406281d0f7bd2b7d1c9a3c439ddba44e6c7aa738dd2c8aa2fde5c36d11abe5f3fcbd2e0da0ae00fcebc29c19436640490',
                'key': 'rahul'
            },
            success: function (data) {
                console.log(data)
                const fareoption = data.routes
                ticket0 = (data?.routes[0]?.tickets)
                if (data?.routes[1]) {
                    ticket1 = data?.routes[1]?.tickets

                }
                else {
                    ticket1 = ticket0
                }

                const interchanges = data.routes[0].tickets[0].interchanges
                const interchanges1 = data?.routes[0]?.tickets[1]?.interchanges
                const interchanges2 = data?.routes[1]?.tickets[0]?.interchanges
                var dummy = [...interchanges]
                if (interchanges1?.length) {
                    dummy.push(...interchanges1)
                }
                // console.log(dummy)

                // console.log(interchanges)
                //mapping of API data for fare 

                const interchangeDetails = dummy?.map((interchange, index) => {
                    let changeLineMessage = '';
                    if (index > 0) {
                        const prevInterchange = interchanges[index - 1];
                        if (prevInterchange?.line_no !== interchange?.line_no) {
                            changeLineMessage = `Interchanged to ${interchange?.line}`;
                        } else {
                            changeLineMessage = `Interchanged to ${interchange?.line} branch`;
                        }
                    }
                    return `
                  

                        <div class="interchange">
                        ${changeLineMessage ? `<div class="change-line" style="background-color:${interchange?.line_color} ; border: 2px solid ">
                            <img src="../assets/interchnages.svg" alt="" id="interchangeimg"> ${changeLineMessage}</div>` : ''}
                          <div class = "circle-container">   <div class="station"> <div class="circle" style="border:2px solid  ${interchange?.line_color};"></div>${interchange?.start} </div> </div>
                           
                            <div class=""> <div class="vertical-dotted-line" style="border-left:1px dashed ${interchange?.line_color} ;"></div></div>


                            <div class = "interchangend">
                         <div class = "circle-container" >     <div class="station"> <div class="circle" style=" background-color:${interchange?.line_color};"></div> ${interchange?.end}</div> </div>
                           
                            <div class="line" style="color:${interchange?.line_color};">  </div> <div style="background-color:${interchange?.line_color}; padding:3px;  font-weight: 800;  border: 1px solid ${interchange?.line_color}; border-radius: 3px"> ${interchange?.line}</div> 
                        </div> 
                    `;
                }).join('');


                const interchangeDetails2 = interchanges2?.map((interchange, index) => {
                    let changeLineMessage = '';
                    if (index > 0) {
                        const prevInterchange = interchanges[index - 1];
                        if (prevInterchange?.line !== interchange?.line) {
                            changeLineMessage = `Interchanged to ${interchange?.line}`;
                        } else {
                            changeLineMessage = `Interchanged to ${interchange?.line} branch`;
                        }
                    }
                    return `
                        <div class="interchange">
                            ${changeLineMessage ? `<div class="change-line" style="background-color:${interchange?.line_color} ;  ">
                                <img src="../assets/interchnages.svg" alt="" id="interchangeimg">   ${changeLineMessage}</div>` : ''}
                          <div class = "circle-container">   <div class="station"> <div class="circle" style="border:2px solid  ${interchange?.line_color};"></div>${interchange?.start} </div> </div>
                            <div class=""> <div class="vertical-dotted-line" style="border-left:1px dashed ${interchange?.line_color} ;"></div></div>

                            <div class = "interchangend">
                         <div class = "circle-container">     
                         <div class="station"> <div class="circle" style=" background-color:${interchange?.line_color};">
                         </div>${interchange?.end}</div> </div>
                           
                            <div class="line" style="color:${interchange?.line_color};">  </div> 
                            <div style="background-color:${interchange?.line_color}; padding:3px;  font-weight: 800;  border: 1px solid ${interchange?.line_color}; border-radius: 3px"> ${interchange?.line}</div> 
                        </div>
                    `;
                }).join('');
                // console.log(interchangeDetails2)


                var al = interchangeDetails


                val = fareoption.map((route, index) => {
                    let { airport_line_included, total_time, total_fare, } = route;

                    var checked = ''
                    var str
                    var show
                    if (airport_line_included) {
                        str = 'Including Airport Line'
                        show = al
                    }
                    else if (interchangeDetails2) {
                        str = 'Excluding Airport Line'
                        show = interchangeDetails2
                    }
                    else {
                        str = 'Excluding Airport Line'
                        show = al

                    }
                    if (index === 0) {
                        checked = 'checked'
                    }
                    return `
                    <div class="mainfare">
                    <div class="farecontainer">
                    <div class = "farec" >
                    <div id = "tgfare">
                    <div class = "left_div">
                        <input id = "radioselect" type="radio" name="line" ${checked} value=${total_fare} lineData=${str} >
                        <label id="IsAirportline">${str} (${total_time})</label>
                        <label id="price">₹${total_fare}</label>
                        </div>
                        <button class="toggle-btn${index}">&#8964;</button> 
                        </div>
                        <div class="hidden-content${index}"> 
                        
                       <hr style="height: 0.1px; margin-bottom:20px; ">
                         <div >
                      <!---<div class = "price"> ₹${total_fare}</div>----> </div>
                         ${show}
                         </div>
                         </div>
                           </div>  
                        </div>
                        </div>
                `;
                }).join('')
                // console.log(val)

                $('#fareOptionsContainer').html(val);

                // Toggle hidden content
                $('[class^=toggle-btn]').on('click', function () {
                    const index = $(this).attr('class').match(/\d+/)[0];
                    $(`.hidden-content${index}`).toggle();
                });

                // Check radio button based on checkbox status
                $('#include-airport').on('change', function () {
                    const isChecked = $(this).is(':checked');
                    fareoption.forEach((route, index) => {
                        if (route.airport_line_included === isChecked) {
                            $(`#radioselect${index}`).prop('checked', true);

                        } else {
                            $(`#radioselect${index}`).prop('checked', false);
                        }
                    });
                });

                // console.log(data.routes[0].airport_line_included)
                if (data.routes[0].airport_line_included) {
                    IsAirportline = "Including Airport Line"
                }
                else {
                    IsAirportline = "Excluding Airport Line"
                }

                price = (data.routes[0].total_fare)
                travelingtime = (data.routes[0].total_time)

                // $('#price').val(data.routes.total_fare)
                // console.log(apiUrl);
                // console.log(data);
                fareOptions = data;
                showFareOptions();
            },
            error: function (error) {
                console.error('Error fetching fare options:', error);
            }
        });
    }

    // Populate dropdowns for from and to stations
    function populateDropdowns() {
        var fromSelect = $('#from-station');
        var toSelect = $('#to-station');

        var stationList = $('#station-list');
        stationList.empty();

        stations.forEach(function (station) {
            // Create a list item
            var listItem = $('<li>');
            var lineCodeName = $('<p>').text(station.name)


            // Create the line code span with inline styling
            var lineCodeSpan = $('<span>').text(station.lineCodeName)
                .css({
                    'background-color': station.lineCodeColor,
                    'border': '2px solid ' + station.lineCodeColor,

                }); // Set inline background color
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

            // Append the station name directly to the list item (no span)
            listItem.append(lineCodeName, ' '); // Add a space between name and code
            listItem.append(lineCodeSpan);
            listItem.append(lineCodeSpan1);

            listItem.on('click', function () {
                // console.log("Station selected:", station.name);
                if (currentInputField) {
                    currentInputField.val(station.name);
                    $('#station-selection').hide();
                }
            });

            stationList.append(listItem);
        });
    }
    $('#from-station, #to-station').on('click', function () {
        currentInputField = $(this);
        // console.log("Input field clicked:", currentInputField.attr('id'));
        $('#station-selection').show();
        $('#station-search').val('');
    });
    $('#search-icon').click(function () {
        $('#station-search').focus();
    });
    // Event listener for closing modals
    $('.close-btn').on('click', function () {
        // console.log("Close button clicked");
        $(this).closest(' .station-modal').hide();

    });
    $('#station-search').on('input', function () {
        var searchTerm = $(this).val().toLowerCase();

        $('#station-list li').each(function () {
            var stationName = $(this).text().toLowerCase();
            $(this).toggle(stationName.includes(searchTerm));
        });
    });
    $(document).ready(function () {
        $('#station-search').hide();
        $('#clear-icon').hide();
        $('#search-icon2').hide();
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
            $('#station-search').hide();
            $('#clear-icon').hide()
            $('#search-icon2').hide();
            $('#station-search').val(''); // Clear the search input
            $('#heading').toggle();
            $('#imgs').toggle();
        });
    });
    $('#station-list li').on('click', function () {
        var stationName = $(this).text();
        if (currentInputField) {
            currentInputField.val(stationName);
            $('#station-selection').hide();
        }
    });
    $('.input-wrapper').on('click', function () {
    });




    $(document).on('click', function (event) {
        if (!$(event.target).is('#from-station, #to-station') && !$(event.target).closest('#station-selection').length) {
            $('#station-selection').hide();
        }
    });




    // Swap the values of the two select fields
    $("#swap-stations").click(function () {
        var fromStation = $("#from-station").val();
        var toStation = $("#to-station").val();
        $("#from-station").val(toStation);
        $("#to-station").val(fromStation);
    });


    // Show popup if stations are not selected
    $("#show-fare").click(function () {
        var fromStation = $("#from-station").val();
        var toStation = $("#to-station").val();

        if (!fromStation || !toStation) {
            $("#popup").removeClass("hidden").hide().slideDown();
            $("#popup P").text('Please Select Station');

        } else if (fromStation === toStation) {
            // Display error if both stations are the same
            $("#popup").removeClass("hidden").hide().slideDown();
            $("#popup P").text('Please Select destination station');
        } else {
            var fromStationCode = getStationCode(fromStation);

            var toStationCode = getStationCode(toStation);
            fetchFareOptions(fromStationCode, toStationCode);
        }
    });

    // Close popup
    $(".close-button").click(function () {
        $("#popup").slideUp();
    });

    // Get station code by name
    function getStationCode(stationName) {
        var station = stations.find(s => s.name === stationName);
        console.log(station.stationCode)
        return station ? station.stationCode : "";
    }
    $('.drop-button').on('click', function () {
        $(this).siblings('p').toggle();
    });
    // Function to show fare options
    function showFareOptions() {
        var fareOptionsContainer = $("#fare-options-container");
        fareOptionsContainer.empty(); // Clear any existing content
        fareOptionsContainer.removeClass("hidden");

        // Add a white border to the fare container
        // fareOptionsContainer.css('border', '1px solid rgb(68, 59, 59)');
        // fareOptionsContainer.css('padding', '10px'); // Add padding for better visibility

        var fareOptionsHtml = `
          <div class = mainFare> 
          <div class = pfarecontainer>
   
        </div
    </div>
            <div class="passenger-select">
           
                <p class="validity-message">This ticket is valid till: ${new Date().toLocaleDateString()}</p>
                <br>
                <div class="custom-select-container">
    <label for="passenger-count" class="select-label">Passenger Number</label>
    <select id="passenger-count">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
    </select>
</div>
            </div>
            <div class="apply-coupon-input">
                <div class = "coupon"> <p> Apply Coupon (Optional) </p> <p class = "below_btn"> ⌄ </p>
                </div>
                 <div class = "couponcode">
                 <input type="text" id = "couponVal" placeholder="Enter Coupon Code"> 
                  <button id="Couponbtn">CHECK</button>
                 </div>
            </div>
        <p style = "text-align: center; margin-top: 10px"> You will save  gms of Carbon
        <div class = "paybtn" >
            <button id = "pay" > PROCEED  TO PAY</button>
            </div>
            </div> 
        `;
       
        fareOptionsContainer.append(fareOptionsHtml);
        $('#Payheader').on('click', function () {
            history.back();
        });
        $('.coupon').click(function() {
            $('.couponcode').toggle();
            // $('.below_btn').toggleClass('rotated'); 
        });
        $('#pay').click(function () {
            // Find the value of the checked radio button by name
            var selectedValue = $('input[name="line"]:checked').val();
            var IsIncluding = $('input[name="line"]:checked').attr('lineData');
            var ticketDetails;
            var numberofpassengers = $('#passenger-count').val();

            // Calculate the total price
            var totalprice = selectedValue * numberofpassengers;

            // Determine ticket details based on IsIncluding
            if (IsIncluding == "Excluding") {
                ticketDetails = ticket1;
            } else {
                ticketDetails = ticket0;
            }

            // Log the values to the console
            console.log('Number of passengers: ', numberofpassengers);
            console.log('Selected value: ', selectedValue);
            console.log('Total price: ', totalprice);
            console.log('Ticket details: ', ticketDetails);

            // Encrypt total price using AES
            var secretKey = "64c7cc9b8017a71f0dca9be96e980ed1536228d2eefd74202e4d7730ea33d988";
            var encrypted = CryptoJS.AES.encrypt(totalprice.toString(), secretKey).toString();
            console.log(encrypted)
            // Prepare data for API call
            const payapiData = {
                purpose: "qr-ticket",
                amount: totalprice,
                deviceId: "9340018058",
                hash: encrypted,
                tickets: ticketDetails,
                trips: parseInt(numberofpassengers)
            };

            const payapiurl = "http://35.200.153.72:3002/external/v2/pg/options";

            // Headers for API request
            const headers = {
                'Authorization': 'Bearer 87ee6b96642d5a8055d1ba72306116128d8fdf2bc173e9a230ba2fdf67d37dd914bbc492833e5e667eb0de9acc49e30fc117741db91c00823cc859f84a2b6435593f2e56e16932585e1407617d5fb4d5013b8f950770fe5f727b2494b89b2a4733da8bfc35925a64454f413c38fd2b4a5a7fab4d667d2bdc9d52bd677ef23a388d7196148f81aa359b651e2b740e770566f1d4445caa0fd86ec1a332ae9cb3a004012c455bbf082fe1102f43603d874d4abc62b1d2861efc6d72e37ac4ea893406281d0f7bd2b7d1c9a3c439ddba44e6c7aa738dd2c8aa2fde5c36d11abe5f3fcbd2e0da0ae00fcebc29c19436640490',
                 'key': 'rahul'
            };

            // Make the POST request to the API
            $.ajax({
                url: payapiurl,
                method: 'POST',
                contentType: 'application/json',
                headers: headers,
                data: JSON.stringify(payapiData),
                success: function (response) {
                    // Check if the response is successful
                    if (response.statusCode === 200) {
                        const apiData = response;
                        totalamount: response.data;
                        orderid = response.ORDER_ID;
                        console.log(orderid);
                        localStorage.setItem('orderid', orderid);
                    } else {
                        // alert('Failed to fetch data from the API');
                    }
                },
                error: function (error) {
                    alert('Error while fetching data from the API', error);
                }
            });

            // Create a new page dynamically
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
                        <a href="#" id="creditCard">
                            <div class="creditcard">
                                <img src="../assets/credit_card.svg" alt="">
                                <p>Pay with Credit Card </p>
                            </div>
                        </a>
                        <a href="#" id = "debitCard">
                            <div class="debitcard">
                                <img src="../assets/debitCard.svg" alt="">
                                <p>Pay with Debit Card </p>
                            </div>
                        </a>
                        <a href="#" id="upipageNew">
                            <div class="upipay">
                                <img src="../assets/payupi.svg" alt="">
                                <p>Pay with UPI </p>
                            </div>
                        </a>
                    </div>
                </div>
            `;


            $('body').children().hide();


            $('body').append(newPageContent);

            // Event handler for UPI payment link
            $('#upipageNew').on('click', function (event) {
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
                            <input type="text" id = "vpaid" placeholder="Enter Your VPA ID">
                            <button class="submitvpa">PAY NOW</button>
                        </div>
                    </div>
                `);

                // Event handler for PAY NOW button inside VPA form
                $('.submitvpa').on('click', function (event) {
                    event.preventDefault();
                    var vpaInput = $('#vpaid').val();
                    console.log('VPA:', vpaInput);

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
                            console.log("Network status", status, xhr.status)
                            if (response.status === 'OK' && response.valid === true) {
                                // Hide the previous content
                                $('body').children().hide();

                                // Append the new payment form
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

                                // Make the second API call with additional data
                                const data = {
                                    "orderId": orderid,
                                    "type": "UP",
                                    "payerAddress": `${vpaInput}`,
                                    "payerPhone": phoneNumber
                                };

                                $.ajax({
                                    url: 'http://35.200.153.72:3002/external/v2/pg/pay',
                                    method: 'POST',
                                    headers: {
                                      'Authorization': 'Bearer 87ee6b96642d5a8055d1ba72306116128d8fdf2bc173e9a230ba2fdf67d37dd914bbc492833e5e667eb0de9acc49e30fc117741db91c00823cc859f84a2b6435593f2e56e16932585e1407617d5fb4d5013b8f950770fe5f727b2494b89b2a4733da8bfc35925a64454f413c38fd2b4a5a7fab4d667d2bdc9d52bd677ef23a388d7196148f81aa359b651e2b740e770566f1d4445caa0fd86ec1a332ae9cb3a004012c455bbf082fe1102f43603d874d4abc62b1d2861efc6d72e37ac4ea893406281d0f7bd2b7d1c9a3c439ddba44e6c7aa738dd2c8aa2fde5c36d11abe5f3fcbd2e0da0ae00fcebc29c19436640490',
                                      'key': 'rahul'
                                    },
                                    contentType: 'application/json',
                                    data: JSON.stringify(data),
                                    success: function (response) {
                                        console.log('API call successful:', response);
                                    },
                                    error: function (error) {
                                        console.error('API call failed:', error);
                                        // Handle error
                                    }
                                });
                                const apiURL_status = 'http://35.200.153.72:3002/external/v2/pg/status';
                                const orderId_status = orderid;

                       

                                function checkPaymentStatus() {
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
                                                $paymentFailed.show();
                                                clearInterval(intervalId);
                                                $('#newPageupi').hide();
                                                $('.payamount').hide();
                                                $paymentFailed.find('#failed-amount-upi').text(response_status.TOTAL_AMOUNT);
                                                $paymentFailed.find('#failed-order-id-upi').text(response_status.ORDER_ID);
                                                $paymentFailed.find('#failed-ref-id-upi').text(response_status.PG_REF_NUM);
                                                $paymentFailed.find('#failed-datetime-upi').text(currentDateTime);
                                            } else if (status === 'Captured') {
                                                $paymentSuccess.show();
                                                clearInterval(intervalId);
                                                $('#newPageupi').hide();
                                                $('.payamount').hide();
                                                $paymentSuccess.find('#failed-amount').text(response_status.TOTAL_AMOUNT);
                                                $paymentSuccess.find('#failed-order-id').text(response_status.ORDER_ID);
                                                $paymentSuccess.find('#failed-ref-id').text(response_status.PG_REF_NUM);
                                                $paymentSuccess.find('#failed-datetime').text(currentDateTime);
        
                                            }
                                        },
                                        error: function (error) {
                                            console.error('Error:', orderId_status);
                                        }
                                        
                                    });
                                             // Create the status message divs and append to the body
                                const $paymentFailed = $(`
                                    <div id="payment-failed" class="status-message">
                                        <img src="../assets/payment_failed_alert.svg" alt="Failed" style="width: 80px; height: 80px;">
                                        <h2>Transaction Failed</h2>
                                        <p>Payment Failed</p>
                                        <p>₹  <span id="failed-amount-upi"></span> </p>
                                        <p id ="orderid">Order ID: <span id="failed-order-id-upi"> </span></p>
                                        <p id ="refid"> Reference ID: <span id="failed-ref-id-upi"></span></p>
                                        <p> <span id="failed-datetime-upi"></span></p>
                                        <button id="go-home">GO TO HOME</button>
                                    </div>
                                `).appendTo('body');

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
                                $("#go_my_tickets-home").click(function () {
                                    window.location.href = "myTickets.html";
                                });
                                }

                                const intervalId = setInterval(checkPaymentStatus, 5000);
                                setTimeout(() => clearInterval(intervalId), 300000); //  5 minutes

                                $(document).on('click', '#go-home', function () {
                                    window.location.href = 'home.html';
                                });


                            }
                            else {
                                alert('Wrong VPA');
                            }
                        },
                        error: function (error) {
                            alert('Error occurred while verifying VPA.', error);
                        }


                    });

                });


            });
            createDebitCardInputForm();
            addValidation();

            $('#debitCard').on('click', function () {
                showDebitCardInput();
            });
            createCreditCardInputForm()
            addValidationCredit()

            $('#creditCard').on('click', function () {
                showCreditCardInput();
            });

        });

        var linesDetails = $(".pfarecontainer");
        $('#from-station').click(function() {
            $('.mainFare').hide();
        });
        $('#to-station').click(function() {
            $('.mainFare').hide();
        });
        linesDetails.append(val)
        $('#fare-options-container').on('click', '.toggle-button', function () {
            var $hiddenContent = $('.hidden-content');

            if ($hiddenContent.css('display') === 'none') {
                $hiddenContent.css('display', 'block');
            } else {
                $hiddenContent.css('display', 'none');
            }
        });
        $('.toggle-btn0').click(function() {
            $('.hidden-content0').toggle();
            $(this).toggleClass('rotated'); 
        });
        $('.toggle-btn1').click(function() {
            $('.hidden-content1').toggle();
            $(this).toggleClass('rotated'); 

        });
    }
    // Initial fetch of stations data
    fetchStations();
});
