var orchestrator = require('../orchestrator.js');

function taskB(next) {
  console.log("RUNNING TASK B");
  orchestrator.complete("B");
  if (next.length > 0) {
    var nextTask = require('./' + next.pop());
    nextTask(next);
  }
}

module.exports = taskB;