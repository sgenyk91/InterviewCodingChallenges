//Simplified graph data structure
function Graph() {
  this.components = {};
}

function GraphNode(name, file, recurring) {
  this.name = name;
  this.dependencies = [];
  this.recurring = recurring;
  this.file = file;
  this.executed = false;
}

Graph.prototype.addComponent = function(component) {
  var newNode = new GraphNode(component.name, component.file, component.recurring);
  this.components[component.name] = newNode;
};

Graph.prototype.addDependency = function(component, dependentOn) {
  this.components[component.name].dependencies.push(dependentOn);
}

module.exports = Graph;