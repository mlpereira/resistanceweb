var express = require('express');
var router = express.Router();
var Room = require('../models/room');
var Player = require('../models/player');
var Mission = require('../models/mission');

var rooms = {};

function getRoom(req, res, next){
  var room = rooms[req.params.roomId];
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
  case 2:
      res.render('phaseTwo', {room, player});
      break;
  case 3:
      res.render('phaseThree', {room, player});
      break;
  }
}

function createRoom(req, res, next){
  do {
    var roomId = 10 + Object.keys(rooms).length; //Math.floor((Math.random() * 100000) + 1);
  } while(rooms[roomId] != undefined)
  var player = Player.create(req.session.id, req.body.username);
  rooms[roomId] = Room.create(roomId, player);

  res.redirect('/room/' + roomId);
}

function joinRoom(req, res, next){
  var room = rooms[req.params.roomId];
  if (!room) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err);
  }

  var player = Player.create(req.session.id, req.body.username);
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

  room.setupGame();
  res.redirect('/room/' + room.id);
}

function selectAgents(req, res, next){
  var room = rooms[req.params.roomId];
  room.phase = 2;
  for (var i = 0; i<req.body.agents.length; i++){
    var agent = room.players[req.body.agents[i]];
    room.getCurrentMission().agents.push(agent);
  }

  res.redirect('/room/' + room.id);
}

function voteTeam(req, res, next){
  var room = rooms[req.params.roomId];
  var player = room.getPlayer(req.session.id);
  var mission = room.getCurrentMission();
  mission.votes[player.id] = req.body.vote;
  if(Object.keys(mission.votes).length == room.players.length)
    if(mission.countApprovals() > room.players.length / 2){
      room.phase = 3;
    } else {
      room.changeLeader();
      room.phase = 1;
    }
  res.redirect('/room/' + room.id);
}

function addBots(req, res, next){
  var room = rooms[req.params.roomId];
  for (var i = 1; i <= 4; i++){
    var bot = Player.create(i, 'BOT'+i);
    room.players.push(bot);
  }
  res.redirect('/room/' + room.id);
}

router.get('/:roomId', getRoom);

router.post('/', createRoom);
router.post('/:roomId/joinRoom', joinRoom);
router.post('/:roomId/startGame', startGame);
router.post('/:roomId/selectAgents', selectAgents);
router.post('/:roomId/voteTeam', voteTeam);
router.post('/:roomId/addBots', addBots);

module.exports = router;
