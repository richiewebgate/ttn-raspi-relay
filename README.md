# ttn-raspi-relay

Node.JS server to control a relay connected to raspi via TheThingsNetwork. 
This is used to act as a "long range" garage door opener, but of course can be used for other purposes as well. 

- Copy config.js.sample to config.js and adjust your settings
- use pm2-process.json to configure startup in PM2

# Configuration
Copy config.js.sample to config.js and adjust your settings.
config.js is listed in .gitignore and will not be overwritten when you pull from the git repository. 

- "triggerenabled" -> enable or disable GPIO relay (for testing)
- "TTN_appID": -> enter your ttn app id
- "TTN_accessKey": -> enter your ttn access key
- "TTN_event": name of the payload event to listen for
- "relay_gpio_pin": GPIO pin number where your relay is attached
- "allowed_devices": array of allowed devices names to trigger the relay
- "geofence": you can limit the allowed region to gps coordinates (of the receiving ttn gateway)

# Install PM2 process manager
Optional: You can use PM2 to run this script automatically on each reboot.

$ sudo npm install pm2 -g

$ pm2 startup

[PM2] Init System found: systemd
[PM2] To setup the Startup Script, copy/paste the following command:

sudo env PATH=$PATH:/bin /lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi

$ pm2 start pm2-process.json

$ pm2 list 

$ pm2 save