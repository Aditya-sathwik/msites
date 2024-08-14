$(document).ready(function () {
  let qrCodeLength = 0;
  $('#backimg, #mticket').on('click', function() {
    window.location.href = '../pages/home.html';
  });
  $('#payheader').on('click', function () {
    window.location.href = 'home.html';
  });

  $.ajax({
    url: 'http://35.200.153.72:3002/external/v2/ticket/list',
    method: 'GET',
    headers: {
      // 'Authorization': 'Bearer 87ee6b96642d5a8055d1ba72306116128d8fdf2bc173e9a230ba2fdf67d37dd914bbc492833e5e667eb0de9acc49e30f8c95c389e2c4b3b03fe9f2723aa03c632bd1a3df76a87fdc1085b118ee89aef39ccf1b188615b8b4ce63c94342341e9e8ba79699773e45f407da0caac068ac13cf6a33870a4510f1183fc82a8d61817b959ef718b9bf888c53bc483424b01ae705c9bee1936051436ad0c2caa916867ed52e7e44eb1209a4879d9f47dddd40c78129c513d0b5cdae06774543a536cd1bc451f2ea1972e4fed69a4001d1461b95197e805d7319522f57714ba168ee27545b0e374b0318c3d1a54118bcf49ae335',
      // 'key': 'rahul'
      'Authorization': 'Bearer 87ee6b96642d5a8055d1ba72306116128d8fdf2bc173e9a230ba2fdf67d37dd914bbc492833e5e667eb0de9acc49e30fc117741db91c00823cc859f84a2b6435593f2e56e16932585e1407617d5fb4d5013b8f950770fe5f727b2494b89b2a4733da8bfc35925a64454f413c38fd2b4a5a7fab4d667d2bdc9d52bd677ef23a388d7196148f81aa359b651e2b740e770566f1d4445caa0fd86ec1a332ae9cb3a004012c455bbf082fe1102f43603d874d4abc62b1d2861efc6d72e37ac4ea893406281d0f7bd2b7d1c9a3c439ddba44e6c7aa738dd2c8aa2fde5c36d11abe5f3fcbd2e0da0ae00fcebc29c19436640490',
      'key': 'rahul'
    },
    success: function (response) {
      response.forEach(ticket => {
        const activationDateTime = ticket.activationTime.split(' ');
        const activationDate = activationDateTime[0];
        const activationTime = activationDateTime[1];
        const validDate = activationDateTime[0];

        let content = `<div class="viewticket">
          <div class="ticket-detail">
            <div id="booking_detail">
              <div id="bill_detail">
                <p>Passengers: ${ticket.trips}</p>
                <p>QR-Ticket: <span class="No_Qr"></span></p>
              </div>
              <div id="time_detail">
                <p>Date: ${activationDate}</p>
                <p>Time: ${activationTime}</p>
              </div>
            </div>
            <hr class="dotted-line">
            <div id="rout_detail">
              <div id="ticket_img">
                <img src="../assets/ticketTrain.svg" alt="">
              </div>
              <div id="ticket_stations">
          <div class = "source_circle" >      
          <div class="vertical-line"></div>
         <p> <div class="circle"> </div> ${ticket.sourceStation.name}</p> </div>
           <div class = "source_circle2" >       <p> <div class="circle" > </div>${ticket.destinationStation.name}</p> </div>
              </div>
            </div>
            <hr style="max-width: 90%; margin: -10px  auto 0 auto; color: rgb(241, 248, 248);">
            <div class="fare_details">
              <div class="fare_show">
                <img src="../assets/fare.svg" id="showfareimg" alt="">
                <span id = "totalFare">
                <p >Fare </p> <p id = "ticketPrice"><strong> ₹${ticket.amount} </strong>  </p> </span>
              </div>
              <div class="plateform_show">
                <img src="../assets/Delhi_Metro_logo.svg.png" id="plateformImg" alt="">
                <p id="plateformnNo">Platform Number: ${ticket.interchanges[0].platform || 1}</p>
              </div>
              <div class="paymentstatus">
                <img src="../assets/sucessTick.svg" id="statusimg" alt="">
                <div class="paymentstatus1">
                  <p>TICKET STATUS: <span id="status">${ticket.status}</span></p>
                </div>
              </div>
            </div>
             <hr style="max-width: 90%; margin: auto; color: rgb(241, 248, 248);">
            <div class = "down">
            <span id = "tap" >Tap to view QR Code</span>
            <span class = "arrow_down" > <i> </i></span>
            </div>
          `;

        const qrDetailsContainer = $('<div class="qrdeatils">').html(`
          <centre>
           <p id = "scan_instrunction">Scan this QR Code at metro entry point and exit points.</p>
          </centre>
          <div class="qr-slideshow">
            <span class="arrow" id="prev">&lt;</span>
            <div class="qrcode"></div>
            <span class="arrow" id="next">&gt;</span>
          </div>
          <div class="slide-dots"></div>
          <p class="valid_date"></p>
          <div class="important_point">
            <p>Important Points</p>
            <ul>
              <li>
                <div class="co2"></div>
              </li>
              <div class="login_instructions">
                <li>Please do not login on multiple devices.</li>
              </div>
            </ul>
            <div class="notice_msg">Phone screen with scratches might face issue in QR Scanning*</div>
          </div>
        `);

        ticket.qrcodes.forEach((qrCode, index) => {
          const qrDiv = $(`<div class="qr-code" id="qrcode${index}"></div>`);
          qrDiv.append(`<div class="source" id="source${index}">           <div class="vertical-line"></div>
 <div class="circle"></div> <div class="vertical-dotted-line" style="border: gray ;"></div>${qrCode.source}</div>`);
          qrDiv.append(`<div class="destination" id="destination${index}"><div class="circle"></div><p id = destination_main> ${qrCode.destination}</p></div>`);
          new QRCode(qrDiv[0], qrCode.data);
          qrDetailsContainer.find('.qrcode').append(qrDiv);
          qrDetailsContainer.find('.slide-dots').append(`<span class="dot" id="dot${index}"></span>`);
        });

        if (ticket.qrcodes.length === 1) {
          qrDetailsContainer.find('.source, .destination, .arrow,#next, .dot').hide();
      
        } else {
          qrDetailsContainer.find('.source, .destination, .arrow, .dot').show();
        }

        const ticketContainer = $('<div class = "ticket_Number">').html(content);
        ticketContainer.append(qrDetailsContainer);
        $('#ticket-details').append(ticketContainer);

        qrCodeLength = ticket.qrcodes.length;
        ticketContainer.find('.No_Qr').text(qrCodeLength);
        ticketContainer.find('.valid_date').text(`Entry valid till: ${validDate}`);
        ticketContainer.find('.co2').text(` ${ticket.response.qR_Payload.carbonEmission}`);

        let currentIndex = 0;
        const leftArrow=document.getElementById("prev")
        leftArrow.style.display='none'
        const rightArrow=document.getElementById("next")
        const totalQRCodes = ticket.qrcodes.length;

        function updateActiveQRCode(index) {
          ticketContainer.find('.qr-code').removeClass('active');
          ticketContainer.find('.source').removeClass('active');
          ticketContainer.find('.dot').removeClass('active');
          ticketContainer.find(`#qrcode${index}`).addClass('active');
          ticketContainer.find(`#source${index}`).addClass('active');
          ticketContainer.find(`#dot${index}`).addClass('active');

          // Show/hide prev and next buttons
          // if (index === 0) {
          //   ticketContainer.find('#prev').hide();
          //   ticketContainer.find('#next').show();
          // } else if (index === totalQRCodes - 1) {
          //   ticketContainer.find('#prev').show();
          //   ticketContainer.find('#next').hide();
          // } else {
          //   ticketContainer.find('#prev').show();
          //   ticketContainer.find('#next').show();
          // }
        }
        

        // Navigate to the previous QR code
        ticketContainer.find('#prev').click(function () {
          if (currentIndex > 0) {
          
           
            currentIndex--;
            updateActiveQRCode(currentIndex);
            rightArrow.style.display="block"

            if(currentIndex==0){
              leftArrow.style.display="none"
            }
           
          }
         
        });

        // Navigate to the next QR code
        ticketContainer.find('#next').click(function () {
          if(currentIndex>0){
            leftArrow.style.display=='block'
          }
          if (currentIndex < totalQRCodes - 1) {
            currentIndex++;
            updateActiveQRCode(currentIndex);
            leftArrow.style.display="block"

            if(currentIndex==totalQRCodes - 1){
              rightArrow.style.display="none"
            }
            
          }
        });

        // Click event for dots to navigate to the corresponding QR code
        ticketContainer.find('.dot').click(function () {
          currentIndex = $(this).index();
          updateActiveQRCode(currentIndex);
        });

        updateActiveQRCode(0);
        ticketContainer.find('.arrow_icon').hide();

        // Toggle button functionality
        ticketContainer.find('.down').click(function () {
          ticketContainer.find('.qrdeatils').toggle();
          ticketContainer.find('.down').toggle();
        });

        // Route detail onclick
        ticketContainer.find('#rout_detail, #booking_detail, .fare_details').click(function () {
          ticketContainer.find('.qrdeatils').toggle();
          ticketContainer.find('.down').toggle();
        });
      });
    },

    error: function (error) {
      console.error(error);
    }
  });
});
