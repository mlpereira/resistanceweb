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
  this.missions = [];
  this.getPlayer = function(playerId){
    for(var i=0; i<this.players.length; i++){
      if (this.players[i].id == playerId)
        return this.players[i];
      return false;
    }
  };
  this.getCurrentMission = function(){
    return this.missions[this.currentMissionIndex];
  }
  this.getCurrentLeader = function(){
    return this.getCurrentMission().leader;
  }
}

function Mission(leader){
  this.leader = leader;
  this.firstTeam = true;
  this.votes = [];
  this.countVotes = function(){
    var count = 0;
    for (var i = 0; i<this.votes.length; i++){
      if (this.votes[i].vote){
        count++;
      }
    }
    return count;
  }
  this.getPlayerVote = function(player){
    for (var i = 0; i<this.votes.length; i++){
      if (this.votes[i].player.id == player.id){
        return this.votes[i].vote;
      }
    }
    //THROW EXCEPTION
  }
  this.playerHasVoted = function(player){
    for (var i = 0; i<this.votes.length; i++){
      if (this.votes[i].player.id == player.id){
        return true;
      }
    }
    return false;
  }
}

function Vote(player, vote){
  this.player = player;
  this.vote = (vote == 'yes');
}

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
  }
}

function createRoom(req, res, next){
  do {
    var roomId = 10 + Object.keys(rooms).length; //Math.floor((Math.random() * 100000) + 1);
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
  room.currentLeaderIndex = 0; //Random
  var firstLeader = room.players[room.currentLeaderIndex];
  room.missions.push(new Mission(firstLeader));
  room.currentMissionIndex = 0;
  res.redirect('/room/' + room.id);
}

function assignRoles(players){
  for (var i=0; i<players.length; i++){
    players[i].isLoyal = (i % 2 == 0);
  }
}

function selectAgents(req, res, next){
  var room = rooms[req.params.roomId];
  room.phase = 2;
  room.getCurrentMission().agents = req.body.agents;

  res.redirect('/room/' + room.id);
}

function voteTeam(req, res, next){
  var room = rooms[req.params.roomId];
  var player = room.getPlayer(req.session.id);
  var vote = new Vote(player, req.body.vote);
  var mission = room.getCurrentMission();
  mission.votes.push(vote);
  if(mission.votes.length == room.players.length)
    if(mission.countVotes() > room.players.length / 2){
      room.phase = 3;
    } else{
      room.phase = 1;
      mission.firstTeam = false;
    }
  res.redirect('/room/' + room.id);
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
router.post('/:roomId/selectAgents', selectAgents);
router.post('/:roomId/voteTeam', voteTeam);
router.post('/:roomId/addBots', addBots);

module.exports = router;
