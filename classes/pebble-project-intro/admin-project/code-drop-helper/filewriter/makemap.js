/* -------------------------------------------------------------------------- *
 *  Files
 * -------------------------------------------------------------------------- */

var headerfilename = 'header.txt';          // html header + boiler plate map code
var footerfilename = 'footer.txt';          // html footer + boiler plate map code
var dropfilename = 'data/codedrop.dat';     // *** The data file for code drops ***
var mapfilename = 'map.html';               // *** The generated html file ***

/* -------------------------------------------------------------------------- *
 *  Utility functions
 * -------------------------------------------------------------------------- */

// Logged data generates a mapfile (map.html); suppress stdout/stderr. 
var fs = require('fs');
var util = require('util');

var mapfile = fs.createWriteStream(mapfilename);
var logStdout = process.stdout;

console.log = function () {
  mapfile.write(util.format.apply(null, arguments) + '\n');
  // logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;

/* -------------------------------------------------------------------------- *
 *  Construct mapfile
 * -------------------------------------------------------------------------- */

function write_html_header() {
    fs.readFileSync(headerfilename).toString().split('\n').forEach(function (line) { 
        console.log(line);
    });    
}

function write_html_code_drops() {
    fs.readFileSync(dropfilename).toString().split('\n').forEach(function (line) { 
        var args = line.split(',');
        if (args.length == 3) {
            // Marker w/ pop-up already shown. 
            console.log('        L.marker([%s,%s]).addTo(mymap)', args[0], args[1]); 
            console.log('           .bindPopup("<b>%s</b> (%s,%s)").openPopup();', args[2].trim(), args[0], args[1]); 

        // L.marker([43.70586485550702, -72.2885469357321]).addTo(mymap);
            // .bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

            // Circle w/ pop-up not shown.
            // console.log('        L.circle([%s,%s], 20, {', args[0], args[1]); 
            // console.log('            color: \'red\',');
            // console.log('            fillColor: \'#f03\',');
            // console.log('            fillOpacity: 0.5');
            // console.log('        }).addTo(mymap).bindPopup(\'Active Code Drop (%s)\');', args[2].trim()); 
        }
    });    
}

function write_html_footer() {
    fs.readFileSync(footerfilename).toString().split('\n').forEach(function (line) { 
        console.log(line);
    });    
}

// Generate the mapfile.
write_html_header();
write_html_code_drops();
write_html_footer();

logStdout.write(mapfilename + ' generated!');
