var orchestrator = require('../orchestrator.js');

function taskD(next) {
  console.log("RUNNING TASK D");
  orchestrator.complete("D");
  if (next.length > 0) {
    orchestrator.runTask(next.pop(), next);
  }
}

module.exports = taskD;