function Room(id, player) {
  this.id = id;
  this.owner = player;
  this.players = [];
  this.players.push(player);
  this.phase = 0;
  this.missions = [];

  this.changeLeader = function(){
    if (this.currentLeaderIndex < this.players.length-1){
      this.currentLeaderIndex++;
    } else {
      this.currentLeaderIndex = 0;
    }
    this.getCurrentMission().setNewLeader(this.getCurrentLeader())
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
