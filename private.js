
const agol = () => {
    return{
        request_geojson: 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/arcgis/rest/services/Emergency_Management_Inventory_Request_v2_dataview/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json',
        request_survey: 'https://survey123.arcgis.com/share/37b3572b854a494aa2150ba87b8ad6a3',

        update_geojson: 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/arcgis/rest/services/Emergency_Management_Inventory_Update_v1_dataview/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json',
        update_survey: 'https://survey123.arcgis.com/share/6a1fe0bbbc3f47e4b64ca31b6d7f18ea',

        shipment_geojson: 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/arcgis/rest/services/Emergency_Management_Inventory_Shipment_v2/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json',
        shipment_survey: 'https://survey123.arcgis.com/share/1c0bcbdb7ed34c729f0d4a705f26e407',

        confirm_geojson: 'https://services2.arcgis.com/ZV8Mb62EedSw2aTU/arcgis/rest/services/Emergency_Management_Inventory_Confirmation_v2_dataview/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json',
        confirm_survey: 'https://survey123.arcgis.com/share/e2dcdfc93d814a998cb82aa17d3f3d21',
    };
};


export { agol }