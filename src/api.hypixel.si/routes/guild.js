const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();
const API_KEY = process.env['KEY']
//ustvarjanje predpomnilnika
const axios = require("axios");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 43200 });

//Get data for HypixelSlovenija guild
router.get('/slo', async (req,res) => {
    try {
        fetch('https://api.hypixel.net/guild?key=' + API_KEY + '&id=5ff980828ea8c9e004b008e2')
        .then(response => response.json())
        .then(data => {
            res.json(data);
        });
    }catch(err){
        res.json({message: err})
    }
})
const verifyCacheID = (req, res, next) => {
    try {
      var id = req.params.id;
      if (cache.has(id)) {
        return res.status(200).json(cache.get(id));
      }
      return next();
    } catch (err) {
      throw new Error(err);
    }
  };
  
  router.get("/id/:id", verifyCacheID, async (req, res) => {
    try {
      var id = req.params.id;
      const { data } = await axios.get('https://api.hypixel.net/guild?key=' + API_KEY + '&id=' + id);
      console.log('GET guild id', id);
      cache.set(id, data);
      return res.status(200).json(data);
    }catch ({ response }) {
      console.error('Error', response.status, 'za "'+ id + '"');
      return res.sendStatus(response.status);
    }
  });

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
  
  router.get("/ime/:ime", verifyCacheIme, async (req, res) => {
    try {
      var ime = req.params.ime;
      const { data } = await axios.get('https://api.hypixel.net/guild?key=' + API_KEY + '&name=' + ime);
      console.log('GET guild ime', ime);
      cache.set(ime, data);
      return res.status(200).json(data);
    }catch ({ response }) {
      console.error('Error', response.status, 'za "'+ ime + '"');
      return res.sendStatus(response.status);
    }
  });

module.exports = router
