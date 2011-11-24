var child_process = require('child_process'),
    path = require('path'),
    OVERRIDE_TASKS = [
        { orig: 'test', prop: 'scripts.test', repl: 'test-npm' },
        { orig: 'stop', prop: 'scripts.stop', repl: 'stop-npm' },
        { orig: 'start', prop: 'scripts.start', repl: 'start-npm' },
        { orig: 'restart', prop: 'scripts.restart', repl: 'restart-npm' }
        ];

function Bob(toolbelt, conf) {

    function plan(tasks) {
        var i, ln;
        function check(oTask) {
            if (oTask.orig === tasks[i] && toolbelt.val(conf, oTask.prop)) {
                tasks[i] = oTask.repl;
            }
        }
        for (i = 0, ln = tasks.length; i < ln; i += 1) {
            OVERRIDE_TASKS.forEach(check);
        }
        return tasks;
    }

    function build(bobDir, params, targets) {
        var command = 'make',
            args = ['-f', path.join(bobDir, 'conf/Makefile')]
                .concat(toolbelt.args(conf, params), targets),
            spawn = child_process.spawn(command, args);
        //console.error('Args: ' + args.join(' '));
        spawn.stdout.on('data', function (data) {
            process.stdout.write(data + ' ');
        });
        spawn.stderr.on('data', function (data) {
            process.stderr.write(data + ' ');
        });
        spawn.on('exit', function (code) {
            console.log(((code === 0) ? 'SUCCESS' : 'FAILURE') + ' (Exit code: ' + code + ')');
            process.exit(code);
        });
    }

    return {
        plan: plan,
        build: build
    };
}

exports.Bob = Bob;
