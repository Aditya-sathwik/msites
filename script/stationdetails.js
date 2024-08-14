const mainaboutstation = (
    wantedstationcode,
    inputdiv,
) => {







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




    function fetchstationsdata() {

        var url = metrolines.stationdetails + `${wantedstationcode}`;

        var method = 'GET';
        var authorizationKey = headers35;

        var requestData = null;

        fetchapiData(url, method, authorizationKey, requestData,
            function (response) {
                console.log('Request successful:', response);
                mainstationdetails(response)

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


    fetchstationsdata()


    function mainstationdetails(response) {


        var mapsurl = `https://maps.google.com/maps?q=${response.latitude},${response.longitude}&hl=en&z=14&amp;output=embed`

         var mapurl = `https://www.google.com/maps/search/?api=1&query=${response.latitude},${response.longitude}`

        var aboutstation = `
                       <div class="version highlight-bar shadows">
            <div id="tiket_header">
                <div class="mainback" id="courier-home">
                    <img src="../assets/leftArrowBold.svg" alt id="backimg">
                    <p id="mticket"> ${response.station_name}</p>
                </div>

            </div>

            <div class="station-details-body">
                <div class="station-details-container">

                    <section class="map-section">
                            <iframe src="${mapsurl}"  style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            
                        <a class="direction-btn" href="${mapurl}">
                            <img src="../assets/marker.svg" alt="marker" >
                            <p>DIRECTION</p>
                        </a>
                    </section>
                    <div class="station-line">

                            <p>${response.station_name}</p>


                            ${response.metro_lines.map((lineItem, lineIndex) => {
                             
                                return `
                                    <div class="details-inline " data-index="${lineIndex}" id="line-${lineIndex}" style="border-color: ${lineItem.color}; border-left: 8px solid ${lineItem.color};">
                                        <div class="icon">
                                            <object id="coloredobject-${lineIndex}-1" type="image/svg+xml" data="../assets/metro_line.svg" width="50" height="50"></object>
                                        </div>
                                        <div class="info">
                                            <div class="line-name" style="color: ${lineItem.color};">${lineItem.subname || 'No SubName'}</div>
                                            <div class="line-color">${lineItem.name}</div>
                                        </div>
                                        <div class="nxt-arrow">
                                            <object id="coloredobject-${lineIndex}-2" type="image/svg+xml" data="../assets/arrow_indicator.svg" width="20" height="20"></object>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                            
                    </div>

                        <nav class="nav-sections">
                            <ul class="menu">
                              <li class="menu-item"><a class="menu-item-link " href="#contact-info">Contact</a></li>
                              <li class="menu-item"><a class="menu-item-link " href="#station-details">Station Details</a></li>
                              <li class="menu-item"><a class="menu-item-link " href="#gates">Gates</a></li>
                              <li class="menu-item"><a class="menu-item-link" href="#lift">Lift/Escalator, travelator</a></li>
                              <li class="menu-item"><a class="menu-item-link" href="#platforms">Platforms</a></li>
                              <li class="menu-item"><a class="menu-item-link" href="#station-facilities">Station Facilities</a></li>
                              <li class="menu-item"><a class="menu-item-link" href="#parking-location">Parking Location</a></li>
                              <li class="menu-item"><a class="menu-item-link" href="#nearbyplaces">Nearby places</a></li>
                              <div class="active-line"></div>
                            </ul>
                          </nav>
                        
                          <main id="main-content" class="page-sections">


                            <div  class="page-section" id="contact-info">
                                <h4>Contact </h4>
                                <div class="icon">
                                    <img src="../assets/mobile.svg" alt="Phone Icon">
    
                                    <span>${response.landline}</span>
                                </div>
                         
                            </div>



                            <div  class="page-section" id="station-details">
                            ${response.stations_details.map((detailitem, detailindex) => {
                             
                                return `
                                    <div class="detail">
                                        <img src="${detailitem.image}" alt="Icon">
                                        <span>${detailitem.name}</span>
                                    </div>

                                `;
                            }).join('')}
                            
                          </div>


                            <div  class="page-section" id="gates">
                            <h4>Gates</h4>
                            ${response.gates.map((gateitem, gateindex) => {
                             
                                return `
                                    <div class="detail">
                                <h3>${gateitem.name}</h3>
                                  <p>${gateitem.location}</p>
                                    </div>

                                `;
                            }).join('')}
                            
                          </div>

                        <div  class="page-section" id="lift">
                            <h4>Lift/Escalator, travelator</h4>
                            ${response.lifts.map((liftitem, liftindex) => {
                             
                                return `
                                    <div class="detail">
                                <h3>${liftitem.name}</h3>
                                  <p>${liftitem.descriptionLocation}</p>
                                    <div class="liftimg">
                                        <img src="../assets/lift.svg" alt="Icon">
                                        <span>${liftitem.door}</span>
                                        <img src="../assets/disable.svg" alt="Icon">
                                        <span>${ liftitem.disabled ? 'yes' : 'no'}</span>
                                    </div>
                                    </div>

                                `;
                            }).join('')}
                            
                        </div>
                         <div class="page-section" id="platforms">
                                <h4>Platforms</h4>
                              ${response.platforms.map((platformitem, platformindex) => {
                                return `
                             <div class="detail">
                             <h3>${platformitem.name}</h3>
                               ${platformitem.trainTowards.map((trainitem, trainindex) => {
                                return `
                             <div class="platformimg">
                            <img src="../assets/ticketTrain.svg" alt="Icon">
                            <span>${trainitem.name}</span>
                          
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }).join('')}
</div>

                      <div  class="page-section" id="station-facilities">
                            <h4>Station Facilities</h4>
                            ${response.stations_facilities.map((faciliitem, faciliindex) => {
                             
                                return `
                                    <div class="detail">

                                        <div class="facliimg">
                                           <img src="${faciliitem.facilityImage}" alt="Icon">
                                              <span>${faciliitem.facilityType}</span>
                                        </div>
                                      <h3>${faciliitem.facilityName} (${faciliitem.purpose})</h3>
                                        <p>${faciliitem.locationDescription}</p>
                                    
                                    </div>

                                `;
                            }).join('')}
                            
                        </div>
                      <div  class="page-section" id="parking-location">
                            <h4>Parking Location</h4>
                            ${response.parkings.map((prakitem, parkindex) => {
                             
                                return `
                                    <div class="detail">
                                    <h4>${prakitem.provider}</h4>
                                    <div class = "icons">
                                    <img src="../assets/car.svg" alt="Icon">
                                    <span>Yes(${prakitem.capacityCar})</span>
                                    <img src="../assets/bike.svg" alt="Icon">
                                    <span>Yes(${prakitem.capacityMotorcycle})</span>
                                    <img src="../assets/cycle.svg" alt="Icon">
                                    <span>Yes(${prakitem.capacityCycle})</span>
                                    </div>


                               
                                    </div>

                                `;
                            }).join('')}
                            
                        </div>
<div class="page-section" id="nearbyplaces">
    <h4>Nearby Places</h4>
    ${response.nearby_places.map((placeitem, placeindex) => {
        return `

         <h4>${placeitem.groupName}</h4>
            <div class="facility-item">
                <div class="facility-image">
                    <img src="../assets/car.svg" alt="Icon">
                     <p>${placeitem.typesOfPlace}</p>
                </div>
                <div class="facility-details">
                    
                
                       <p>${placeitem.name}</p>
                    <div class="facility-meta">
                        <span class="facility-distance">  ${placeitem.distanceFromMetro} km </span>
                        <span class="facility-time"> <img src="../assets/footsteps.svg" alt="Icon">${placeitem.estimatedWalkingTimeMin} mins </span>
                        <span class="facility-time"><img src="../assets/bus2.svg" alt="Icon">   ${placeitem.estimatedPubTransportTimeMin} mins </span>
                    </div>
                </div>
            </div>
        `;
    }).join('')}
</div>




                          </main>
            </div>


                        <div class = "action-buttons">
                <button  class = "footer-btn">PLAN YOUR JOURNEY</button>
                <button  class = "footer-btn">FRIST & LAST METRO</button>
            </div>

        </div>
            `;
        $(`#${inputdiv}`).empty()
        $(`#${inputdiv}`).append(aboutstation);

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

        response.metro_lines.forEach((lineItem, lineIndex) => {
            // Ensure the SVG is loaded before changing its color
            $(`#coloredobject-${lineIndex}-1`).on('load', function () {
                changeFillColor(`coloredobject-${lineIndex}-1`, lineItem.color, `Path_6165`);
            });
            $(`#coloredobject-${lineIndex}-2`).on('load', function () {
                changeFillColor(`coloredobject-${lineIndex}-2`, lineItem.color, `Path_6186`);
            });
        });



        const links = document.querySelectorAll('.menu-item-link');
        const sections = document.querySelectorAll('.page-section');
        const sectioned = document.querySelector('.station-details-container');
        const menu = document.querySelector('.menu');
        const navSections = document.querySelector('.nav-sections');

        console.log('Links:', links);
        console.log('Sections:', sections);
        console.log('Sectioned:', sectioned);
        console.log('Menu:', menu);
        console.log('Nav Sections:', navSections);



        if (!links.length || !sections.length || !sectioned || !menu || !navSections) {
            console.error('One or more elements not found in the DOM. Please check the selectors.');
            return;
        }

        function removeActiveClasses() {
            links.forEach(link => link.classList.remove('active'));
        }

        function addActiveClass(index) {
            if (index >= 0 && index < links.length) {
                links[index].classList.add('active');
            } else {
                console.error('Index out of bounds:', index);
            }
        }

        function scrollMenuToActiveLink(index) {
            if (index >= 0 && index < links.length) {
                const activeLink = links[index];
                const linkPosition = activeLink.getBoundingClientRect();
                const menuPosition = menu.getBoundingClientRect();

                if (linkPosition.left < menuPosition.left || linkPosition.right > menuPosition.right) {
                    menu.scrollLeft += (linkPosition.left + linkPosition.width / 2) - (menuPosition.left + menuPosition.width / 2);
                }
            }
        }

        function updateActiveLink() {
            let index = sections.length;

            while (--index && sectioned.scrollTop + sectioned.clientHeight / 2 < sections[index].offsetTop - sectioned.offsetTop) {}

            // Ensure index is within bounds
            if (index < 0) {
                index = 0;
            } else if (index >= sections.length) {
                index = sections.length - 1;
            }

            // console.log('Updated index:', index);

            removeActiveClasses();
            addActiveClass(index);
            scrollMenuToActiveLink(index);
        }


        function toggleNavVisibility() {
            const scrollPercentage = sectioned.scrollTop / (sectioned.scrollHeight - sectioned.clientHeight);

            if (scrollPercentage > 0.1) {
                navSections.style.display = 'block';
            } else {
                navSections.style.display = 'none';
            }
        }

        updateActiveLink();
        toggleNavVisibility();

        sectioned.addEventListener('scroll', () => {
            updateActiveLink();
            toggleNavVisibility();
        });

        links.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                sectioned.scrollTo({
                    top: sections[index].offsetTop - sectioned.offsetTop,
                    behavior: 'smooth'
                });
                removeActiveClasses();
                addActiveClass(index);
                scrollMenuToActiveLink(index);
            });
        });
    };

}


// document.addEventListener('DOMContentLoaded', () => {
//     mainaboutstation('DSTO', 'stationdiv');
// });
