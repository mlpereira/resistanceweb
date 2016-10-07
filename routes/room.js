var express = require('express');
var router = express.Router();

var rooms = {};

function Player(id, name){
  this.id = id;
  this.name = name;
}

function Room(id, player) {
  this.id = id;
  this.owner = player;
  this.players = [];
  this.players.push(player);
  this.phase = 0;
  this.getPlayer = function(playerId){
    for(var i=0; i<this.players.length; i++){
      if (this.players[i].id == playerId)
        return this.players[i];
      return false;
    }
  };
}

function getRoom(req, res, next){
  var roomId = req.params.roomId;
  var room = rooms[roomId];

  if (!room) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }
  var player = room.getPlayer(req.session.id);
  switch (room.phase) {
    case 0:
      res.render('room', {room, player});
      break;
  case 1:
      res.render('phaseOne', {room, player});
      break;
  }
}

function createRoom(req, res, next){
  do {
    var roomId = 10; //Math.floor((Math.random() * 100000) + 1);
  } while(rooms[roomId] != undefined)
  var player = new Player(req.session.id, req.body.username);
  rooms[roomId] = new Room(roomId, player);

  res.redirect('/room/' + roomId);
}

function joinRoom(req, res, next){
  var room = rooms[req.params.roomId];
  if (!room) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }

  var player = new Player(req.session.id, req.body.username);
  room.players.push(player);

  res.redirect('/room/' + room.id);
}

function startGame(req, res, next){
  var room = rooms[req.params.roomId];
  if (!room) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }

  room.phase = 1;
  assignRoles(room.players);
  res.redirect('/room/' + room.id);
}

function assignRoles(players){
  for (var i=0; i<players.length; i++){
    players[i].isLoyal = (i % 2 == 0 ? true : false);
  }
}

function addBots(req, res, next){
  var room = rooms[req.params.roomId];
  for (var i = 1; i <= 4; i++){
    var bot = new Player(i, 'BOT'+i);
    room.players.push(bot);
  }
  res.redirect('/room/' + room.id);
}

router.get('/:roomId', getRoom);

router.post('/', createRoom);
router.post('/:roomId/joinRoom', joinRoom);
router.post('/:roomId/startGame', startGame);
router.post('/:roomId/addBots', addBots);

module.exports = router;
