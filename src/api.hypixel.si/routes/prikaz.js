const express = require('express');
const router = express.Router();
const API_KEY = process.env.KEY
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
//ustvarjanje predpomnilnika
const axios = require("axios");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 43100 }); // 60 * 60 * 24 * 365

router.get('/', async (req,res) => {
  res.status(420).send('Thank you to <a href="https://crafatar.com">Crafatar</a> for providing avatars.');
  //res.sendFile(path.join(__dirname, '../website/index.html'));
})

//preveri če je že v cache
const verifyCache = async (req, res, next) => {
  try {
    var id = req.params.uuid;
    if (cache.has(id)) {
      return res.status(200).send(await prikaz(cache.get(id)));
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
}; //preveri če je že v cache
const verifyCacheIme = async (req, res, next) => {
  try {
    var ime = req.params.ime;
    if (cache.has(ime)) {
      return res.status(200).send(await prikaz(cache.get(ime)));
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};

router.get("/uuid/:uuid", verifyCache, async (req, res) => {
  try {
    var uuid = req.params.uuid;
    const { data } = await axios.get('https://api.hypixel.net/player?key=' + API_KEY + '&uuid=' + uuid);
    console.log('Iskal uuid', uuid);
    cache.set(uuid, data);
    return res.status(200).send(await prikaz(data));
  }catch ({ response }) {
    console.error('Error', response.status, 'za "'+ uuid + '"');
    return res.sendStatus(response.status);
  }
});

router.get("/ime/:ime", verifyCacheIme, async (req, res) => {
  try {
    var ime = req.params.ime;
    const { data } = await axios.get('https://api.hypixel.net/player?key=' + API_KEY + '&name=' + ime);
    console.log('Iskal ime', ime);
    cache.set(ime, data);
    return res.status(200).send(await prikaz(data));
  } catch ({ response }) {
    //console.log(err);  
    console.error('Error', response.status, 'za "'+ ime + '"');
    return res.sendStatus(response.status);
  }
});

async function prikaz(data){
  let url = 'https://crafatar.com/renders/body/' + data.player.uuid+'?size=4&default=MHF_Steve&overlay';
  var firstLogin = new Date(data.player.firstLogin).toLocaleDateString("sl-SI");
  if (data.player.lastLogin === undefined){
    lastLogin = 'Izklopljeno'
  }else{
    var lastLogin = new Date(data.player.lastLogin).toLocaleString();
  }
  var lvl = Math.floor(Math.sqrt(data.player.networkExp + 15312.5) - (125/Math.sqrt(2)))/(25*Math.sqrt(2))
  let level = Math.trunc(lvl);
  return '<!DOCTYPE html>' +
  '<html lang="en" dir="ltr">'+
    '<head>'+
      '<meta charset="utf-8">'+
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">'+
      '<meta property="og:url" content="http://api.hypixel.si:8080">'+
      '<meta property="og:title" content="Hypixel Slovenija API">'+
      '<link rel="icon" href="/img/logo.png" type="image/png" sizes="32x32">'+
      '<meta property="og:description" content="Hypixel Slovenija API">'+
      '<meta property="og:image" content="http://api.hypixel.si:8080/files/logo.png">'+
      '<meta content="#bde0fe" data-react-helmet="true" name="theme-color">'+
      '<link rel="stylesheet" href="/css/style.css">'+
      '<link rel="stylesheet" href="/css/bak.css">'+
      '<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>'+
      '<link rel="preconnect" href="https://fonts.googleapis.com">'+
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'+
      '<link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,200;0,300;0,500;1,200;1,300;1,500&display=swap" rel="stylesheet">'+
      '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>'+
      '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'+
      '<title>' + data.player.displayname + '</title>'+
    '</head>'+
    '<body>'+
        '<div class="navbar" id="topnavbar">'+
          '<a href="/">Domov</a>'+
          '<a href="/clani.html">Člani Guilda</a>'+
          '<a href="/stat.html">Stat Guilda</a>'+
          '<a href="#" class="active">Prikaz</a>'+
          '<a href="javascript:void(0);" class="icon" onclick="meni()">'+
              '<i class="fa fa-bars"></i>'+
            '</a>'+
        '</div>'+
        '<div class="prikazIgralca" align="center">'+
            '<h1>' + data.player.displayname + '</h1><br><small>(<i>'+ data.player.uuid + '</i>)</small></span></h1>'+
            '<br>'+
            '<h3>Statistika igralca</h3>'+
            '<span><b>Level: </b>' + level + ' <small>(<i>'+ data.player.networkExp + '</i>)</small></span>'+
            '<br>'+
            '<span><b>Prvič online: </b>' + firstLogin +  '</span>'+
            '<br>'+
            '<span><b>Nazadnje online: </b>' + lastLogin + '</span>'+
            '<br>'+
            '<span><b>Rank: </b>' + getRank(data) + '</span>'+
            '<br>'+
            '<br>'+
            '<img src="' + url + '">' + '</span>'+
            '<br>'+
            '<br>'+
            '<div id="line_chart"></div>'+
        '</div>'+
      '<script src="/js/script.js"></script>'+
      '<script src="/js/graph.js"></script>'+
    '</body>'+
  '</html>'
}
function getRank(data){
  //Hvala https://hypixel.net/threads/api-help-how-to-get-a-player-rank-network-level.1797880/post-21487465
    player = data.player;
      let rank = '';
      if (player.rank) { // Check if is ADMIN, MOD, HELPER, YT...
          return rank = player.rank; // player.prefix exist here as well
      } else if (player.monthlyPackageRank && player.monthlyPackageRank !== 'NONE') { // Check if is MVP++
          return rank = 'MVP++'
      } else if (player.newPackageRank) { // Check if its VIP...MVP+
          return rank = player.newPackageRank.replace('_PLUS', '+');
      } else {
          return rank = 'brez';
      }
}

module.exports = router