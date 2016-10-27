function Mission(numAgents, votesToApprove){
  this.firstTeam = true;
  this.agents = [];
  this.votes = {};
  this.numAgents = numAgents;
  this.votesToApprove = votesToApprove;
  this.playersDone = 0;
  this.playersFailed = 0;

  this.setLeader = function(leader){
    this.leader = leader;
  }

  this.teamDisapproved = function(newLeader){
    this.firstTeam = false;
    this.lastLeader = this.leader;
    this.lastAgents = this.agents;
    this.lastVotes = this.votes;
    this.leader = newLeader;
    this.votes = {};
    this.agents = [];
  }

  this.countApprovals = function(){
    var count = 0;
    for (var vote in this.votes){
      if (this.votes[vote] == 'yes'){
        count++;
      }
    }
    return count;
  }

  this.getPlayerVote = function(player){
    return this.votes[player.id];
    //THROW EXCEPTION
  }

  this.playerHasVoted = function(player){
    return this.votes.hasOwnProperty(player.id);
  }

  this.playerIsOnMission = function(player){
    for(var i=0; i<this.agents.length; i++){
      if (this.agents[i].id == player.id){
        return true;
      }
    }
    return false;
  };

}

exports.create = function(numAgents, votesToApprove) {
  return new Mission(numAgents, votesToApprove);
}
