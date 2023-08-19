(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("parket tla",
{ "compressionlevel":-1,
 "height":20,
 "infinite":false,
 "layers":[
        {
         "data":[93, 114, 114, 115, 94, 114, 114, 114, 115, 94, 93, 93, 93, 93, 93, 114, 93, 93, 93, 94, 114, 114, 115, 93, 93, 93, 93, 93, 93, 94,
            114, 114, 115, 115, 115, 94, 93, 93, 94, 115, 93, 93, 93, 93, 94, 94, 114, 114, 114, 115, 115, 93, 93, 93, 93, 93, 93, 93, 94, 94,
            114, 115, 115, 114, 115, 115, 114, 93, 93, 94, 94, 94, 94, 94, 115, 115, 115, 114, 114, 114, 114, 93, 94, 94, 94, 93, 94, 94, 94, 94,
            114, 115, 94, 93, 93, 94, 93, 114, 93, 93, 94, 115, 115, 115, 93, 94, 94, 94, 93, 94, 94, 94, 94, 115, 93, 94, 94, 115, 115, 94,
            114, 115, 115, 93, 93, 93, 93, 94, 114, 93, 94, 93, 93, 94, 94, 94, 94, 94, 114, 93, 94, 94, 115, 93, 94, 94, 115, 115, 115, 115,
            93, 93, 93, 114, 114, 114, 114, 115, 93, 114, 93, 94, 114, 115, 115, 115, 94, 93, 94, 94, 115, 115, 94, 94, 115, 115, 115, 93, 94, 115,
            114, 114, 114, 114, 115, 94, 94, 93, 93, 93, 93, 93, 93, 94, 94, 93, 93, 93, 94, 115, 94, 94, 94, 93, 94, 94, 94, 114, 115, 115,
            114, 115, 94, 93, 93, 94, 115, 114, 114, 114, 114, 114, 114, 115, 94, 93, 94, 94, 94, 93, 94, 94, 94, 94, 93, 94, 93, 94, 94, 93,
            93, 93, 94, 93, 94, 93, 93, 93, 93, 93, 93, 94, 114, 93, 94, 93, 94, 115, 115, 94, 94, 115, 115, 93, 114, 115, 94, 94, 115, 114,
            114, 93, 94, 93, 93, 94, 114, 114, 114, 93, 94, 115, 93, 114, 93, 114, 115, 115, 115, 94, 94, 94, 94, 114, 115, 115, 115, 115, 114, 115,
            94, 114, 93, 114, 93, 93, 93, 94, 94, 93, 94, 94, 94, 93, 114, 114, 115, 115, 94, 94, 115, 115, 115, 115, 94, 94, 94, 93, 114, 115,
            115, 93, 93, 93, 114, 114, 93, 93, 93, 93, 94, 93, 93, 114, 114, 115, 115, 115, 93, 94, 115, 115, 94, 94, 93, 94, 94, 114, 114, 115,
            93, 93, 94, 94, 94, 94, 114, 93, 94, 93, 94, 114, 114, 114, 93, 94, 94, 114, 114, 115, 93, 114, 115, 115, 114, 115, 115, 94, 94, 115,
            93, 114, 115, 115, 115, 115, 115, 114, 115, 93, 94, 94, 115, 93, 114, 115, 94, 115, 93, 94, 114, 93, 93, 94, 93, 114, 115, 115, 115, 94,
            94, 94, 94, 114, 93, 114, 93, 94, 114, 114, 115, 115, 114, 93, 114, 114, 115, 114, 114, 93, 93, 114, 114, 115, 93, 93, 93, 94, 114, 115,
            94, 93, 93, 93, 114, 93, 93, 94, 114, 115, 93, 93, 93, 114, 114, 115, 94, 94, 93, 94, 94, 94, 94, 94, 114, 114, 114, 115, 114, 114,
            93, 114, 114, 114, 114, 114, 114, 115, 114, 93, 93, 114, 114, 115, 114, 115, 115, 115, 114, 115, 115, 115, 115, 115, 114, 93, 93, 114, 115, 115,
            93, 93, 94, 94, 94, 114, 93, 93, 93, 114, 114, 114, 115, 94, 94, 94, 94, 94, 93, 94, 114, 114, 114, 115, 93, 114, 114, 114, 114, 114,
            93, 93, 93, 93, 93, 93, 114, 114, 114, 114, 115, 114, 93, 93, 93, 93, 93, 93, 114, 115, 94, 94, 94, 94, 94, 94, 94, 94, 94, 94,
            114, 114, 114, 114, 114, 114, 114, 114, 93, 93, 94, 114, 114, 114, 114, 114, 114, 114, 114, 115, 115, 115, 115, 115, 115, 115, 115, 115, 115, 115],
         "height":20,
         "id":1,
         "name":"Tile Layer 1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":30,
         "x":0,
         "y":0
        }],
 "nextlayerid":2,
 "nextobjectid":1,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.10.2",
 "tileheight":64,
 "tilesets":[
        {
         "firstgid":1,
         "source":"parket.tsx"
        }],
 "tilewidth":64,
 "type":"map",
 "version":"1.10",
 "width":30
});