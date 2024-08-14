// const headers35 = {
//     'Authorization': 'Bearer 722dc1c0e963999bf2571c4468bee98c36ee506ad55c6119df2755882b67fdc18c928b656c50957b3fb518f850d6771ccbef236b11e762fe57575896907634cf86940f3d4d8a626932306ab80d1c7792b3cc76d4930b3842931ed7f61b703a722ed45a064fa3c39874d06448e87a9ec061264f9af93d265b854f74d1c54fff0b1b755521b5091d191b589c1e59b15e13b29b716097db70f3864aa511308306e223f06134166f875cc8aced5a961dde1e5b6f8fa9769851bba2c2c3c7fde13048cd0e33663f8a8afcddef00ca60fe90411fb244589c71651509f50eaba23f8336ab6376fb4d45447130b46b7abf394524',
//     'Key': 'staging' 
// };

const headers35 = {
    'Authorization': 'Bearer 8e885245cabbd8406f09986e7286bd1a4d20c09056f86488c68a78638cffd03cd4b1061c6df0ea16137df29b9fe3fca3584de37b8a40c1259c452d79bb594f55b3b9d9583d2306615dce514fcce45350f6239f9b14457043729ece28fc2f9c6248c04e110ed3526a915c684e9c0fcea242682cecfac15e7a37ee2d91ae110c4cd4edf9f5d377d987d14bee5689843c75c78a97801f7e199efdd25c3379e0e1fc5baa347c60450c31b63baa9ca340f80fdea3d297b1ca1b4d6f0cc5dae7c716322e8e69e004d451e88a0bb974996394097be47a5e0534417b12cbdc4dab8550eb6567560e5a9522547628d347dc99a0f7',
    'Key': 'aditya'
};

const headers34 = {
    'Authorization': 'Bearer 8e885245cabbd8406f09986e7286bd1a4d20c09056f86488c68a78638cffd03cd4b1061c6df0ea16137df29b9fe3fca381f1b0527ab5dec5b96253344eda090b5c85cf91124db48a074187166709a4be066657b99baa6aaa7a88b5f763989172e8413c7b8def3c8cebe1590a702924cc7be36905fb7a38528c98690fb55be3174f725cad2016dce036a8f3c66feda1587ec973b1b1724f62663287b135dc7b247e052bc5408fbe51e5c8f93ad96cfc8ae3e0643c4c40fc9c546e13a8319b1d1c88a6ff8a580f8b37d03b6392f5e7991e3b27ed687bc45623498f7b6abe003e5e7c9bba8cee1436a3ccf97ac947b410fa',
    'key': 'aditya'
};



const planyourjourney = {

stationslist : "http://35.200.153.72:3000/metro/v3/stations?page=1&limit=300",

trainmain : "http://35.200.153.72:3000/metro/v3/journey/",
trainshort : "http://35.200.153.72:3002/external/v1/ticket/options"
}
const fristmetro = {

traintime: "http://35.200.153.72:3000/metro/v3/first-and-last-metro-time",


}

const couriers = {
    termsandconditions: "http://34.93.164.215:3000/metro/v3/static-page/updateOnApp",
    pincodes: "http://35.200.153.72:3009/courier/v1/courier/pincodeVerify",
    parcelist: "http://35.200.153.72:3009/courier/v1/courier/getContentParent",
    parcel2: "http://35.200.153.72:3009/courier/v1/courier/getContentParent?type=",
    fetchpincodes: "http://35.200.153.72:3009/courier/v1/courier-metro/getCityStateByPincode/",
    lokerimage : "http://35.200.153.72:3002/external/v2/locker/locker-size-image",
    stationsUrl: "http://35.200.153.72:3000/metro/v1/drop-box/app/list",
    tariffcal: " http://34.93.164.215:3009/courier/v1/courier/tariff-new",
    // tariffcal: "http://35.200.153.72:3009/courier/v1/courier/tariff-new",
    orderplace: "http://35.200.153.72:3009/courier/v1/courier-booking/order-place",
    lokerstationslist: "http://35.200.153.72:3000/metro/v3/drop-box/app/list"

}
const mycouriers = {
    getUserorders: "http://35.200.153.72:3009/courier/v2/courier-booking/get-user-orders",

    booking: "http://35.200.153.72:3009/courier/v2/courier-booking/booking/",

    lockeropening: "http://35.200.153.72:3002/external/v2/locker/open-via-qr",

    deletecourier : "http://35.200.153.72:3009/courier/v2/courier-booking/cancelBooking?bookingID="

    // booking : "http://35.200.153.72:3009/courier/v2/courier-booking/booking/DMRC_COURIER_1706615382"


}

const profilebar= {

    updateprofileapi : "http://35.200.153.72:3001/auth/v1/user/update-profile",

    addressapi : "http://35.200.153.72:3004/order/v1/addresses/",

    phonecallback : "http://35.200.153.72:3000/metro/v3/contact-us/callback-request",

    faqslist : "http://35.200.153.72:3000/metro/v3/static-page/get-faq-slugs",


    termsandconditions: "http://34.93.164.215:3000/metro/v3/static-page/updateOnApp",

}
const lostandfound = {

    office: "http://35.200.153.72:3000/metro/v3/static-page/updateOnApp",

    lostlist : "http://35.200.153.72:3000/metro/v3/lost-and-found/",

    addlostitem : " http://35.200.153.72:3000/metro/v3/lost-and-found/add-lost-item",
    


    addfounditem : "http://35.200.153.72:3000/metro/v3/lost-and-found/add-found-item"
}

const allinfo = {
    static :   "http://35.200.153.72:3000/metro/v3/static-page/updateOnApp",
}
const metrolines = {
   lines :   "http://35.200.153.72:3000/metro/v3/lines?page=1&limit=300",
   station :   "http://34.93.164.215:3000/metro/v3/stations?page=1&limit=300",
   stationdetails :   "http://35.200.153.72:3000/metro/v3/stations/api/",
}

const tour = {
 guidelist : "http://35.200.153.72:3000/metro/v3/tour-guide/list",
}