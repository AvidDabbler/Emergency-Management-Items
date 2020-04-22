import { agol } from './private.js';
import { check_for_data, requestList, make_request } from './survey.js';
import { facilities } from './assets/facilities.js'

(async () => {    
    
    // JAVASCRIPT VARIABLES
    let inventory, requestDate
    
    
    //JSON URLS
    const requestGeo = agol().request_geojson;
    const confirmSur = agol().confirm_survey;
    
    
    //HTML SECTION SELECTORS
    const list = document.querySelector('#list');
    
    
    //POLYFILLS
    if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    }if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
          var el = this;
          do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
          } while (el !== null && el.nodeType === 1);
          return null;
    }};
    
    
    const refresh = () => {
        requestList(requestGeo)
        .then(rdata => list.innerHTML = rdata)
    };
    
    const request_event = (event) => {
        const get_data = (el) => {
            return `${event.target.closest('.openpop').getAttribute(el)}`
        }
        return{
            oid: get_data('data-oid'),
            facility: get_data('data-facility'),
            masks: get_data('data-masks'),
            sanitizers: get_data('data-sanitizers'),
            lysols: get_data('data-lysols'),

        }
    };    



    
    const clickEvent = (event) => {
        const eve = request_event(event);

        // TARGET VARIABLES
        const iframe_target = event.target.closest('#ifrm');
        const iframe = document.getElementById('ifrm');
        const iframe_div = document.getElementById('ifrm');
        const back = event.target.closest('#back');
        const link = event.target.closest('.link');
        const request_item = event.target.closest('.openpop');
        const refresh_target = event.target.closest('#refresh');
        let url = `${confirmSur}?field:requesting_facility=${eve.facility}&field:request_id=${eve.oid}&field:confirmed_masks=${eve.masks}&field:confirmed_lysols=${eve.lysols}&field:confirmed_sanitizers=${eve.sanitizers}`;

        console.log(event)
        if(!link){
            event.preventDefault();
        }
        if(event.target.closest == null && iframe_div){
            iframe_div.parentNode.removeChild(iframe_div);
        }else if (refresh_target){  
            refresh();
        }else if(request_item){    
            make_request('list', url);
        }else{
            console.error('Unregistered Click');
            return;
        }
    };
    
    refresh();

    // refresh every 2 minutes
    setInterval(
        () => {
           refresh()
            console.log('refresh')
        }, 120000);
    
    window.addEventListener("click", clickEvent, false);

})();
