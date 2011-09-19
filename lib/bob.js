var child_process = require('child_process');

function Bob(toolbelt, conf) {

    function build(bobDir, params, targets) {
        var command = 'make -f ' + bobDir + '/conf/Makefile '
                + toolbelt.args(conf, params)
                + ' ' + targets.join(' '),
            exec;
        //console.log("Command:" + command);
        exec = child_process.exec(command,
            function (error, stdout, stderr) {
                if (error) {
                    console.error(error.message);
                } else {
                    console.log(stdout);
                }
            });
    }

    return {
        build: build
    };
}

exports.Bob = Bob;
