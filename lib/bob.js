var child_process = require('child_process'),
    path = require('path');

function Bob(toolbelt, conf) {

    function build(bobDir, params, targets) {
        var command = 'make',
            args = ['-f', path.join(bobDir, 'conf/Makefile')]
                .concat(toolbelt.args(conf, params), targets),
            spawn = child_process.spawn(command, args);
        //console.error('Args: ' + args.join(' '));
        spawn.stdout.on('data', function (data) {
            console.log(data + ' ');
        });
        spawn.stderr.on('data', function (data) {
            console.error(data + ' ');
        });
        spawn.on('exit', function (code) {
            console.log('Exit code ' + code);
            process.exit(code);
        });
    }

    return {
        build: build
    };
}

exports.Bob = Bob;
