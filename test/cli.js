var Bob = new require('../lib/bob'),
  buster = require('buster-node'),
  _cli = require('bagofcli'),
  cli = require('../lib/cli'),
  colors = require('colors'),
  fs = require('fs'),
  p = require('path'),
  referee = require('referee'),
  assert = referee.assert;

buster.testCase('testcli - exec', {
  setUp: function () {
    this.mockConsole = this.mock(console);
    this.mockFs = this.mock(fs);
    this.mockProcess = this.mock(process);

    this.commandsJson = {
      commands: {
        task1: { desc: 'task1 desc' },
        task2: { desc: 'task2 desc' }
      }
    };
    this.bobJson = {
      task2: { type: 'type2' }
    };
    this.packageJson = {
      name: 'someapp',
      version: '1.2.3'
    };
  },
  'should contain commands with actions': function () {
    this.mockConsole.expects('log').withExactArgs('%s | exit code 0', 'SUCCESS'.green);
    this.mockProcess.expects('exit').withExactArgs(0);

    this.bobJson.alias2 = 'task2';
    this.stub(process, 'argv', ['bob', 'task1', 'alias2']);
    this.stub(_cli, 'command', function (base, actions) {
      actions.commands.task1.action({
        _name: 'task2',
        parent: { quiet: false }
      });
    });

    this.stub(Bob.prototype, 'build', function (tasks, cb) {
      assert.equals(tasks, ['task2']);
      cb();
    });

    // twice because this test is against cli.js while using real cli.js
    this.mockFs.expects('readFileSync').once().withExactArgs(p.join(__dirname, '../../bob/conf/commands.json')).returns(JSON.stringify(this.commandsJson));
    this.mockFs.expects('readFileSync').withExactArgs(p.join(__dirname, '../../bob/.bob.json')).returns(JSON.stringify(this.bobJson));
    this.mockFs.expects('readFileSync').withExactArgs(p.join(__dirname, '../../bob/package.json')).returns(JSON.stringify(this.packageJson));

    assert.equals(1, 1);
    cli.exec();
  },
  'should log error message when an error occured and there is no error code': function () {
    this.mockConsole.expects('error').withExactArgs('%s | %s', 'ERROR'.red, 'some error');
    this.mockProcess.expects('exit').withExactArgs(1);

    this.stub(process, 'argv', ['bob', 'task1', 'task2']);
    this.stub(_cli, 'command', function (base, actions) {
      actions.commands.task1.action({
        _name: 'task2',
        parent: { quiet: false }
      });
    });

    this.stub(Bob.prototype, 'build', function (tasks, cb) {
      assert.equals(tasks, ['task2']);
      cb(new Error('some error'));
    });

    // twice because this test is against cli.js while using real cli.js
    this.mockFs.expects('readFileSync').once().withExactArgs(p.join(__dirname, '../../bob/conf/commands.json')).returns(JSON.stringify(this.commandsJson));
    this.mockFs.expects('readFileSync').withExactArgs(p.join(__dirname, '../../bob/.bob.json')).returns(JSON.stringify(this.bobJson));
    this.mockFs.expects('readFileSync').withExactArgs(p.join(__dirname, '../../bob/package.json')).returns(JSON.stringify(this.packageJson));

    assert.equals(1, 1);
    cli.exec();
  },
  'should log failure message when an error occured with exit code': function () {
    this.mockConsole.expects('error').withExactArgs('%s | exit code %d', 'FAILURE'.red, 123);
    this.mockProcess.expects('exit').withExactArgs(123);
    this.mockProcess.expects('exit').withExactArgs(1);

    this.stub(process, 'argv', ['bob', 'task1', 'task2']);
    this.stub(_cli, 'command', function (base, actions) {
      actions.commands.task1.action('task1',
        {
          _name: 'task2',
          parent: { quiet: false }
        }
      );
    });

    this.stub(Bob.prototype, 'build', function (tasks, cb) {
      assert.equals(tasks, ['task2', 'task1']);
      cb({ code: 123 });
    });

    // twice because this test is against cli.js while using real cli.js
    this.mockFs.expects('readFileSync').once().withExactArgs(p.join(__dirname, '../../bob/conf/commands.json')).returns(JSON.stringify(this.commandsJson));
    this.mockFs.expects('existsSync').withExactArgs(p.join(__dirname, '../../bob/.bob.json')).returns(false);
    this.mockFs.expects('readFileSync').withExactArgs(p.join(__dirname, '../../bob/package.json')).returns(JSON.stringify(this.packageJson));

    assert.equals(1, 1);
    cli.exec();
  }
});
