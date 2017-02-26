//Takes in all the components in a pipeline and creates a graph data structure to organize dependencies
console.log("Start");

var orchestrator = require('./orchestrator.js');

var exampleComponents = [
  {name: 'A', dependencies: [], recurring: true, file: 'taskA.js'},
  {name: 'B', dependencies: ['A', 'C'], recurring: false, file: 'taskB.js'},
  {name: 'C', dependencies: [], recurring: false, file: 'taskC.js'},
  {name: 'D', dependencies: ['A'], recurring: false, file: 'taskD.js'},
  {name: 'E', dependencies: ['B'], recurring: true, file: 'taskE.js'}
];

var pipeline = [{name: 'A', setTime: false}, {name: 'E', setTime: 3000}];

orchestrator.createGraph(exampleComponents);
orchestrator.runThroughTasks(pipeline);
