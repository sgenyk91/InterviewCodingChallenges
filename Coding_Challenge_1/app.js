/*
Steps:
0 - Remove any event elements in DOM
1 - Sort and map eventList to contain unique ID
2 - Create graph data structure for events
3 - Create array for every minute on calendar and fill each minute with array of events that occur on that minute
4 - Traverse through each minute. Get length of current minute's array and compare that to each ID's neighbor count
(also traverse through all edges of each ID)
5 - While traversing through each ID in each minute, add in leftIndent
6 - Add each event into DOM by using neighbor for width, start time for height below starting point, and leftIndent
for amount of space needed on left side of event
*/

let eventInput = [{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670}];

document.addEventListener("DOMContentLoaded", (event) => {
  layOutDay(eventInput);
});

function layOutDay(eventList) {
  //Step 0
  removeEventsFromDOM();
  //Step 1
  const eventListWithProperties = addPropertiesToEvents(eventList);
  //Step 2
  const eventGraph = createEventsGraph(eventList);
  //Step 3
  const minuteList = addEventsToMinuteList(eventList);
  //Step 4 and 5
  setNeighborAndIndent(eventListWithProperties, eventGraph, minuteList);
  //Step 6
  addEventsToDOM(eventListWithProperties);
}

//Clears out all events under the parent sap-calendarEvents-container
function removeEventsFromDOM() {
  let calendarContainer = document.getElementsByClassName("sap-calendarEvents-container")[0];
  while (calendarContainer.firstChild) {
    calendarContainer.removeChild(calendarContainer.firstChild);
  }
}

//Sorts eventList and adds id, neighbor count, and leftIndent count into a new array to prevent argument mutation
function addPropertiesToEvents(eventList) {
  let count = 0;
  return eventList.slice().sort((a, b) => a.start - b.start).map((element) => {
    element.id = count;
    element.neighbors = 0;
    element.leftIndent = -1;
    count += 1;
    return element;
  });
}

//An edge is created between two events if they have conflicting times
function createEventsGraph(eventList) {
  let newGraph = new Graph();
  for (let i = 0; i < eventList.length; i++) {
    if (!newGraph.vertices.hasOwnProperty(eventList[i].id)) {
      newGraph.addVertex(eventList[i].id);
    }
    for (let j = i + 1; j < eventList.length; j++) {
      if (!newGraph.vertices.hasOwnProperty(eventList[j].id)) {
        newGraph.addVertex(eventList[j].id);
      }
      if (eventList[i].end < eventList[j].start || eventList[i].start > eventList[j].end) {
        continue;
      } else {
        newGraph.addEdge(eventList[i].id, eventList[j].id);
      }
    }
  }
  return newGraph;
}

/*
Inserts an array for every minute in the calendar into minuteList
Iterates through eventList and inserts event into minuteList for each minute the event occupies
*/
function addEventsToMinuteList(eventList) {
  const hoursInDayCalendar = 12;
  const totalMinutes = hoursInDayCalendar * 60;
  let minuteList = [];
  //Create an array for each minute
  for (let i = 0; i <= totalMinutes; i++) {
    minuteList[i] = [];
  }
  for (let x = 0; x < eventList.length; x++) {
    for (let y = eventList[x].start; y < eventList[x].end; y++) {
      minuteList[y].push(eventList[x].id);
    }
  }
  return minuteList;
}

function setNeighborAndIndent(eventList, eventGraph, minuteList) {
  //Go through each minute
  for (let i = 0; i < minuteList.length; i++) {
    const currentLength = minuteList[i].length;
    if (currentLength) {
      //Go through each id in current minute
      let indentIndexCount = 0;
      minuteList[i].forEach((element) => {
        //Compare neighbor count to currentLength
        if (currentLength > eventList[element].neighbors) {
          eventList[element].neighbors = currentLength;
          //Traverse through each edge
          eventGraph.depthFirstSearch(element, eventList, currentLength);
        }
        //Sets leftIndent
        if (eventList[element].leftIndent === -1) {
          eventList[element].leftIndent = indentIndexCount;
          indentIndexCount += 1;
        } else if (eventList[element].leftIndent === indentIndexCount) {
          indentIndexCount += 1;
        }
      })
    }
  }
}

function addEventsToDOM(eventList) {
  let parentDiv = document.getElementsByClassName('sap-calendarEvents-container')[0];
  eventList.forEach((element) => {
    const internalTitle = createEventDescription('Sample Title', 'eventTitle');
    const internalLocation = createEventDescription('Sample Location', 'eventLocation');
    let eventDiv = createEventDiv(element);
    eventDiv.appendChild(internalTitle);
    eventDiv.appendChild(internalLocation);
    parentDiv.appendChild(eventDiv);
  })
}

function createEventDiv(element) {
  const elementHeight = element.end - element.start;
  const elementWidth = 100 / element.neighbors;
  let eventDiv = document.createElement('div');
  eventDiv.className = 'sap-calendarEvents-event';
  eventDiv.setAttribute('value', element.id);
  eventDiv.style.cssText = 'height: ' + elementHeight + 'px; top: ' + element.start + 'px; width: ' + elementWidth + '%; left: ' + (elementWidth * element.leftIndent) + '%;';
  return eventDiv;
}

function createEventDescription(text, className) {
  let eventText = document.createElement('div');
  eventText.className = 'sap-calendarEvents-' + className;
  eventText.innerHTML = text;
  return eventText;
}

//Simplified graph data structure
class Graph {
  constructor() {
    this.vertices = {};
    this.edges = {};
    this.numberOfEdges = 0;
  }
  addVertex(vertex) {
    this.vertices[vertex] = true;
    this.edges[vertex] = [];
  }
  addEdge(vertex1, vertex2) {
    this.edges[vertex1].push(vertex2);
    this.edges[vertex2].push(vertex1);
    this.numberOfEdges += 1;
  }
  depthFirstSearch(vertex, eventList, currentLength, visited = {}) {
    visited[vertex] = true;
    if (currentLength > eventList[vertex].neighbors) {
      eventList[vertex].neighbors = currentLength;
    }
    for (let i = 0; i < this.edges[vertex].length; i++) {
      if (!visited[this.edges[vertex][i]]) {
        this.depthFirstSearch(this.edges[vertex][i], eventList, currentLength, visited);
      }
    }
  }
}
