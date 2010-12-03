var path = require('path'),
    sys = require('sys');

function reporter(results) {
    function escape(str) {
	      return (str) ? str.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') : '';
    }
	  var dir = process.cwd();
    var xml = '<?xml version="1.0" encoding="UTF-8" ?>\n<jslint>\n';
    for (var i = 0, len = results.length; i < len; i += 1) {
        var file = path.join(dir, results[i].file);
        error = results[i].error;
        xml += '\t<file name="' + file + '">\n' +
                '\t\t<issue char="' + error.character + '" evidence="' + escape(error.evidence || '') +
                '" line="' + error.line + '" reason="' + escape(error.reason) + '"/>\n' +
                '\t</file>\n';
    }
    xml += '</jslint>';
    sys.puts(xml);
}