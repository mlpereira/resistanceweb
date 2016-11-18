var Gameplay = require('./gameplay');

function Room(id, player) {
  this.id = id;
  this.owner = player;
  this.players = [];
  this.players.push(player);
  this.phase = 0;
  this.missions = [];
  this.failedMissions = 0;
  this.badStart = false;

  this.teamDisapproved = function(){
    this.changeLeader();
    this.getCurrentMission().teamDisapproved(this.getCurrentLeader());
  }

  this.changeLeader = function(){
    if (this.currentLeaderIndex < this.players.length-1){
      this.currentLeaderIndex++;
    } else {
      this.currentLeaderIndex = 0;
    }
  }

  this.setupGame = function(){
    this.phase = 1;
    this.currentLeaderIndex = 0; //Random
    this.currentMissionIndex = 0;
    this.assignRoles();
    this.setupMissions();
  }

  this.assignRoles = function(){
    for (var i=0; i<this.players.length; i++){
      this.players[i].isLoyal = (i % 2 == 0);
    }
  }

  this.setupMissions = function(){
      this.missions = Gameplay.getMissions(this.players.length);
      this.missions[0].setLeader(this.getCurrentLeader());
  }

  this.nextMission = function(){
    this.changeLeader();
    this.phase = 1;
    this.currentMissionIndex++;
  }

  this.getPlayer = function(playerId){
    for(var i=0; i<this.players.length; i++){
      if (this.players[i].id == playerId)
        return this.players[i];
    }
    return false;
  };

  this.getCurrentMission = function(){
    return this.missions[this.currentMissionIndex];
  }

  this.getCurrentLeader = function(){
    return this.players[this.currentLeaderIndex];
  }

}

exports.create = function(id, player) {
  return new Room(id, player);
}
