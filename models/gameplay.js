var Mission = require('./mission');

var Gameplay = {
  getNumSpies: (numPlayers) => {
    if (numPlayers == 2) // DEBUG ONLY!!!
      return 1;
    if (numPlayers == 5 || numPlayers == 6)
      return 2;
    if (numPlayers >= 7 && numPlayers <= 9)
      return 3;
    if (numPlayers == 10)
      return 4;
  },
  getMissions: (numPlayers) => {
    var missions = [];

    switch(numPlayers) {
      case 2: {
        missions[0] = Mission.create(1, 1);
        missions[1] = Mission.create(2, 2);
        missions[2] = Mission.create(1, 1);
        missions[3] = Mission.create(2, 2);
        missions[4] = Mission.create(2, 2);
        return missions;
      }
      case 5: {
        missions[0] = Mission.create(2, 2);
        missions[1] = Mission.create(3, 3);
        missions[2] = Mission.create(2, 2);
        missions[3] = Mission.create(3, 3);
        missions[4] = Mission.create(3, 3);
        return missions;
      }

      case 6: {
        missions[0] = Mission.create(2, 2);
        missions[1] = Mission.create(3, 3);
        missions[2] = Mission.create(4, 4);
        missions[3] = Mission.create(3, 3);
        missions[4] = Mission.create(4, 4);
        return missions;
      }

      case 7: {
        missions[0] = Mission.create(2, 2);
        missions[1] = Mission.create(3, 3);
        missions[2] = Mission.create(3, 3);
        missions[3] = Mission.create(4, 3);
        missions[4] = Mission.create(4, 4);
        return missions;
      }

      case 8: {
        missions[0] = Mission.create(3, 3);
        missions[1] = Mission.create(4, 4);
        missions[2] = Mission.create(4, 4);
        missions[3] = Mission.create(5, 4);
        missions[4] = Mission.create(5, 5);
        return missions;
      }

      case 9: {
        missions[0] = Mission.create(3, 3);
        missions[1] = Mission.create(4, 4);
        missions[2] = Mission.create(4, 4);
        missions[3] = Mission.create(5, 4);
        missions[4] = Mission.create(5, 5);
        return missions;
      }

      case 10: {
        missions[0] = Mission.create(3, 3);
        missions[1] = Mission.create(4, 4);
        missions[2] = Mission.create(5, 5);
        missions[3] = Mission.create(5, 4);
        missions[4] = Mission.create(5, 5);
        return missions;
      }
    }
  }
}

module.exports = Gameplay
