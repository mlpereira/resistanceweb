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
  case 4:
      res.render('phaseFour', {room, player});
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
  if (room.players.length >=5 && room.players.length <= 10) {
    room.setupGame();
  } else {
    room.badStart = true;
    if (room.players.length == 2) { //DEBUG ONLY!!!
      room.setupGame();
    }
  }
  res.redirect('/room/' + room.id);
}

function selectAgents(req, res, next){
  var room = rooms[req.params.roomId];
  var mission = room.getCurrentMission();
  // if (!req.body.agents) {
  //   mission.badSelect = true;
  //
  //   res.redirect('/room/' + room.id);
  // }

  if (req.body.agents && mission.numAgents == req.body.agents.length){
    for (var i = 0; i<req.body.agents.length; i++){
      var agent = room.players[req.body.agents[i]];
      mission.agents.push(agent);
    }

    room.phase = 2;
  } else {
    mission.badSelect = true;
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
      room.teamDisapproved();
      room.phase = 1;
    }
  res.redirect('/room/' + room.id);
}

function realizeMission(req, res, next){
  var room = rooms[req.params.roomId];
  var player = room.getPlayer(req.session.id);
  var mission = room.getCurrentMission();
  mission.playersDone[player.id] = true;
  if (req.body.action == 'fail'){
    mission.playersFailed++;
  }
  if (Object.keys(mission.playersDone).length == mission.numAgents){
    if (mission.playersFailed > 0){ // ***
      room.failedMissions++;
    }
    room.phase = 4;
  }
  res.redirect('/room/' + room.id);
}

function nextMission(req, res, next){
  var room = rooms[req.params.roomId];
  var player = room.getPlayer(req.session.id);
  room.nextMission();
  room.getCurrentMission().setLeader(room.getCurrentLeader());
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
router.post('/:roomId/realizeMission', realizeMission);
router.post('/:roomId/nextMission', nextMission);
router.post('/:roomId/addBots', addBots);

module.exports = router;
