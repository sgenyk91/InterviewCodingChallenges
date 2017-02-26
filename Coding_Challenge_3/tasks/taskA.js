var orchestrator = require('../orchestrator.js');

function taskA(next) {
  console.log("RUNNING TASK A");
  orchestrator.complete("A");
  if (next.length > 0) {
    var nextTask = require('./' + next.pop());
    nextTask(next);
  }
}

module.exports = taskA;