
const agol = () => {
    const query = '/0/query?where=1%3D1&outFields=*&outSR=4326&f=json'
    return{        
        request_geojson: 'https://services8.arcgis.com/ItkjXcpNwMie4pPj/arcgis/rest/services/Inventory_Assessment_Request_data/FeatureServer' + query,
        request_survey: 'https://survey123.arcgis.com/share/26fe96603d354a7f8475137a87021d83',

        update_geojson: 'https://services8.arcgis.com/ItkjXcpNwMie4pPj/arcgis/rest/services/Inventory_Assessment_Update_data/FeatureServer' + query,
        update_survey: 'https://survey123.arcgis.com/share/93a49e3854ee4b3ca83edede6edf67c5',

        shipment_geojson: 'https://services8.arcgis.com/ItkjXcpNwMie4pPj/arcgis/rest/services/Inventory_Assessment_Shipment_data/FeatureServer' + query,
        shipment_survey: 'https://survey123.arcgis.com/share/1d5275ca11724435ae3f6b684fee3eb0',

        confirm_geojson: 'https://services8.arcgis.com/ItkjXcpNwMie4pPj/arcgis/rest/services/Inventory_Assessment__Confirmation_data/FeatureServer' + query,
        confirm_survey: 'https://survey123.arcgis.com/share/a61bd151a86645c1a8e5b4d7c5c79b35',
    };
};


export { agol }