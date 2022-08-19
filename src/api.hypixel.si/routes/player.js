const express = require('express');
const router = express.Router();
require('dotenv').config()
const API_KEY = process.env.KEY
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const path = require('path');
//ustvarjanje predpomnilnika
const axios = require("axios");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 43200 });

router.get('/', async (req,res) => {
  res.status(404).send('Error 404');
  //res.sendFile(path.join(__dirname, '../website/index.html'));
})

//cache
const verifyCache = (req, res, next) => {
  try {
    var id = req.params.uuid;
    if (cache.has(id)) {
      return res.status(200).json(cache.get(id));
    }
    return next();
  } catch (err) {
    throw new Error(err);
  }
};
const verifyCacheIme = (req, res, next) => {
  try {
    var ime = req.params.ime;
    if (cache.has(ime)) {
      return res.status(200).json(cache.get(ime));
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
    return res.status(200).json(data);
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
    return res.status(200).json(data);
  } catch ({ response }) {
    console.error('Error', response.status, 'za "'+ ime + '"');
    return res.sendStatus(response.status);
  }
});

module.exports = router