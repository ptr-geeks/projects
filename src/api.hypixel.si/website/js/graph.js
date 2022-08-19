async function getData(){
    const response = await fetch('http://localhost:8080/guild/slo')
    const data = await response.json();
    getExp(data.guild.members);
  };
  
  
  let date = [];
  
  function getDate(member){
    //dan
    const d = new Date();
    let dan = d.getDate();
    //mesec
    const m = new Date();
    let mesec = + m.getMonth() + 1;
    if (mesec < 10){mesec = '0' + mesec}
    //leto
    const l = new Date();
    let leto = l.getFullYear()
    //združi z pomišljaji
    for (i=0;i<7;i++){
      date[6-i] = leto+'-'+mesec+'-'+dan
      dan -= 1;
    }
    return date;
  }
  
  function getExp(members){
    //console.log(members.);
    let gExp = [];
    getDate();
    const loc = document.location.pathname;
    let uuid = loc.replace('/prikaz/uuid/', '')
    const member = members.find(element => element.uuid == uuid);
    console.log(member);
     date.forEach((date, i) => {
       gExp.push(member.expHistory[date])
    })
    console.log(gExp);
    drawChart(getDate(), gExp)
  }
  
  google.charts.load('current', {'packages':['corechart']});
  //google.charts.setOnLoadCallback(drawChart);
  
  function drawChart(date, exp) {
    console.log(exp)
    var data = google.visualization.arrayToDataTable([
      ['Dan', 'Guild EXP'],
      [date[0],  exp[0]],
      [date[1],  exp[1]],
      [date[2],  exp[2]],
      [date[3],  exp[3]],
      [date[4],  exp[4]],
      [date[5],  exp[5]],
      [date[6],  exp[6]]
    ]);
  
    var options = {
      title: 'Graf guild exp/dan',
      legend: { position: 'bottom' }
    };
  
    var chart = new google.visualization.LineChart(document.getElementById('line_chart'));
  
    chart.draw(data, options);
  }
  getData();