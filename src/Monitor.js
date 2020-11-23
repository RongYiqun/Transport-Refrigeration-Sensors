const EventEmitter = require("events").EventEmitter;

const eventType = {
  CHECK_TEMPERATURE: "check_temperature",
  REMOVE_CONTAINER: "remove_container",
  ADD_CONTAINER: "add_container",
};

class Monitor extends EventEmitter {
  constructor() {
    super();
    this.containers = {};
    this.on(eventType.CHECK_TEMPERATURE, function (containerId, temperature) {
      const targetContainer = this.containers[containerId];
      targetContainer.temperature = temperature;
      if (
        temperature < targetContainer.minTemperature ||
        temperature > targetContainer.maxTemperature
      ) {
        console.log(
          `container ${targetContainer.name} with id ${targetContainer.id} fall outside of the temperature range`
        );
      }
    });

    this.on(eventType.ADD_CONTAINER, function (
      containerId,
      name,
      minTemperature,
      maxTemperature,
      temperature
    ) {
      if (!(containerId in this.containers)) {
        this.containers[containerId] = {
          id: containerId,
          name,
          minTemperature,
          maxTemperature,
          temperature,
        };
      } else {
        console.log(`container with id ${containerId} already exist`);
      }
    });

    this.on(eventType.REMOVE_CONTAINER, function (containerId) {
      if (containerId in this.containers) {
        delete this.containers[containerId];
      } else {
        console.log(`container with id ${containerId} already removed`);
      }
    });
  }

  showContainerTemperature() {
    const tempInfo = {};
    for (let [key, value] of Object.entries(this.containers)) {
      tempInfo[key] = {
        name: value.name,
        temperature: value.temperature,
      };
    }
    return tempInfo;
  }
}

module.exports.eventType = eventType;
module.exports.Monitor = Monitor;
