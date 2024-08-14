$(document).ready(function () {
    // Store the original body content
  
    var originalContent = $('#original-content');

    // Create the metro-services div
    var metroServices = $('<div>').addClass('metro-services');
    var h2 = $('<h2>');
    var servicesGrid = $('<div>').addClass('services-grid');

    // Assemble the metro services section
    metroServices.append(h2).append(servicesGrid);
    originalContent.append(metroServices);

    // Create the wallet-details section
    var walletDetails = $('<div>').addClass('wallet-details');
    var walletSection = $('<section>').attr('id', 'wallet');
    var walletLink = $('<a>').attr('href', '#').attr('id', 'wallet-img');
    var walletPng = $('<div>').addClass('walletpng');
    var walletImg = $('<img>').attr('src', '');
    var walletDetail = $('<div>').attr('id', 'wallet-detail');
    var walletDetailP1 = $('<p>');
    var walletDetailP2 = $('<p>').attr('id', 'last-four-digits').text('xxxxxx');
    var walletBalance = $('<p>').css('margin-right', '20px').attr('id', 'wallet-balance').text('₹00');

    // Assemble the wallet details section
    walletPng.append(walletImg);
    walletDetail.append(walletDetailP1).append(walletDetailP2);
    walletLink.append(walletPng).append(walletDetail).append(walletBalance);
    walletSection.append(walletLink);
    walletDetails.append(walletSection);
    originalContent.append(walletDetails);

    // Create the promo section
    var promo = $('<div>').addClass('promo');
    var promoImg = $('<div>').addClass('promo-img');
    var promoLink = $('<a>').attr('href', '#');
    var promoImage = $('<img>').attr('id', 'promoimage').attr('src', '').attr('alt', 'promo');
    var promoText = $('<span>').text('');

    // Assemble the promo section
    promoLink.append(promoImage).append(promoText);
    promoImg.append(promoLink);
    promo.append(promoImg);
    originalContent.append(promo);

    // Create the recharge section
    var rechargeContainer = $('<div>').addClass('recharge-container');
    var rechargeAbout = $('<div>').addClass('recharge-about');
    var rechargeH3 = $('<h3>');
    var rechargeLink = $('<a>').attr('href', '#');
    var rechargeH5 = $('<h5>').text('View All');
    var bills = $('<div>').addClass('bills');
    var paybills = $('<div>').addClass('paybills');

    // Assemble the recharge section
    rechargeLink.append(rechargeH5);
    rechargeAbout.append(rechargeH3).append(rechargeLink);
    bills.append(paybills);
    rechargeContainer.append(rechargeAbout).append(bills);
    originalContent.append(rechargeContainer);

    // Create the other services section
    var otherContainer = $('<div>').addClass('other-container');
    var otherAbout = $('<div>').addClass('other-about');
    var otherH3 = $('<h3>');
    var otherLink = $('<a>').attr('href', '#');
    var otherH5 = $('<h5>').text('View All');
    var others = $('<div>').addClass('others');
    var othersinfo = $('<div>').addClass('othersinfo');

    // Assemble the other services section
    otherLink.append(otherH5);
    otherAbout.append(otherH3).append(otherLink);
    others.append(othersinfo);
    otherContainer.append(otherAbout).append(others);
    originalContent.append(otherContainer);

    // knowyour station
    var stationContainer = $('<div>').addClass('station-container');
    var stationAbout = $('<div>').addClass('station-about');
    var stationH3 = $('<h3>');
    var stationLink = $('<a>').attr('href', '#');
    var stations = $('<div>').addClass('stations');
    var stationinfo = $('<div>').addClass('stationinfo');

    //Assemble the know station services

    stationContainer.append(stationAbout).append(stations);
    stationAbout.append(stationH3).append(stationLink);
    stationContainer.append(stations).append(stationinfo);
    originalContent.append(stationContainer);


    // information
    var informationContainer = $('<div>').addClass('information-container');
    var informationAbout = $('<div>').addClass('information-about');
    var informationH3 = $('<h3>');
    var informationH5 = $('<h5>').text('View All');
    var informationLink = $('<a>').attr('href', '#');
    var informations = $('<div>').addClass('informations');
    var informationinfo = $('<div>').addClass('informationinfo');

    // Assemble the information section
    informationContainer.append(informationAbout).append(informations);
    informationAbout.append(informationH3).append(informationLink);
    informationContainer.append(informations).append(informationinfo);
    originalContent.append(informationContainer);
    // Body data
    var bodyData = {
        id: "ANONYMOUS USER"
    };

    // Fetch data from API
    fetchAndCacheData(bodyData);
});

function fetchAndCacheData(bodyData) {
    const request = new Request("http://35.200.153.72:3000/metro/v2/templates/getOfflineTemplate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData)
    });
  
    const cacheKey = new Request(request.url, { method: 'GET' });

    // Try to get the response from the cache first
    caches.open('login-DMRC-v1').then(cache => {
        cache.match(cacheKey).then(cachedResponse => {
            if (cachedResponse) {
                cachedResponse.json().then(data => {
                    updateUIWithData(data);
                });
            } else {
                fetch(request).then(response => {
                    if (response.ok) {
                        response.clone().json().then(data => {
                            updateUIWithData(data);
                            cache.put(cacheKey, new Response(JSON.stringify(data), {
                                headers: { 'Content-Type': 'application/json' }
                            }));
                        });
                    }
                }).catch(error => {
                    console.error("Error fetching data:", error);
                });
            }
        });
    });
}

function updateUIWithData(data) {
    const wallet = data[0].englishResult.widgets[3].data;
    const val = data[0].englishResult.widgets[0].data.items;
    const recharge = data[0].englishResult.widgets[5].data.items;
    const otherservices = data[0].englishResult.widgets[7].data.items;
    const knowstation = data[0].englishResult.widgets[6].data.items;
    const advertisement = data[0].englishResult.widgets[1].data.items[3];
    const informationsdata = data[0].englishResult.widgets[9].data;
    const metrofiles = data[0].englishResult.widgets[1].data.items.screen;

    console.log(data)
    

    // Set the h2 tag with the name from the API
    $(".metro-services h2").text(data[0].englishResult.widgets[0].name);
    $(".recharge-container h3").text(data[0].englishResult.widgets[5].name);
    $(".other-container h3").text(data[0].englishResult.widgets[7].name);
    $("#promoimage").attr("src", "data:image/png;base64," + advertisement.image);
    $(".station-container h3").text(data[0].englishResult.widgets[6].name);
    $(".information-container h3").text(data[0].englishResult.widgets[9].name);
    // Set wallet details
    $("#wallet-img img").attr("src", wallet.icon);
    $("#wallet-detail p:first").text(data[0].englishResult.widgets[0].data.title);
    $("#last-four-digits").text(wallet.lastFourDigits);
    $("#wallet-balance").text("₹" + (wallet?.balance || 0.0));

    // Set promo image
    // $("#promoimage").attr("src", advertisement.image);

    // Define the mapping between service index and HTML file names
    const servicePages = [
        'planjourney.html',
        '',
        // '../pages/bookqr.html',
        '../pages/smartcard.html',
        '../pages/rentlocker.html',
        '.html',
        '.html',
        '.html',
        '.html',
        ''
    ];

    // Services
    $(".services-grid").empty();
    $.each(val, function (i, item) {
        if (i < servicePages.length) { // Limit to the number of available pages
            var icon = item.icon;
            var id=""
            id+=item.name.split(" ").join("")
            
            var a = $("<a>").attr("href", servicePages[i]).attr("data-page", servicePages[i]).attr("id",id);
            var div = $("<div>").addClass("service-item");
            var img = $("<img>").attr("src", "data:image/png;base64," + icon).attr("alt", item.name);
            var p = $("<p>").text(item.name);
            div.append(img);
            a.append(div).append(p);
            $(".services-grid").append(a);
        }
    });

    // Recharge
    $(".paybills").empty();
    $.each(recharge, function (i, item) {
        var icon = item.icon;
        var a = $("<a>").attr("href", "recharge.html").attr("data-page", "recharge.html");
        var div = $("<div>").addClass("service-item");
        var img = $("<img>").attr("src", "data:image/png;base64," + icon).attr("alt", item.name);
        var p = $("<p>").text(item.name);
        div.append(img);
        a.append(div).append(p);
        $(".paybills").append(a);
    });

    // Otherservices
    $(".othersinfo").empty();
    $.each(otherservices.slice(0, 4), function (i, item) {
        var icon = item.icon;
        var a = $("<a>").attr("href", "other" + i + ".html").attr("data-page", "other" + i + ".html");
        var div = $("<div>").addClass("service-item");
        var img = $("<img>").attr("src", "data:image/png;base64," + icon).attr("alt", item.name);
        var p = $("<p>").text(item.name);
        div.append(img);
        a.append(div).append(p);
        $(".othersinfo").append(a);
    });

    // Know your station
    $(".stationinfo").empty();
    $.each(knowstation, function (i, item) {
        var icon = item.icon;
        var a = $("<a>").attr("href", "knowstation.html").attr("data-page", "knowstation.html");
        var div = $("<div>").addClass("service-item");
        var img = $("<img>").attr("src", "data:image/png;base64," + icon).attr("alt", item.name);
        var p = $("<p>").text(item.name);
        div.append(img);
        a.append(div).append(p);
        $(".stationinfo").append(a);
    });
    // infomation
    $(".informationinfo").empty();
    $.each(informationsdata, function (i, item) {
        // console.log(item)
        var icon = item.coverPhoto;
        var a = $("<a>")
        var div = $("<div>").addClass("service-item");
        var img = $("<img>").attr("src",  icon).attr("alt", item.name);
        var p = $("<p>").text(item.title);
        div.append(img);
        a.append(div).append(p);
        $(".informationinfo").append(a);
      
    });
   
}
