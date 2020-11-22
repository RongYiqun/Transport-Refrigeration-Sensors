const Container = require("./Container");
const eventType = require("./Monitor").eventType;
const { CHECK_TEMPERATURE, REMOVE_CONTAINER, ADD_CONTAINER } = eventType;
const EventEmitter = require("events").EventEmitter;
describe("Container object", () => {
  it("updateTemperature without monitor", () => {
    const id = "d9a5ddde-0254-49df-8d16-8dc614f992ee";
    const container = new Container("beer1", id, 4, 6, 5);
    const newTemp = 7;
    container.updateTemperature(newTemp);
    expect(container.temperature).toBe(newTemp);
    expect(container.monitor).toBe(null);
  });

  it("updateTemperature with monitor", () => {
    const eventEmitter = new EventEmitter();
    const id = "d9a5ddde-0254-49df-8d16-8dc614f992ee";
    const container = new Container("beer1", id, 4, 6, 5);
    const eventEmitter_emit = jest.spyOn(eventEmitter, "emit");
    const newTemp = 7;
    container.monitor = eventEmitter;
    container.updateTemperature(newTemp);
    expect(eventEmitter_emit).toHaveBeenCalledWith(
      CHECK_TEMPERATURE,
      id,
      newTemp
    );
  });

  it("loadedTo without previous monitor", () => {
    const currentEventEmitter = new EventEmitter();
    const id = "d9a5ddde-0254-49df-8d16-8dc614f992ee";
    const container = new Container("beer1", id, 4, 6, 5);
    const currentEventEmitter_emit = jest.spyOn(currentEventEmitter, "emit");
    container.loadedTo(currentEventEmitter);
    expect(currentEventEmitter_emit).toHaveBeenNthCalledWith(
      1,
      ADD_CONTAINER,
      id,
      new Container("beer1", id, 4, 6, 5)
    );

    expect(currentEventEmitter_emit).toHaveBeenNthCalledWith(
      2,
      CHECK_TEMPERATURE,
      id,
      5
    );
  });

  it("loadedTo with previous monitor", () => {
    const currentEventEmitter = new EventEmitter();
    const previousEventEmitter = new EventEmitter();
    const id = "d9a5ddde-0254-49df-8d16-8dc614f992ee";
    const container = new Container("beer1", id, 4, 6, 5);
    container.monitor = previousEventEmitter;
    const currentEventEmitter_emit = jest.spyOn(currentEventEmitter, "emit");
    const previousEventEmitter_emit = jest.spyOn(previousEventEmitter, "emit");
    container.loadedTo(currentEventEmitter);
    expect(previousEventEmitter_emit).toHaveBeenCalledWith(
      REMOVE_CONTAINER,
      id
    );

    expect(currentEventEmitter_emit).toHaveBeenNthCalledWith(
      1,
      ADD_CONTAINER,
      id,
      new Container("beer1", id, 4, 6, 5)
    );

    expect(currentEventEmitter_emit).toHaveBeenNthCalledWith(
      2,
      CHECK_TEMPERATURE,
      id,
      5
    );
  });

  it("unloaded with monitor", () => {
    const currentEventEmitter = new EventEmitter();
    const id = "d9a5ddde-0254-49df-8d16-8dc614f992ee";
    const container = new Container("beer1", id, 4, 6, 5);
    container.monitor = currentEventEmitter;
    const currentEventEmitter_emit = jest.spyOn(currentEventEmitter, "emit");
    container.unloaded();
    expect(currentEventEmitter_emit).toHaveBeenCalledWith(REMOVE_CONTAINER, id);
    expect(container.monitor).toBe(null);
  });

  it("unloaded without monitor", () => {
    const id = "d9a5ddde-0254-49df-8d16-8dc614f992ee";
    const container = new Container("beer1", id, 4, 6, 5);
    const log = jest.spyOn(global.console, "log");
    container.unloaded();
    expect(log).toHaveBeenCalledWith(
      `this container is not loaded to any truck`
    );
  });
});
