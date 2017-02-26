var Graph = require('./customGraph.js');
var CronJob = require('cron').CronJob;

var newGraph = new Graph();

var orchestrator = {
  createGraph: createGraph,
  runThroughTasks: runThroughTasks,
  runTask: runTask,
  complete: complete
}

function createGraph(components) {
  components.forEach(function(component) {
    newGraph.addComponent(component);
    component.dependencies.forEach(function(dependency) {
      newGraph.addDependency(component, dependency);
    });
  });
}

function runThroughTasks(taskArray) {
  taskArray.forEach(function(element) {
    if (element.setTime > 0) {
      job = new CronJob(new Date(Date.now() + element.setTime), function() {
        runTask(element.name, []);
      });
      job.start();
    } else {
      runTask(element.name, []);
    }
  });
}

function runTask(taskName, next) {
  var canRun = true;
  var component = newGraph.components[taskName];
  if (component.executed && !component.recurring) {
    console.log("Task already completed");
  } else {
    if (component.dependencies.length > 0) {
      component.dependencies.forEach(function(dependency) {
        if (!newGraph.components[dependency].executed) {
          canRun = false;
          next.push(component.file);
          runTask(dependency, next);
        }
      })
    }
    if (canRun) {
      var executeTask = require('./tasks/' + component.file);
      executeTask(next);
    }
  }
}

function complete(taskName) {
  newGraph.components[taskName].executed = true;
}

module.exports = orchestrator;