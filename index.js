let processes = [
  {
    id: 0,
    arrivalTime: 0,
    burstTime: 5,
    priority: 0,
    startTime: 0,
    waitingTime: 0,
    remainingTime: 0,
    completionTime: 0,
    turnAroundTime: 0,
    color: "rgba(250, 238, 147, 0.5)",
  },
  {
    id: 1,
    arrivalTime: 3,
    burstTime: 4,
    priority: 0,
    startTime: 0,
    waitingTime: 0,
    remainingTime: 0,
    completionTime: 0,
    turnAroundTime: 0,
    color: "rgba(255, 143, 240, 0.5)",
  },
];

let fcfsArray,
  sjfArray,
  roundRobinArray,
  priorityArray,
  chartData,
  time_quantum = 2;

function random_rgba() {
  var o = Math.round,
    r = Math.random,
    s = 255;
  return (
    "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + "," + 0.5 + ")"
  );
}

const fcfs = () => {
  fcfsArray = [...processes];
  for (let i = 0; i < processes.length; i++) fcfsArray[i] = { ...processes[i] };
  fcfsArray.sort((a, b) => a.arrivalTime - b.arrivalTime);
  var processIds = "<th style='background-color: #eee;'>Process</th>",
    executionTime = "<th style='background-color: #eee;'>Execution Time</th>";

  for (let i = 0; i < fcfsArray.length; i++) {
    if (i > 0)
      fcfsArray[i].startTime =
        fcfsArray[i - 1].startTime + fcfsArray[i - 1].burstTime;
    else fcfsArray[0].startTime = 0;
    if (fcfsArray[i].startTime < fcfsArray[i].arrivalTime) {
      processIds +=
        '<th style="height: 60px; background-color: #eee; width: ' +
        (fcfsArray[i].arrivalTime - fcfsArray[i].startTime) * 20 +
        'px;">Idle</th>';
      executionTime +=
        "<td style='background-color: #eee;'>" +
        (fcfsArray[i].arrivalTime - fcfsArray[i].startTime) +
        "</td>";
      fcfsArray[i].startTime = fcfsArray[i].arrivalTime;
    }
    fcfsArray[i].waitingTime =
      fcfsArray[i].startTime - fcfsArray[i].arrivalTime;
    if (fcfsArray[i].waitingTime < 0) fcfsArray[i].waitingTime = 0;
    fcfsArray[i].turnAroundTime =
      fcfsArray[i].burstTime + fcfsArray[i].waitingTime;
    fcfsArray[i].completionTime =
      fcfsArray[i].turnAroundTime + fcfsArray[i].arrivalTime;

    processIds +=
      '<th style="height: 60px; background-color: ' +
      fcfsArray[i].color +
      "; width: " +
      fcfsArray[i].burstTime * 20 +
      'px;">P' +
      fcfsArray[i].id +
      "</th>";
    executionTime +=
      "<td style='background-color: " +
      fcfsArray[i].color +
      ";'>" +
      fcfsArray[i].burstTime +
      "</td>";
  }

  $(".fcfs-div").append(
    '<table class="result-table"><tr>' +
      processIds +
      "</tr><tr>" +
      executionTime +
      "</tr></table>"
  );
};

const sjf = () => {
  sjfArray = [...processes];
  for (let i = 0; i < processes.length; i++) sjfArray[i] = { ...processes[i] };
  sjfArray.sort((a, b) => {
    if (a.arrivalTime === b.arrivalTime) return a.burstTime - b.burstTime;
    return a.arrivalTime - b.arrivalTime;
  });

  let temp = 0,
    val = -1;
  sjfArray[0].completionTime = sjfArray[0].arrivalTime + sjfArray[0].burstTime;
  sjfArray[0].turnAroundTime =
    sjfArray[0].completionTime - sjfArray[0].arrivalTime;
  sjfArray[0].waitingTime = sjfArray[0].turnAroundTime - sjfArray[0].burstTime;

  var processIds = "<th style='background-color: #eee;'>Process</th>",
    executionTime = "<th style='background-color: #eee;'>Execution Time</th>";

  for (let i = 0; i < sjfArray.length; i++) {
    val = -1;
    if (i > 0) temp = sjfArray[i - 1].completionTime;
    let low = sjfArray[i].burstTime;
    for (let j = i; j < sjfArray.length; j++) {
      if (temp >= sjfArray[j].arrivalTime && low >= sjfArray[j].burstTime) {
        low = sjfArray[j].burstTime;
        val = j;
      }
    }
    if (val === -1) {
      processIds +=
        '<th style="height: 60px; background-color: #eee; width: ' +
        (sjfArray[i].arrivalTime - temp) * 20 +
        'px;">Idle</th>';
      executionTime +=
        "<td style='background-color: #eee;'>" +
        (sjfArray[i].arrivalTime - temp) +
        "</td>";
      temp = sjfArray[i].arrivalTime;
      val = i;
    }
    sjfArray[val].completionTime = temp + sjfArray[val].burstTime;
    sjfArray[val].turnAroundTime =
      sjfArray[val].completionTime - sjfArray[val].arrivalTime;
    sjfArray[val].waitingTime =
      sjfArray[val].turnAroundTime - sjfArray[val].burstTime;

    let temp2 = sjfArray[val];
    sjfArray[val] = sjfArray[i];
    sjfArray[i] = temp2;

    processIds +=
      '<th style="height: 60px; background-color: ' +
      sjfArray[i].color +
      "; width: " +
      sjfArray[i].burstTime * 20 +
      'px;">P' +
      sjfArray[i].id +
      "</th>";
    executionTime +=
      "<td style='background-color: " +
      sjfArray[i].color +
      ";'>" +
      sjfArray[i].burstTime +
      "</td>";
  }
  $(".sjf-div").append(
    '<table class="result-table"><tr>' +
      processIds +
      "</tr><tr>" +
      executionTime +
      "</tr></table>"
  );
};

const roundRobin = () => {
  roundRobinArray = [...processes];
  for (let i = 0; i < processes.length; i++) {
    roundRobinArray[i] = {
      ...processes[i],
      remainingTime: processes[i].burstTime,
    };
  }
  let i,
    n = processes.length,
    time,
    remain = n,
    count = 0;

  var processIds = "<th style='background-color: #eee;'>Process</th>",
    executionTime = "<th style='background-color: #eee;'>Execution Time</th>";

  for (time = 0, i = 0; remain != 0; ) {
    if (count === n) {
      let j = -1;
      for (i = 0; i < n; i++) {
        if (
          roundRobinArray[i].arrivalTime > time &&
          (j == -1 ||
            roundRobinArray[i].arrivalTime < roundRobinArray[j].arrivalTime)
        )
          j = i;
      }
      i = j;
      processIds +=
        '<th style="height: 60px; background-color: #eee; width: ' +
        (roundRobinArray[i].arrivalTime - time) * 20 +
        'px;">Idle</th>';
      executionTime +=
        "<td style='background-color: #eee;'>" +
        (roundRobinArray[i].arrivalTime - time) +
        "</td>";
      time = roundRobinArray[i].arrivalTime;
    }
    if (
      roundRobinArray[i].arrivalTime > time ||
      roundRobinArray[i].remainingTime == 0
    ) {
      i++;
      count++;
      if (i == n) i = 0;
      continue;
    }
    if (roundRobinArray[i].remainingTime <= time_quantum) {
      count = 0;
      time += roundRobinArray[i].remainingTime;
      processIds +=
        '<th style="height: 60px; background-color: ' +
        roundRobinArray[i].color +
        "; width: " +
        roundRobinArray[i].remainingTime * 20 +
        'px;">P' +
        roundRobinArray[i].id +
        "</th>";
      executionTime +=
        "<td style='background-color: " +
        roundRobinArray[i].color +
        ";'>" +
        roundRobinArray[i].remainingTime +
        "</td>";
      roundRobinArray[i].remainingTime = 0;
      remain--;
      roundRobinArray[i].completionTime = time;
      roundRobinArray[i].turnAroundTime = time - roundRobinArray[i].arrivalTime;
      roundRobinArray[i].waitingTime =
        time - roundRobinArray[i].arrivalTime - roundRobinArray[i].burstTime;
    } else if (roundRobinArray[i].remainingTime > time_quantum) {
      count = 0;
      roundRobinArray[i].remainingTime -= time_quantum;
      processIds +=
        '<th style="height: 60px; background-color: ' +
        roundRobinArray[i].color +
        "; width: " +
        time_quantum * 20 +
        'px;">P' +
        roundRobinArray[i].id +
        "</th>";
      executionTime +=
        "<td style='background-color: " +
        roundRobinArray[i].color +
        ";'>" +
        time_quantum +
        "</td>";
      time += time_quantum;
    }
    i++;
    if (i == n) i = 0;
  }

  $(".roundrobin-div").append(
    '<table class="result-table"><tr>' +
      processIds +
      "</tr><tr>" +
      executionTime +
      "</tr></table>"
  );
};

const priority = () => {
  priorityArray = [...processes];
  for (let i = 0; i < processes.length; i++)
    priorityArray[i] = { ...processes[i] };
  priorityArray.sort((a, b) => {
    if (a.arrivalTime === b.arrivalTime) {
      if (a.priority === b.priority) return a.id - b.id;
      return b.priority - a.priority;
    }
    return a.arrivalTime - b.arrivalTime;
  });

  var processIds = "<th style='background-color: #eee;'>Process</th>",
    executionTime = "<th style='background-color: #eee;'>Execution Time</th>";

  for (let i = 0; i < priorityArray.length; i++) {
    if (i > 0)
      priorityArray[i].startTime =
        priorityArray[i - 1].startTime + priorityArray[i - 1].burstTime;
    else priorityArray[0].startTime = 0;
    if (priorityArray[i].startTime < priorityArray[i].arrivalTime) {
      processIds +=
        '<th style="height: 60px; background-color: #eee; width: ' +
        (sjfArray[i].arrivalTime - sjfArray[i].startTime) * 20 +
        'px;">Idle</th>';
      executionTime +=
        "<td style='background-color: #eee;'>" +
        (sjfArray[i].arrivalTime - sjfArray[i].startTime) +
        "</td>";
      priorityArray[i].startTime = priorityArray[i].arrivalTime;
    }
    priorityArray[i].waitingTime =
      priorityArray[i].startTime - priorityArray[i].arrivalTime;
    if (priorityArray[i].waitingTime < 0) priorityArray[i].waitingTime = 0;
    priorityArray[i].turnAroundTime =
      priorityArray[i].burstTime + priorityArray[i].waitingTime;
    priorityArray[i].completionTime =
      priorityArray[i].turnAroundTime + priorityArray[i].arrivalTime;

    processIds +=
      '<th style="height: 60px; background-color: ' +
      priorityArray[i].color +
      "; width: " +
      priorityArray[i].burstTime * 20 +
      'px;">P' +
      priorityArray[i].id +
      "</th>";
    executionTime +=
      "<td style='background-color: " +
      priorityArray[i].color +
      ";'>" +
      priorityArray[i].burstTime +
      "</td>";
  }

  $(".priority-div").append(
    '<table class="result-table"><tr>' +
      processIds +
      "</tr><tr>" +
      executionTime +
      "</tr></table>"
  );
};

const gatherChartData = () => {
  let newFcfsArray = [...fcfsArray];
  for (let i = 0; i < fcfsArray.length; i++)
    newFcfsArray[i] = { ...fcfsArray[i] };
  newFcfsArray.sort((a, b) => a.id - b.id);

  let newSjfArray = [...sjfArray];
  for (let i = 0; i < sjfArray.length; i++) newSjfArray[i] = { ...sjfArray[i] };
  newSjfArray.sort((a, b) => a.id - b.id);

  let newRoundRobinArray = [...roundRobinArray];
  for (let i = 0; i < roundRobinArray.length; i++)
    newRoundRobinArray[i] = { ...roundRobinArray[i] };
  newRoundRobinArray.sort((a, b) => a.id - b.id);

  let newPriorityArray = [...priorityArray];
  for (let i = 0; i < priorityArray.length; i++)
    newPriorityArray[i] = { ...priorityArray[i] };
  newPriorityArray.sort((a, b) => a.id - b.id);

  let fcfswt = [],
    sjfwt = [],
    roundRobinwt = [],
    prioritywt = [],
    fcfstat = [],
    sjftat = [],
    roundRobintat = [],
    prioritytat = [],
    fcfswtTotal = 0,
    sjfwtTotal = 0,
    roundRobinwtTotal = 0,
    prioritywtTotal = 0,
    fcfstatTotal = 0,
    sjftatTotal = 0,
    roundRobintatTotal = 0,
    prioritytatTotal = 0,
    processesNames = [],
    n = processes.length;

  for (let i = 0; i < n; i++) {
    processesNames.push("P" + i);
    fcfswt.push(newFcfsArray[i].waitingTime);
    fcfswtTotal += newFcfsArray[i].waitingTime;
    sjfwt.push(newSjfArray[i].waitingTime);
    sjfwtTotal += newSjfArray[i].waitingTime;
    roundRobinwt.push(newRoundRobinArray[i].waitingTime);
    roundRobinwtTotal += newRoundRobinArray[i].waitingTime;
    prioritywt.push(newPriorityArray[i].waitingTime);
    prioritywtTotal += newPriorityArray[i].waitingTime;
    fcfstat.push(newFcfsArray[i].turnAroundTime);
    fcfstatTotal += newFcfsArray[i].turnAroundTime;
    sjftat.push(newSjfArray[i].turnAroundTime);
    sjftatTotal += newSjfArray[i].turnAroundTime;
    roundRobintat.push(newRoundRobinArray[i].turnAroundTime);
    roundRobintatTotal += newRoundRobinArray[i].turnAroundTime;
    prioritytat.push(newPriorityArray[i].turnAroundTime);
    prioritytatTotal += newPriorityArray[i].turnAroundTime;
  }

  let avgwt = [],
    avgtat = [];
  avgwt.push(fcfswtTotal / n);
  avgwt.push(sjfwtTotal / n);
  avgwt.push(roundRobinwtTotal / n);
  avgwt.push(prioritywtTotal / n);
  avgtat.push(fcfstatTotal / n);
  avgtat.push(sjftatTotal / n);
  avgtat.push(roundRobintatTotal / n);
  avgtat.push(prioritytatTotal / n);

  let mn = avgwt[0] + avgtat[0],
    mni = 0;
  for (let i = 1; i < 4; i++) {
    if (avgwt[i] + avgtat[i] < mn) {
      mn = avgwt[i] + avgtat[i];
      mni = i;
    }
  }

  let suitableAlgo;
  if (mni === 0) suitableAlgo = "First Come First Serve";
  else if (mni === 1) suitableAlgo = "Shortest Job First";
  else if (mni === 2) suitableAlgo = "Round Robin";
  else suitableAlgo = "Priority Scheduling";

  let waitingTime = {
      fcfs: fcfswt,
      sjf: sjfwt,
      roundRobin: roundRobinwt,
      priority: prioritywt,
    },
    turnAroundTime = {
      fcfs: fcfstat,
      sjf: sjftat,
      roundRobin: roundRobintat,
      priority: prioritytat,
    };

  chartData = {
    waitingTime,
    turnAroundTime,
    avgWaitingTime: avgwt,
    avgTurnAroundTime: avgtat,
    processes: processesNames,
    suitableAlgo,
  };
};

const createChart = () => {
  Chart.defaults.font.size = 18;
  var chart1 = document
    .getElementById("averageWaitingTimeChart")
    .getContext("2d");
  var averageWaitingTimeChart = new Chart(chart1, {
    type: "bar",
    data: {
      labels: ["FCFS", "SJF", "Round Robin", "Priority"],
      datasets: [
        {
          data: chartData.avgWaitingTime,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Average Waiting Time",
          position: "bottom",
        },
        legend: {
          display: false,
        },
      },
      responsive: false,
      aspectRatio: 1,
    },
  });

  var chart2 = document
    .getElementById("averageTurnAroundTimeChart")
    .getContext("2d");
  var averageTurnAroundTimeChart = new Chart(chart2, {
    type: "bar",
    data: {
      labels: ["FCFS", "SJF", "Round Robin", "Priority"],
      datasets: [
        {
          data: chartData.avgTurnAroundTime,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Average Turn Around Time",
          position: "bottom",
        },
        legend: {
          display: false,
        },
      },
      responsive: false,
      aspectRatio: 1,
    },
  });

  var chart4 = document.getElementById("turnAroundTimeChart").getContext("2d");
  var turnAroundTimeChart = new Chart(chart4, {
    type: "line",
    data: {
      labels: chartData.processes,
      datasets: [
        {
          label: "First Come First Serve",
          data: chartData.turnAroundTime.fcfs,
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          tension: 0,
        },
        {
          label: "Shortest Job First",
          data: chartData.turnAroundTime.sjf,
          fill: false,
          borderColor: "rgba(54, 162, 235, 1)",
          tension: 0,
        },
        {
          label: "Round Robin",
          data: chartData.turnAroundTime.roundRobin,
          fill: false,
          borderColor: "rgba(255, 206, 86, 1)",
          tension: 0,
        },
        {
          label: "Priority Scheduling",
          data: chartData.turnAroundTime.priority,
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Turn Around Time",
          position: "bottom",
        },
      },
      responsive: false,
      aspectRatio: 1,
    },
  });

  var chart3 = document.getElementById("waitingTimeChart").getContext("2d");
  var waitingTimeChart = new Chart(chart3, {
    type: "line",
    data: {
      labels: chartData.processes,
      datasets: [
        {
          label: "First Come First Serve",
          data: chartData.waitingTime.fcfs,
          fill: false,
          borderColor: "rgba(255, 99, 132, 1)",
          tension: 0,
        },
        {
          label: "Shortest Job First",
          data: chartData.waitingTime.sjf,
          fill: false,
          borderColor: "rgba(54, 162, 235, 1)",
          tension: 0,
        },
        {
          label: "Round Robin",
          data: chartData.waitingTime.roundRobin,
          fill: false,
          borderColor: "rgba(255, 206, 86, 1)",
          tension: 0,
        },
        {
          label: "Priority Scheduling",
          data: chartData.waitingTime.priority,
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Waiting Time",
          position: "bottom",
        },
      },
      responsive: false,
      aspectRatio: 1,
    },
  });
};

const changeData = (event, input, id) => {
  let map = {
      arrivalTime: 1,
      burstTime: 2,
      priority: 3,
    },
    mn = {
      arrivalTime: 0,
      burstTime: 1,
      priority: -100,
    };

  processes[id][input] = parseInt(Math.max(event.target.value, mn[input]));
};

const changeQuantum = (event) => {
  time_quantum = parseInt(event.target.value);
};

const start = (event) => {
  event.preventDefault();
  fcfs();
  sjf();
  roundRobin();
  priority();
  gatherChartData();
  createChart();
  $("#suitable-algo").append(chartData.suitableAlgo);
  $("#simulate-button").attr("disabled", true);
};

// $(document).ready(function () {
//   $("input[type=radio][name=algorithm]").change(function () {
//     if (this.value == "priority") {
//       $(".priority-only").show();
//       $(".servtime").show();
//       $("#minus").css("left", "604px");
//     } else {
//       $(".priority-only").hide();
//       $(".servtime").show();
//       $("#minus").css("left", "428px");
//     }

//     if (this.value == "robin") {
//       $(".servtime").hide();
//       $("#quantumParagraph").show();
//     } else {
//       $("#quantumParagraph").hide();
//       $(".servtime").show();
//     }

//     // recalculateServiceTime();
//   });
// });

function addRow(event) {
  event.preventDefault();
  let currentId = processes.length;

  var newRow =
    "<tr><td>P" +
    currentId +
    '<td><input type="number" min=0 value=0 onchange="changeData(event,' +
    "'arrivalTime', " +
    currentId +
    ')"></td>' +
    '<td><input type="number" min=1 value=1 onchange="changeData(event,' +
    "'burstTime', " +
    currentId +
    ')"></td>' +
    '<td><input type="number" value=0 onchange="changeData(event, ' +
    "'priority', " +
    currentId +
    ')"></td></tr>';

  let newProcess = {
    id: currentId,
    arrivalTime: 0,
    burstTime: 1,
    priority: 0,
    startTime: 0,
    waitingTime: 0,
    remainingTime: 0,
    completionTime: 0,
    turnAroundTime: 0,
    color: random_rgba(),
  };

  processes.push(newProcess);
  console.log(processes);
  console.log(newProcess);

  $("#inputTable").append(newRow);
  if (processes.length > 2) $("#delete-row-button").removeAttr("disabled");
}

function deleteRow(event) {
  event.preventDefault();
  var lastRow = $("#inputTable tr:last");
  lastRow.remove();
  processes.pop();
  if (processes.length <= 2) $("#delete-row-button").attr("disabled", true);
}

// // $(".initial").change(function () {
// //   recalculateServiceTime();
// // });

// function recalculateServiceTime() {
//   var inputTable = $("#inputTable tr");
//   var totalExectuteTime = 0;

//   var algorithm = $("input[name=algorithm]:checked", "#algorithm").val();
//   if (algorithm == "fcfs") {
//     $.each(inputTable, function (key, value) {
//       if (key == 0) return true;
//       $(value.children[3]).text(totalExectuteTime);

//       var executeTime = parseInt($(value.children[2]).children().first().val());
//       totalExectuteTime += executeTime;
//     });
//   } else if (algorithm == "sjf") {
//     var exectuteTimes = [];
//     $.each(inputTable, function (key, value) {
//       if (key == 0) return true;
//       exectuteTimes[key - 1] = parseInt(
//         $(value.children[2]).children().first().val()
//       );
//     });

//     var currentIndex = -1;
//     for (var i = 0; i < exectuteTimes.length; i++) {
//       currentIndex = findNextIndex(currentIndex, exectuteTimes);

//       if (currentIndex == -1) return;

//       $(inputTable[currentIndex + 1].children[3]).text(totalExectuteTime);

//       totalExectuteTime += exectuteTimes[currentIndex];
//     }
//   } else if (algorithm == "priority") {
//     var exectuteTimes = [];
//     var priorities = [];

//     $.each(inputTable, function (key, value) {
//       if (key == 0) return true;
//       exectuteTimes[key - 1] = parseInt(
//         $(value.children[2]).children().first().val()
//       );
//       priorities[key - 1] = parseInt(
//         $(value.children[4]).children().first().val()
//       );
//     });

//     var currentIndex = -1;
//     for (var i = 0; i < exectuteTimes.length; i++) {
//       currentIndex = findNextIndexWithPriority(currentIndex, priorities);

//       if (currentIndex == -1) return;

//       $(inputTable[currentIndex + 1].children[3]).text(totalExectuteTime);

//       totalExectuteTime += exectuteTimes[currentIndex];
//     }
//   } else if (algorithm == "robin") {
//     $("#minus").css("left", "335px");
//     $.each(inputTable, function (key, value) {
//       if (key == 0) return true;
//       $(value.children[3]).text("");
//     });
//   }
// }

// function findNextIndexWithPriority(currentIndex, priorities) {
//   var currentPriority = 1000000;
//   if (currentIndex != -1) currentPriority = priorities[currentIndex];
//   var resultPriority = 0;
//   var resultIndex = -1;
//   var samePriority = false;
//   var areWeThereYet = false;

//   $.each(priorities, function (key, value) {
//     var changeInThisIteration = false;

//     if (key == currentIndex) {
//       areWeThereYet = true;
//       return true;
//     }
//     if (value <= currentPriority && value >= resultPriority) {
//       if (value == resultPriority) {
//         if (currentPriority == value && !samePriority) {
//           samePriority = true;
//           changeInThisIteration = true;
//           resultPriority = value;
//           resultIndex = key;
//         }
//       } else if (value == currentPriority) {
//         if (areWeThereYet) {
//           samePriority = true;
//           areWeThereYet = false;
//           changeInThisIteration = true;
//           resultPriority = value;
//           resultIndex = key;
//         }
//       } else {
//         resultPriority = value;
//         resultIndex = key;
//       }

//       if (value > resultPriority && !changeInThisIteration)
//         samePriority = false;
//     }
//   });
//   return resultIndex;
// }

// function findNextIndex(currentIndex, array) {
//   var currentTime = 0;
//   if (currentIndex != -1) currentTime = array[currentIndex];
//   var resultTime = 1000000;
//   var resultIndex = -1;
//   var sameTime = false;
//   var areWeThereYet = false;

//   $.each(array, function (key, value) {
//     var changeInThisIteration = false;

//     if (key == currentIndex) {
//       areWeThereYet = true;
//       return true;
//     }
//     if (value >= currentTime && value <= resultTime) {
//       if (value == resultTime) {
//         if (currentTime == value && !sameTime) {
//           sameTime = true;
//           changeInThisIteration = true;
//           resultTime = value;
//           resultIndex = key;
//         }
//       } else if (value == currentTime) {
//         if (areWeThereYet) {
//           sameTime = true;
//           areWeThereYet = false;
//           changeInThisIteration = true;
//           resultTime = value;
//           resultIndex = key;
//         }
//       } else {
//         resultTime = value;
//         resultIndex = key;
//       }

//       if (value < resultTime && !changeInThisIteration) sameTime = false;
//     }
//   });
//   return resultIndex;
// }

// // function animate() {
// //   $("fresh").prepend(
// //     '<div id="curtain"></div>'
// //   );

// //   $("#curtain").width($("#resultTable").width());
// //   // $("#curtain").css({ left: $("#resultTable").position().left });

// //   var sum = 0;
// //   $(".exectime").each(function () {
// //     sum += Number($(this).val());
// //   });

// //   console.log($("#resultTable").width());
// //   var distance = $("#curtain").css("width");

// //   animationStep(sum, 0);
// //   console.log($("#curtain"));
// //   $("#curtain").animate(
// //     { width: "0", marginLeft: distance },
// //     (sum * 1000) / 2,
// //     "linear"
// //   );
// // }

// function animationStep(steps, cur) {
//   $("#timer").html(cur);
//   if (cur < steps) {
//     setTimeout(function () {
//       animationStep(steps, cur + 1);
//     }, 500);
//   } else {
//   }
// }

// function draw() {
//   $("fresh").html("");
//   var inputTable = $("#inputTable tr");
//   var th = "";
//   var td = "";

//   var algorithm = $("input[name=algorithm]:checked", "#algorithm").val();
//   if (algorithm == "fcfs") {
//     $.each(inputTable, function (key, value) {
//       if (key == 0) return true;
//       var executeTime = parseInt($(value.children[2]).children().first().val());
//       th +=
//         '<th style="height: 60px; width: ' +
//         executeTime * 20 +
//         'px;">P' +
//         (key - 1) +
//         "</th>";
//       td += "<td>" + executeTime + "</td>";
//     });

//     $("fresh").html(
//       '<table id="resultTable"><tr>' + th + "</tr><tr>" + td + "</tr></table>"
//     );
//   } else if (algorithm == "sjf") {
//     var executeTimes = [];

//     $.each(inputTable, function (key, value) {
//       if (key == 0) return true;
//       var executeTime = parseInt($(value.children[2]).children().first().val());
//       executeTimes[key - 1] = { executeTime: executeTime, P: key - 1 };
//     });

//     executeTimes.sort(function (a, b) {
//       if (a.executeTime == b.executeTime) return a.P - b.P;
//       return a.executeTime - b.executeTime;
//     });

//     $.each(executeTimes, function (key, value) {
//       th +=
//         '<th style="height: 60px; width: ' +
//         value.executeTime * 20 +
//         'px;">P' +
//         value.P +
//         "</th>";
//       td += "<td>" + value.executeTime + "</td>";
//     });

//     $("fresh").html(
//       '<table id="resultTable"><tr>' + th + "</tr><tr>" + td + "</tr></table>"
//     );
//   } else if (algorithm == "priority") {
//     var executeTimes = [];

//     $.each(inputTable, function (key, value) {
//       if (key == 0) return true;
//       var executeTime = parseInt($(value.children[2]).children().first().val());
//       var priority = parseInt($(value.children[4]).children().first().val());
//       executeTimes[key - 1] = {
//         executeTime: executeTime,
//         P: key - 1,
//         priority: priority,
//       };
//     });

//     executeTimes.sort(function (a, b) {
//       if (a.priority == b.priority) return a.P - b.P;
//       return b.priority - a.priority;
//     });

//     $.each(executeTimes, function (key, value) {
//       th +=
//         '<th style="height: 60px; width: ' +
//         value.executeTime * 20 +
//         'px;">P' +
//         value.P +
//         "</th>";
//       td += "<td>" + value.executeTime + "</td>";
//     });

//     $("fresh").html(
//       '<table id="resultTable" style="width: 70%"><tr>' +
//         th +
//         "</tr><tr>" +
//         td +
//         "</tr></table>"
//     );
//   } else if (algorithm == "robin") {
//     var quantum = $("#quantum").val();
//     var executeTimes = [];

//     $.each(inputTable, function (key, value) {
//       if (key == 0) return true;
//       var executeTime = parseInt($(value.children[2]).children().first().val());
//       executeTimes[key - 1] = { executeTime: executeTime, P: key - 1 };
//     });

//     var areWeThereYet = false;
//     while (!areWeThereYet) {
//       areWeThereYet = true;
//       $.each(executeTimes, function (key, value) {
//         if (value.executeTime > 0) {
//           th +=
//             '<th style="height: 60px; width: ' +
//             (value.executeTime > quantum ? quantum : value.executeTime) * 20 +
//             'px;">P' +
//             value.P +
//             "</th>";
//           td +=
//             "<td>" +
//             (value.executeTime > quantum ? quantum : value.executeTime) +
//             "</td>";
//           value.executeTime -= quantum;
//           areWeThereYet = false;
//         }
//       });
//     }
//     $("fresh").html(
//       '<table id="resultTable" style="width: 70%"><tr>' +
//         th +
//         "</tr><tr>" +
//         td +
//         "</tr></table>"
//     );
//   }
//   animate();
// }

// console.log("connected");
