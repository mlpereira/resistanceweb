var Mission = require('./mission');

var Gameplay = {
  getNumSpies: (numPlayers) => {
    if (numplayers == 5 || numplayers == 6)
      return 2;
    if (numplayers >= 7 && numplayers <= 9)
      return 3;
    if (numplayers == 10)
      return 4;
  },
  getMissions: (numPlayers) => {
    var missions = [];

    switch(numPlayers) {
      case 5: {
        missions[0] = Mission.create(2, 2);
        missions[1] = Mission.create(3, 3);
        missions[2] = Mission.create(2, 2);
        missions[3] = Mission.create(3, 3);
        missions[4] = Mission.create(3, 3);
        console.log("foi");
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