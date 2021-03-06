var config = require('./config');
var ttn = require("ttn");
var key = ttn.key;
var appID = config.TTN_appID;
var accessKey = config.TTN_accessKey;

const Gpio = require('onoff').Gpio;
const relay = new Gpio(config.relay_gpio_pin, 'out');

var LastTrigger = 0;

log("Started");

ttn.data(appID, accessKey).then(function (client) {
  client.on("uplink", function (devID, payload) {

    if (config.debug) console.log(new Date().toLocaleString(), devID, payload);

    if (config.allowed_devices.indexOf(devID)>=0) {
      if (config.debug) console.log("Event of device: ", devID);

      if (payload.payload_fields.event && payload.payload_fields.event===config.TTN_event) {

        if (config.geofence.enabled) { // check gps coords geofence
            if (payload.metadata.gateways[0] && payload.metadata.gateways[0].latitude) {
                if (!checkCoords(payload.metadata.gateways[0].latitude, payload.metadata.gateways[0].longitude)) {
                log("Coordinates not in allowed range.");
                console.log("gateway", payload.metadata.gateways[0]);
                return;
                }
            }
        }

        // Prevent multiple triggers
        if (LastTrigger == 0 ||(Math.floor(new Date()/1000) - LastTrigger) > 30) {
            log(devID+" Trigger relay");
            LastTrigger = Math.floor(new Date()/1000);
            if (config.triggerenabled) {

              // Trigger relay on GPIO
                relay.writeSync(1);
                setTimeout(function() {
                  relay.writeSync(0);
                }, 1500);

            }
        } else {
            log(devID+" Trigger is still suspended");
        }
      }
    }
  })
})
.catch(function (error) {
  console.error("Error", error)
});

function checkCoords( iLat, iLng ) {
  if (iLat>=config.geofence.minLatitude && iLat<=config.geofence.maxLatitude) if (iLng>=config.geofence.minLongitude && iLng<=config.geofence.maxLongitude) return true;
  return false;
}

function log(txt) {
  console.log(new Date().toLocaleString(), "[TTN-RASPI-RELAY]", txt );
}

process.on('SIGINT', function () {
  relay.unexport();
  console.log("Goodbye");
  process.exit(1);
});