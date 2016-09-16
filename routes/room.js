var express = require('express');
var router = express.Router();

var rooms = {}

function Room(sessionid, name) {
  var players = {}
  players[sessionid] = {
    name: name,
    leader: true
  }
  return {
    players: players
  }
}

router.post('/', function(req, res, next) {
  do {
    var roomId = Math.floor((Math.random() * 100000) + 1);
  }
  while(rooms[roomId] != undefined)

  rooms[roomId] = Room(req.session.id, req.body.username)

  res.redirect('/room/' + roomId)
})

router.get('/:roomId', function(req, res, next) {
  var roomId = req.params.roomId
  var room = rooms[roomId]

  if (!room) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err)
  }

  var player = room.players[req.session.id]

  res.render('room', {room, player, roomId});
});

router.post('/:roomId', function(req, res, next) {
  var roomId = req.params.roomId
  var room = rooms[req.params.roomId]
  if (!room) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err)
  }

  room.players[req.session.id] = {
    name: req.body.username,
    leader: false
  }

  var player = room.players[req.session.id]

  res.render('room', {room, player, roomId});
});

module.exports = router;
