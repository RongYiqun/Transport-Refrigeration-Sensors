const Container = require("./src/Container");
const Monitor = require("./src/Monitor").Monitor;
const uuid = require("uuid");

const truck = new Monitor();
const beer1Container = new Container("beer1", uuid.v4(), 4, 6, 5);
const beer2Container = new Container("beer2", uuid.v4(), 5, 6, 5);
const beer3Container = new Container("beer3", uuid.v4(), 4, 7, 5);
const beer4Container = new Container("beer4", uuid.v4(), 6, 8, 6);
const beer5Container = new Container("beer5", uuid.v4(), 3, 5, 5);
const beer6Container = new Container("beer6", uuid.v4(), 4, 6, 4);

beer1Container.loadedTo(truck);
beer2Container.loadedTo(truck);
beer3Container.loadedTo(truck);
beer4Container.loadedTo(truck);
beer5Container.loadedTo(truck);
beer6Container.loadedTo(truck);

beer1Container.updateTemperature(7);

truck.showContainerTemperature();
