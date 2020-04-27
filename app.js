// import { agol } from './private.js';
import { agol } from './personal_agol.js';
import { inventory_render, get_survey_data, clear_div, check_for_data, iframe_gen } from './survey.js';
// test

(function (){    
    
    // JAVASCRIPT VARIABLES
    let inventory
    
    //JSON URLS
    const requestGeo = agol().request_geojson;
    const updateGeo = agol().update_geojson;
    const shipmentGeo = agol().shipment_geojson;
    const confirmGeo = agol().confirm_geojson;
    

    //SURVEY URLS
    const requestSur = agol().request_survey;
    const updateSur = agol().update_survey;
    const shipmentSur = agol().shipment_survey;
    
    
    //HTML SECTION SELECTORS
    const iframe_div = document.getElementById('ifrm');
    const main = document.querySelector('#main');
    const num_masks = document.querySelector('#num-masks');
    const num_lysol = document.querySelector('#num-lysol');
    const num_sanitizers = document.querySelector('#num-sanitizer');
    const update_time = document.querySelector('#update-time');
    
    
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
        check_for_data(requestGeo, updateGeo, shipmentGeo, confirmGeo)
        .then(data => {
            localStorage.setItem('data', JSON.stringify(data));
            inventory_render(data.total, num_masks, num_lysol, num_sanitizers, update_time);
            return data;
        });
    };



    
    const clickEvent = (event) => {
        
        // TARGET VARIABLES
        const iframe_div = document.getElementById('ifrm');
        const close_div = document.getElementById('close');
        
        const def = event.target.closest('.def');
        const refresh_click = event.target.closest('#refresh');
        const request_target = event.target.closest('#request');
        const shipping_target = event.target.closest('#shipping');
        const update_target = event.target.closest('#update');

        if(!def){
            event.preventDefault();
        }
    
        if(event.target.id == 'close-survey'){
            iframe_div.parentNode.removeChild(iframe_div);
            close_div.parentNode.removeChild(close_div);
        }else if(request_target){
            iframe_gen('main', requestSur);
        }else if(shipping_target){
            iframe_gen('main', shipmentSur);
        }else if(update_target){
            iframe_gen('main', updateSur);
        }else if(refresh_click){
            refresh();
        }else{
            return;
        }
    };
    
    refresh();

    // refresh every 2 minutes
    setInterval(
        () => {
           refresh()
        }, 120000);
    
    window.addEventListener("click", clickEvent, false);

})();
