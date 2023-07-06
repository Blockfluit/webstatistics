# webstatistics
This plugin shows the in-game statistics on the web with a build in webserver. Changes are automatically updated with a fixed interval. Every statistic that is gathered in-game is visible on the web. These are statistics like how long you've played on the server, how many blocks you've mined, how many mobs you've killed, etc. This plugin also shows what a player is wearing, holding and current hp/hunger/lvl. 

 

# Installation:
Installation is as simple as dragging the .jar file into the plugins folder.
Some additional configuration may be necessary depending on your situation.

 

# First time use:
When this plugin is running you should be able to navigate to http://localhost:8234/ in your browser.
If the plugin is not running on your current device some additional configuration is necessary.

 

# Configuration:
## config.yml:
*this should be the same as the local address where your minecraft server is runnning.*

address: 127.0.0.1

*should be left alone. Unless there is already something running on this port.*

port: 8234

*this has to match the full address and protocol people would use to get to the web interface of the plugin. This is due to cors policy.
change http to https if you're using a ssl-certificate.*

domain: http://127.0.0.1:8234

