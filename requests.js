// import { agol } from './private.js';
import { agol } from './personal_agol.js';
import { requestList, iframe_gen } from './survey.js';
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
        
        // TARGET VARIABLES
        const iframe_div = document.getElementById('ifrm');
        const close_div = document.getElementById('close');
        
        const link = event.target.closest('.link');
        const request_item = event.target.closest('.openpop');
        const refresh_target = event.target.closest('#refresh');
        
        
        console.log(event)
        if(!link){
            event.preventDefault();
        }
        if(event.target.id == 'close-survey'){
            iframe_div.parentNode.removeChild(iframe_div);
            close_div.parentNode.removeChild(close_div);
            
        }else if (refresh_target){  
            refresh();
        }else if(request_item){    
            const eve = request_event(event);
            let url = `${confirmSur}?field:requesting_facility=${eve.facility}&field:request_id=${eve.oid}&field:confirmed_masks=${eve.masks}&field:confirmed_lysols=${eve.lysols}&field:confirmed_sanitizers=${eve.sanitizers}`;
            iframe_gen('list', url);
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
