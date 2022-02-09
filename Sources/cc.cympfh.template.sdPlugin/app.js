/* global $CC, Utils, $SD */
$SD.on('connected', (jsonObj) => connected(jsonObj));

function connected(jsn) {
    // Subscribe to the willAppear and other events
    $SD.on('cc.cympfh.template.action.willAppear', (jsonObj) => action.onWillAppear(jsonObj));
    $SD.on('cc.cympfh.template.action.willDisappear', (jsonObj) => action.onWillDisappear(jsonObj));
    $SD.on('cc.cympfh.template.action.keyUp', (jsonObj) => action.onKeyUp(jsonObj));
    $SD.on('cc.cympfh.template.action.keyDown', (jsonObj) => action.onKeyDown(jsonObj));
    $SD.on('cc.cympfh.template.action.sendToPlugin', (jsonObj) => action.onSendToPlugin(jsonObj));
    $SD.on('cc.cympfh.template.action.didReceiveSettings', (jsonObj) => action.onDidReceiveSettings(jsonObj));
    $SD.on('cc.cympfh.template.action.propertyInspectorDidAppear', (jsonObj) => {
        console.log('%c%s', 'color: white; background: black; font-size: 13px;', '[app.js]propertyInspectorDidAppear:');
    });
    $SD.on('cc.cympfh.template.action.propertyInspectorDidDisappear', (jsonObj) => {
        console.log('%c%s', 'color: white; background: red; font-size: 13px;', '[app.js]propertyInspectorDidDisappear:');
    });
};

// ACTIONS
const action = {
    settings: {},
    onDidReceiveSettings: function(jsn) {
        this.debug(jsn, 'onDidReceiveSettings', 'red');
        this.settings = Utils.getProp(jsn, 'payload.settings', {});
        this.debug(this.settings);
    },

    onWillAppear: function(jsn) {
        this.debug(jsn, 'onWillAppear', 'orange');
        this.debug(this.settings);
        let pos = jsn.payload.coordinates;
        this.setTitle(jsn, `[${pos.row}, ${pos.column}]`);
    },

    onWillDisappear: function(jsn) {
        this.debug(jsn, 'onWillDisappear', 'pink');
        this.debug(this.settings);
    },

    onKeyDown: function(jsn) {
        this.debug(jsn, 'onKeyDown', 'blue');
        this.debug(this.settings);
        const baseURL = 'http://httpbin.org/get';
        fetch(baseURL)
            .then(resp => resp.json())
            .then(data => this.setTitle(jsn, data.origin));
    },

    onKeyUp: function(jsn) {
        this.debug(jsn, 'onKeyUp', 'green');
        this.debug(this.settings);
    },

    onSendToPlugin: function(jsn) {
        const sdpi_collection = Utils.getProp(jsn, 'payload.sdpi_collection', {});
        if (sdpi_collection.value && sdpi_collection.value !== undefined) {
            this.debug({ [sdpi_collection.key] : sdpi_collection.value }, 'onSendToPlugin', 'fuchsia');
        }
    },

    saveSettings: function(jsn, sdpi_collection) {
        console.log('saveSettings:', jsn);
        if (sdpi_collection.hasOwnProperty('key') && sdpi_collection.key != '') {
            if (sdpi_collection.value && sdpi_collection.value !== undefined) {
                this.settings[sdpi_collection.key] = sdpi_collection.value;
                console.log('setSettings....', this.settings);
                $SD.api.setSettings(jsn.context, this.settings);
            }
        }
    },

    setTitle: function(jsn, title) {
        this.debug(`Set title=${title}`, 'setTitle');
        $SD.api.setTitle(jsn.context, title);
    },

    debug: function(msg, caller, tagColor) {
        if (caller) {
            console.log('%c%s', `color: white; background: ${tagColor || 'grey'}; font-size: 15px;`, `[${caller}]`);
        }
        console.log(msg);
    },


};

