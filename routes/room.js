var express = require('express');
var router = express.Router();

var rooms = {};

function Room(id, sessionId, name) {
  this.id = id;
  this.owner = sessionId;
  this.players = {};
  this.players[sessionId] = {
    id: sessionId,
    name: name
  }
  this.phase =0;
}

router.post('/', function(req, res, next) {
  do {
    var roomId = 10; //Math.floor((Math.random() * 100000) + 1);
  } while(rooms[roomId] != undefined)

  rooms[roomId] = new Room(roomId, req.session.id, req.body.username);

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
  var player = room.players[req.session.id];
  switch (room.phase) {
    case 0:
      res.render('room', {room, player});
      break;
  case 1:
      res.render('phaseOne', {room, player});
      break;
  }
});

router.post('/:roomId/joinRoom', function(req, res, next) {
  var room = rooms[req.params.roomId]
  if (!room) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err)
  }

  var player =  {
    id: req.session.id,
    name: req.body.username,
  }
  room.players[player.id] = player;

  res.redirect('/room/' + room.id)
});

router.post('/:roomId/startGame', function(req, res, next){
  var room = rooms[req.params.roomId]
  if (!room) {
    var err = new Error('Not Found');
    err.status = 404;
    return next(err)
  }

  room.phase = 1;
  for (var key in room.players){
    room.players[key].isLoyal = (key % 2 == 0 ? true : false)
  }

  res.redirect('/room/' + room.id)
})

module.exports = router;
