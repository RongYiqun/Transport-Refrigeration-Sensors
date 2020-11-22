const Monitor = require("./Monitor").Monitor;
const eventType = require("./Monitor").eventType;
const Container = require("./Container");
const { CHECK_TEMPERATURE, REMOVE_CONTAINER, ADD_CONTAINER } = eventType;
describe("monitor", () => {
  it("check_temperature event is fired, the temperature is out of the range", () => {
    const newTemp = 7;
    const monitor = new Monitor();
    const id = "d9a5ddde-0254-49df-8d16-8dc614f992ee";
    monitor.containers[id] = new Container("beer1", id, 4, 6, 5);
    const log = jest.spyOn(global.console, "log");
    monitor.emit(CHECK_TEMPERATURE, id, newTemp);
    expect(monitor.containers[id].temperature).toBe(newTemp);
    expect(log).toBeCalled();
    log.mockRestore();
  });

  it("add_container event is fired, the temperature is within the range", () => {
    const newTemp = 6;
    const monitor = new Monitor();
    const id = "d9a5ddde-0254-49df-8d16-8dc614f992ee";
    monitor.containers[id] = new Container("beer1", id, 4, 6, 5);
    const log = jest.spyOn(global.console, "log");
    monitor.emit(CHECK_TEMPERATURE, id, newTemp);
    expect(monitor.containers[id].temperature).toBe(newTemp);
    expect(log).not.toBeCalled();
    log.mockRestore();
  });

  it("add_container event is fired, addition success", () => {
    const monitor = new Monitor();
    const id = "d9a5ddde-0254-49df-8d16-8dc614f992ee";
    const container = new Container("beer1", id, 4, 6, 5);
    monitor.emit(ADD_CONTAINER, id, container);
    expect(monitor.containers[id]).toBe(container);
  });

  it("add_container event is fired, addition fail", () => {
    const monitor = new Monitor();
    const id = "d9a5ddde-0254-49df-8d16-8dc614f992ee";
    const container = new Container("beer1", id, 4, 6, 5);
    const log = jest.spyOn(global.console, "log");
    monitor.containers[id] = container;
    monitor.emit(ADD_CONTAINER, id, container);
    expect(monitor.containers[id]).toBe(container);
    expect(log).toHaveBeenCalledWith(`container with id ${id} already exist`);
    log.mockRestore();
  });

  it("remove_container event is fired, removal success", () => {
    const monitor = new Monitor();
    const id = "d9a5ddde-0254-49df-8d16-8dc614f992ee";
    monitor.containers[id] = new Container("beer1", id, 4, 6, 5);
    monitor.emit(REMOVE_CONTAINER, id);
    expect(id in monitor.containers).toBe(false);
  });

  it("remove_container event is fired, removal fail", () => {
    const monitor = new Monitor();
    const id = "d9a5ddde-0254-49df-8d16-8dc614f992ee";
    const log = jest.spyOn(global.console, "log");
    monitor.emit(REMOVE_CONTAINER, id);
    expect(id in monitor.containers).toBe(false);
    expect(log).toHaveBeenCalledWith(`container with id ${id} already removed`);
  });

  it("showContainerTemperature", () => {
    const monitor = new Monitor();
    const id1 = "d9a5ddde-0254-49df-8d16-8dc614f992ee";
    const id2 = "d9a5ddde-0254-49df-8d16-8dc614f992ee";
    monitor.containers[id1] = new Container("beer1", id1, 4, 6, 5);
    monitor.containers[id2] = new Container("beer2", id2, 5, 7, 6);
    expect(monitor.showContainerTemperature()).toEqual({
      [id1]: {
        name: "beer1",
        temperature: 5,
      },
      [id2]: {
        name: "beer2",
        temperature: 6,
      },
    });
  });
});
