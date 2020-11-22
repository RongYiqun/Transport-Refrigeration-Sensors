const eventType = require("./Monitor").eventType;
const { CHECK_TEMPERATURE, REMOVE_CONTAINER, ADD_CONTAINER } = eventType;

class Container {
  constructor(name, id, tempMin, tempMax, temperature) {
    this.name = name;
    this.id = id;
    this.maxTemperature = tempMax;
    this.minTemperature = tempMin;
    this.temperature = temperature;
    this.monitor = null;
  }

  updateTemperature(temperature) {
    this.temperature = temperature;
    this.monitor && this.monitor.emit(CHECK_TEMPERATURE, this.id, temperature);
  }

  loadedTo(monitor) {
    if (this.monitor) {
      this.monitor.emit(REMOVE_CONTAINER, this.id);
      this.monitor = null;
    }
    monitor.emit(ADD_CONTAINER, this.id, { ...this });
    monitor.emit(CHECK_TEMPERATURE, this.id, this.temperature);
    this.monitor = monitor;
  }

  unloaded() {
    if (this.monitor) {
      this.monitor.emit(REMOVE_CONTAINER, this.id);
      this.monitor = null;
    } else {
      console.log(`this container is not loaded to any truck`);
    }
  }
}

module.exports = Container;
