import { facilities } from './assets/facilities.js'
const facil = facilities();

// INTERACTIVE HELPER FUNCTIONS
const clear_div = async (div) => {
    div.innerHTML = '';
    return;
};



// DATA HELPER FUNCTIONS
const newest_date = (data) => {
    let newest;
    for(let i = 0; i < data.features.length; i++){
        if (i == 0 || data.features[i].attributes.CreationDate > newest.attributes.CreationDate){
            newest = data.features[i];
        }
    };
    return newest;
};

const fetch_json = async (url) => {
    const response = await fetch(url);
    const json = await response.json();
    return await json;
};

const newest = (array, date) => {
    let newest = []

    if(array.length == 0){

    }else{
        for(let i = 0; i < array.features.length; i++){
            if(array.features[i].attributes.CreationDate > date){
                newest.push(array.features[i]);
            }
        };
    }
    return newest;
};

const fetch_newest = async (url, date) => {
        let data = await fetch_json(url);
        for(let i in data.features){
            data.features[i].attributes['requesting_facility_text'] = facil[data.features[i].attributes.requesting_facility];
        }

        return newest(data, date)
};


const total = (update, shipment, confirmation) => {
    const list = ['masks', 'sanitizers', 'lysols'];
    
    let obj = {};
    let time = update.attributes.CreationDate;
    for(let i = 0; i < list.length; i++){
        let item = list[i];
        let ship =  shipment[item] ? shipment[item] : 0;
        let confirm = confirmation[item] ? confirmation[item] : 0;
        let upd = update.attributes[`total_${item}`] ? update.attributes[`total_${item}`] : 0;
        
        obj[item] = (upd + ship) - confirm;
    }
    let time_list = [shipment, confirmation];

    let i= 0;
    for (let item of time_list){
        if( i == 0 ||  item.time > time){
            time = item.time;
        }
        i += 1;

    }
    return obj; 

};


// DATA APPLICATION FUNCTIONS
const get_survey_data = async (requestGeo, updateGeo, shipmentGeo, confirmGeo) => {

    // GET THE TIME OF THE LAST INVENTORY UPDATE
    const update = async () => {
        let data = await fetch_json(updateGeo);
        data = await newest_date(data);

        return data;
    };

    let updateObj = await update();

    // GET YOU SOME DATA!!!
    const request_data = await fetch_newest(requestGeo, updateObj.attributes.CreationDate);
    const confirm_data = await fetch_newest(confirmGeo, updateObj.attributes.CreationDate);
    const shipment_data = await fetch_newest(shipmentGeo, updateObj.attributes.CreationDate);

    // THE LATEST NUMBERS ARE CALCULATED AS FOLLOWS (UPDATE.item + SHIPMENT_DATA.item) - CONFIRMATION_DATA.item 
    const shipmentCalc = async () => {
        const calc = () => {
            let masks = 0;
            let sanitizers = 0;
            let lysols = 0;
            let time;

            for(let i = 0; i < shipment_data.length; i++){
                if(i == 0 || time < shipment_data[i].attributes.CreationDate ){
                    time = shipment_data[i].attributes.CreationDate;
                }

                masks += shipment_data[i].attributes.shipped_masks;
                sanitizers += shipment_data[i].attributes.shipped_sanitizers;
                lysols += shipment_data[i].attributes.shipped_lysols;
                
            }
            return {
                'time': time,
                'masks': masks,
                'sanitizers': sanitizers,
                'lysols': lysols,
            };
        };


        return await calc();
    };

    const confirmationCalc = async () => {
        const calc = () => {
            let masks = 0;
            let sanitizers = 0;
            let lysols = 0;
            let time;

            for(let i = 0; i < confirm_data.length; i++){

                if(i == 0 || time < confirm_data[i].attributes.CreationDate ){
                    time = confirm_data[i].attributes.CreationDate;
                }

                masks += confirm_data[i].attributes.confirmed_masks;
                sanitizers += confirm_data[i].attributes.confirmed_sanitizers;
                lysols += confirm_data[i].attributes.confirmed_lysols; 
            }    
        return {
            'time': time,
            'masks': masks,
            'sanitizers': sanitizers,
            'lysols': lysols,
        }
    }
        return await calc();
    };

    const shipmentTotal = await shipmentCalc();
    const confirmationTotal = await confirmationCalc();
    const t = await total(updateObj, shipmentTotal, confirmationTotal);

    return {
        'total': t,
        'request': request_data, 
        'shipping': shipment_data, 
        'confirmation': confirm_data,
        'update': updateObj,
    }
};

let formatted_time = () => {
    let d = new Date();
    let hours = () => {
        if (d.getHours() > 12){
            return {
                hours: d.getHours() - 12,
                ampm: ' PM',
            }
        }else{
            return{
                hours: d.getHours(),
                ampm: ' AM',
            }
        }
    };    
    return leadingZero(d.getMonth())+ '-' + leadingZero(d.getDate()) + '-' + d.getFullYear() + ' ' + leadingZero(hours().hours) + ':' + leadingZero(d.getMinutes()) + ':' + leadingZero(d.getSeconds()) + hours().ampm ;
};

let leadingZero = (num) => {
    if(num<10){
        return '0' + num;
    }
    else{
        return num;
    }
};

const inventory_render = async (d, mask, lysol, sanitizer, time) => {
    mask.innerText = d.masks;
    lysol.innerText = d.lysols;
    sanitizer.innerText = d.sanitizers;
    time.innerText = formatted_time();

};


const check_for_data = async (requestGeo, updateGeo, shipmentGeo, confirmGeo) => {
    let data;
        data = await get_survey_data(requestGeo, updateGeo, shipmentGeo, confirmGeo)
    return data;
};

const requestList = async (url) => {
    const response = await fetch(url);
    const json = await response.json();
    const request = json.features;
    
    let html = ''

    console.log(request);
    request.sort((a,b)=>{
        if(a.attributes.CreationDate > b.attributes.CreationDate){
            return -1;
        }else if(a.attributes.CreationDate < b.attributes.CreationDate){
            return 1;
        }else{
            return 0;
        }
    })
    request.forEach(feature => {
        let d = new Date(feature.attributes.CreationDate);

        const featureDate = () =>{

            let hours = () => {
                if (d.getHours(d) > 12){
                    return {
                        hours: d.getHours() - 12,
                        ampm: ' PM',
                    }
                }else{
                    return{
                        hours: d.getHours(),
                        ampm: ' AM',
                    }
                }
            };    
            return d.getMonth() + '-' + d.getDate() + '-' + d.getFullYear() + ' ' + leadingZero(hours().hours) + ':' + leadingZero(d.getMinutes()) + ':' + leadingZero(d.getSeconds()) + hours().ampm ;
        };

        feature.attributes['requesting_facility_text'] = facil[feature.attributes.requesting_facility];

        html += 
        `<div id='${feature.attributes.globalid}' class='button_popup w-90 center dib'> 
            <a class = 'openpop center w-100 link dim br2 ph3 pv2 mb2 dib white bg-blue' 
            data-oid = "${feature.attributes.objectid}" data-masks=${feature.attributes.requesting_masks} data-lysols=${feature.attributes.requesting_lysols} data-sanitizers="${feature.attributes.requesting_sanitizers}" data-facility="${feature.attributes.requesting_facility.toString()}">

                <p class='f5 helvetica w-100'><b>Facility: </b>${feature.attributes.requesting_facility_text}</p>
                <p class='f6 helvetica w-100'><b>Date/Time: </b>${featureDate()}</p>
            </a>
        </div>`
    });

    
    return html;

};

const iframe_gen = (divid, url) => {
    const div = document.getElementById(divid);
    var ifrm = document.createElement('iframe');
    ifrm.setAttribute('id', 'ifrm'); // assign an id
    ifrm.setAttribute(`src`, url);

    var button = document.createElement('div');
    button.setAttribute('id', 'close'); // assign an id
    button.setAttribute('class', 'w-100 center');
    button.innerHTML = "<a id='close-survey' class='center w-60 helvetica f3 link br2 pv3 mb3 dib white bg-dark-red'>Close</a>";


    // to place before another page element
    var el = document.getElementById('marker');
    div.parentNode.insertBefore(ifrm, el);
    div.parentNode.insertBefore(button, el)

};

export { inventory_render, get_survey_data, clear_div, check_for_data, requestList, iframe_gen }