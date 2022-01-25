"use strict"
import Bob from '../lib/bob.js';
import bagofcli from 'bagofcli';
import cli from '../lib/cli.js';
import fs from 'fs';
import p from 'path';
import sinon from 'sinon';
import referee from '@sinonjs/referee';

describe('testcli - exec', function() {

  beforeEach(function () {
    this.mockConsole = sinon.mock(console);
    this.mockFs = sinon.mock(fs);
    this.mockProcess = sinon.mock(process);

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
  });

  afterEach(function () {
    this.mockConsole.verify();
    this.mockConsole.restore();
    this.mockFs.verify();
    this.mockFs.restore();
    this.mockProcess.verify();
    this.mockProcess.restore();
  });
    
  it('should contain commands with actions', function () {
    this.mockConsole.expects('log').withExactArgs('%s | exit code 0', 'SUCCESS'.green);
    this.mockProcess.expects('exit').withExactArgs(0);

    this.bobJson.alias2 = 'task2';
    sinon.stub(process, 'argv').value(['bob', 'task1', 'alias2']);
    sinon.stub(bagofcli, 'command').value(function (base, actions) {
      actions.commands.task1.action({
        _name: 'task2',
        parent: { quiet: false }
      });
    });

    sinon.stub(Bob.prototype, 'build').value(function (tasks, cb) {
      referee.assert.equals(tasks, ['task2']);
      cb();
    });

    // twice because this test is against cli.js while using real cli.js
    this.mockFs.expects('readFileSync').once().withExactArgs(p.join(process.cwd(), './conf/commands.json')).returns(JSON.stringify(this.commandsJson));
    this.mockFs.expects('readFileSync').withExactArgs(p.join(process.cwd(), './.bob.json')).returns(JSON.stringify(this.bobJson));
    this.mockFs.expects('readFileSync').withExactArgs(p.join(process.cwd(), './package.json')).returns(JSON.stringify(this.packageJson));

    referee.assert.equals(1, 1);
    cli.exec();
  });

  it('should log error message when an error occured and there is no error code', function () {
    this.mockConsole.expects('error').withExactArgs('%s | %s', 'ERROR'.red, 'some error');
    this.mockProcess.expects('exit').withExactArgs(1);

    sinon.stub(process, 'argv').value(['bob', 'task1', 'task2']);
    sinon.stub(bagofcli, 'command').value(function (base, actions) {
      actions.commands.task1.action({
        _name: 'task2',
        parent: { quiet: false }
      });
    });

    sinon.stub(Bob.prototype, 'build').value(function (tasks, cb) {
      referee.assert.equals(tasks, ['task2']);
      cb(new Error('some error'));
    });

    // twice because this test is against cli.js while using real cli.js
    this.mockFs.expects('readFileSync').once().withExactArgs(p.join(process.cwd(), './conf/commands.json')).returns(JSON.stringify(this.commandsJson));
    this.mockFs.expects('readFileSync').withExactArgs(p.join(process.cwd(), './.bob.json')).returns(JSON.stringify(this.bobJson));
    this.mockFs.expects('readFileSync').withExactArgs(p.join(process.cwd(), './package.json')).returns(JSON.stringify(this.packageJson));

    referee.assert.equals(1, 1);
    cli.exec();
  });

  it('should log failure message when an error occured with exit code', function () {
    this.mockConsole.expects('error').withExactArgs('%s | exit code %d', 'FAILURE'.red, 123);
    this.mockProcess.expects('exit').withExactArgs(123);
    this.mockProcess.expects('exit').withExactArgs(1);

    sinon.stub(process, 'argv').value(['bob', 'task1', 'task2']);
    sinon.stub(bagofcli, 'command').value(function (base, actions) {
      actions.commands.task1.action(
        {
          _name: 'task1',
          parent: { quiet: false }
        },
        'task2'
      );
    });

    sinon.stub(Bob.prototype, 'build').value(function (tasks, cb) {
      referee.assert.equals(tasks, ['task1', 'task2']);
      cb({ code: 123 });
    });

    // twice because this test is against cli.js while using real cli.js
    this.mockFs.expects('readFileSync').once().withExactArgs(p.join(process.cwd(), './conf/commands.json')).returns(JSON.stringify(this.commandsJson));
    this.mockFs.expects('existsSync').withExactArgs(p.join(process.cwd(), './.bob.json')).returns(false);
    this.mockFs.expects('readFileSync').withExactArgs(p.join(process.cwd(), './package.json')).returns(JSON.stringify(this.packageJson));

    referee.assert.equals(1, 1);
    cli.exec();
  });
});
