var fs = require('fs'),
  p = require('path');

function _read(file) {
  var data;
  // backward compatibility, existsSync moved from p to fs in Node.js v0.7.1
  if ((fs.existsSync) ? fs.existsSync(file) : p.existsSync(file)) {
    try {
      data = JSON.parse(fs.readFileSync(file));
    } catch (e) {
      console.error('%s - %s', 'Invalid JSON file'.red || 'Invalid JSON file', file);
      throw e;
    }
  }
  return data;
}

function loadCustom() {
  return _read(p.join(process.cwd(), '.bob.json'));
}

function loadPackage() {
  return _read(p.join(process.cwd(), 'package.json'));
}

function loadTasks(tasks) {
  var config = {};
  tasks.forEach(function (task) {
    config[task] = _read(p.join(__dirname, '../conf/tasks/' + task + '.json'));
  });
  return config;
}

exports.loadCustom = loadCustom;
exports.loadPackage = loadPackage;
exports.loadTasks = loadTasks;