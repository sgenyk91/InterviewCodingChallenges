var orchestrator = require('../orchestrator.js');

function taskC(next) {
  console.log("RUNNING TASK C");
  orchestrator.complete("C");
  if (next.length > 0) {
    var nextTask = require('./' + next.pop());
    nextTask(next);
  }
}

module.exports = taskC;