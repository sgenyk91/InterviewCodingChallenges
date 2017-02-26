var orchestrator = require('../orchestrator.js');

function taskE(next) {
  console.log("RUNNING TASK E");
  orchestrator.complete("E");
  if (next.length > 0) {
    orchestrator.runTask(next.pop(), next);
  }
}

module.exports = taskE;