import {ReduxManager, createState} from "../src"
import StateContainer from '../src/StateContainer'

describe("Store set up", () => {
    /* setup the smart state */
    let testStore;

    let initialStateNested = {
        testArrayNested: ["orion", "onion", "roion", "noion"]
    };

    let initialState = {
        testNumber: 365,
        testBoolean: true,
        testString: "abulala_wuluta",
        testArray: ["orion", "onion", "roion", "noion"],
        testArrayofObject: [
            {obj1: "orion"},
            {obj2: "onion"},
            {obj3: "roion", obj4: "noion"}
        ],
        testObject: {
            part1: "i'm part 1",
            part2: "i'm part 2"
        },
        testNull: null,
        smartStateNested: createState("testStoreNested", initialStateNested)
    };

    beforeAll(() => {
        testStore = createState("testStore", initialState);
    });

    afterEach(() => {
        jest.restoreAllMocks(); //only for mocks done by spyOn
    });

    /* test the smart state properties */
    describe("The smart state", () => {
        /* test the types of smart state initial values */
        it("should have the elements defined in the initial state and their types should be SmartState", () => {
            expect(testStore.testNumber instanceof StateContainer).toBe(true);
            expect(testStore.testBoolean instanceof StateContainer).toBe(true);
            expect(testStore.testString instanceof StateContainer).toBe(true);
            expect(testStore.testArray instanceof StateContainer).toBe(true);
            expect(testStore.testArrayofObject instanceof StateContainer).toBe(true);
            expect(testStore.testObject instanceof StateContainer).toBe(true);
            expect(testStore.testNull instanceof StateContainer).toBe(true);
            expect(testStore.smartStateNested instanceof StateContainer).toBe(true);
        });

        it("should have the initial values as the ones passed in", () => {
            expect(testStore.testNumber.name).toBe("testNumber");
            expect(testStore.testNumber.path).toBe("testStore.testNumber");
            expect(typeof testStore.testNumber.initialValue).toBe("number");
            expect(testStore.testNumber.initialValue).toEqual(365);

            expect(testStore.testBoolean.name).toBe("testBoolean");
            expect(testStore.testBoolean.path).toBe("testStore.testBoolean");
            expect(typeof testStore.testBoolean.initialValue).toBe("boolean");
            expect(testStore.testBoolean.initialValue).toEqual(true);

            expect(testStore.testString.name).toBe("testString");
            expect(testStore.testString.path).toBe("testStore.testString");
            expect(typeof testStore.testString.initialValue).toBe("string");
            expect(testStore.testString.initialValue).toEqual("abulala_wuluta");

            expect(testStore.testArray.name).toBe("testArray");
            expect(testStore.testArray.path).toBe("testStore.testArray");
            expect(Array.isArray(testStore.testArray.initialValue)).toBe(true);
            expect(testStore.testArray.initialValue).toEqual([
                "orion",
                "onion",
                "roion",
                "noion"
            ]);

            expect(testStore.testArrayofObject.name).toBe("testArrayofObject");
            expect(testStore.testArrayofObject.path).toBe("testStore.testArrayofObject");
            expect(Array.isArray(testStore.testArrayofObject.initialValue)).toBe(
                true
            );
            expect(testStore.testArrayofObject.initialValue).toEqual([
                {obj1: "orion"},
                {obj2: "onion"},
                {obj3: "roion", obj4: "noion"}
            ]);

            expect(testStore.testObject.name).toBe("testObject");
            expect(testStore.testObject.path).toBe("testStore.testObject");
            expect(typeof testStore.testObject.initialValue).toBe("object");
            expect(testStore.testObject.initialValue).toEqual({
                part1: "i'm part 1",
                part2: "i'm part 2"
            });

            expect(testStore.testNull.name).toBe("testNull");
            expect(testStore.testNull.path).toBe("testStore.testNull");
            expect(typeof testStore.testNull.initialValue).toBe("object");
            expect(testStore.testNull.initialValue).toEqual(null);
        });

        /* test the state have a property get and its type is a function */
        it("should have a get property and its type should be a function", () => {
            expect(typeof testStore.testNumber.get).toBe("function");
            expect(typeof testStore.testBoolean.get).toBe("function");
            expect(typeof testStore.testString.get).toBe("function");
            expect(typeof testStore.testArray.get).toBe("function");
            expect(typeof testStore.testObject.get).toBe("function");

        });

        /* test the get functionality */
        it("should have get property that works as a selector", () => {
            let changedState = {
                testStore: {
                    testNumber: 125,
                    testBoolean: false,
                    testString: "wuluta_abulala",
                    testArray: ["roion", "noion", "orion", "onion"],
                    testObject: {
                        part3: "i'm part 3",
                        part4: "i'm part 4"
                    }
                }
            };
            ReduxManager.getState = jest.spyOn(ReduxManager, "getState");
            ReduxManager.getState.mockImplementation(() => changedState);
            expect(testStore.testNumber.get()).toEqual(125);
            expect(testStore.testBoolean.get()).toEqual(false);
            expect(testStore.testString.get()).toEqual(
                "wuluta_abulala"
            );
            expect(testStore.testArray.get()).toEqual([
                "roion",
                "noion",
                "orion",
                "onion"
            ]);
            expect(testStore.testObject.get()).toEqual({
                part3: "i'm part 3",
                part4: "i'm part 4"
            });
            expect(testStore.testObject.get()).toEqual({
                part3: "i'm part 3",
                part4: "i'm part 4"
            });
        });

        /* test the state have a property set and its type is a function */
        it("should have a set property and its type should be a function", () => {
            ReduxManager.dispatch = jest.spyOn(ReduxManager, "dispatch").mockImplementation((action) => {
                // console.log({action})
            });
            testStore.testNumber.set(22);
            expect(ReduxManager.dispatch).toBeCalledWith({type: "testStore.testNumber.set", value: 22});

            expect(typeof testStore.testBoolean.set).toBe("function");
            testStore.testBoolean.set(true);
            expect(ReduxManager.dispatch).toBeCalledWith({type: "testStore.testBoolean.set", value: true});

            expect(typeof testStore.testString.set).toBe("function");
            testStore.testString.set("ta_ab");
            expect(ReduxManager.dispatch).toBeCalledWith({type: "testStore.testString.set", value: "ta_ab"});

            expect(typeof testStore.testArray.set).toBe("function");
            testStore.testArray.set(["orion", "onion"]);
            expect(ReduxManager.dispatch).toBeCalledWith({type: "testStore.testArray.set", value: ["orion", "onion"]});

            expect(typeof testStore.testObject.set).toBe("function");
            testStore.testObject.set({part0: 0, part5: 5});
            expect(ReduxManager.dispatch).toBeCalledWith({
                type: "testStore.testObject.set",
                value: {part0: 0, part5: 5}
            });

            /* additional properties for object*/
            expect(typeof testStore.testObject.update).toBe("function");
            testStore.testObject.update({part5: "str5"});
            expect(ReduxManager.dispatch).toBeCalledWith({type: "testStore.testObject.update", value: {part5: "str5"}});

            /* additional properties for array*/
            expect(typeof testStore.testArray.updateItems).toBe("function");
            testStore.testArray.updateItems(item => item === "orion", "norion");
            expect(ReduxManager.dispatch).toBeCalledWith(expect.objectContaining({
                type: "testStore.testArray.updateItems",
                value: "norion"
            }));

            expect(typeof testStore.testArray.deleteItems).toBe("function");
            testStore.testArray.deleteItems(item => item === "orion");
            expect(ReduxManager.dispatch).toBeCalledWith(expect.objectContaining({type: "testStore.testArray.deleteItems"}));

            expect(typeof testStore.testArray.addItem).toBe("function");
            testStore.testArray.addItem("rion");
            expect(ReduxManager.dispatch).toBeCalledWith(expect.objectContaining({
                type: "testStore.testArray.addItem",
                item: "rion"
            }));

            /* additional set properties for array of object*/
            expect(typeof testStore.testArray.updateItems).toBe("function");
            testStore.testArray.updateItems(item => item.newObj2 === "orion", {newObj2: "nonion"});
            expect(ReduxManager.dispatch).toBeCalledWith(expect.objectContaining({
                type: "testStore.testArray.updateItems",
                value: {newObj2: "nonion"}
            }));

            expect(typeof testStore.testArray.deleteItems).toBe("function");
            testStore.testArray.deleteItems(item => item.obj2 === "onion");
            expect(ReduxManager.dispatch).toBeCalledWith(expect.objectContaining({type: "testStore.testArray.deleteItems"}));

            expect(typeof testStore.testArray.addItem).toBe("function");
            testStore.testArray.addItem({obj5: "norion"});
            expect(ReduxManager.dispatch).toBeCalledWith(expect.objectContaining({
                type: "testStore.testArray.addItem",
                item: {obj5: "norion"}
            }));
        });

        /* test the root state have a property getReducers and its functionality */
        it("should have a reducers property and its functionality", () => {
            let rootReducer = testStore.reducer;
            expect(typeof rootReducer).toBe("function");

            let oldState = {
                testNumber: 365,
                testBoolean: true,
                testString: "abulala_wuluta",
                testArray: ["orion", "onion", "roion", "noion"],
                testArrayofObject: [
                    {obj1: "orion"},
                    {obj2: "onion"},
                    {obj3: "roion", obj4: "noion"}
                ],
                testObject: {part1: "i'm part 1", part2: "i'm part 2"}
            };
            const store = ReduxManager.createStore({});
            ReduxManager.registerState(testStore);
            // ReduxManager.dispatch.mockRestore();

            testStore.testNumber.set(102);
            expect(testStore.testNumber.get()).toEqual(102);

            let action = {type: "testStore.testNumber.set", value: 102};
            let newState = rootReducer(oldState, action);
            expect(newState.testNumber).toEqual(102);

            action = {type: "testStore.testBoolean.set", value: false}
            newState = rootReducer(oldState, action);
            expect(newState.testBoolean).toEqual(false);

            action = {type: "testStore.testString.set", value: "new string"}
            newState = rootReducer(oldState, action);
            expect(newState.testString).toEqual("new string");

            action = {type: "testStore.testArray.set", value: ["orion", "onion"]};
            newState = rootReducer(oldState, action);
            expect(newState.testArray).toEqual(["orion", "onion"]);

            action = {
                type: "testStore.testObject.set", value: {
                    part3: "i'm part 3",
                    part4: "i'm part 4"
                }
            };
            newState = rootReducer(oldState, action);
            expect(newState.testObject).toEqual({
                part3: "i'm part 3",
                part4: "i'm part 4"
            });

            /* additional reducer functionality for an object*/
            action = {
                type: "testStore.testObject.update", value: {
                    part1: "i'm updated part 1",
                }
            };
            newState = rootReducer(oldState, action);
            expect(newState.testObject).toEqual({
                part1: "i'm updated part 1",
                part2: "i'm part 2"
            });

            action = {
                type: "testStore.testObject.update", value: {
                    part3: "i'm new part 3",
                }
            };
            newState = rootReducer(oldState, action);
            expect(newState.testObject).toEqual({
                part1: "i'm part 1",
                part2: "i'm part 2",
                part3: "i'm new part 3"
            });

            /*  additional reducer functionality for an array*/
            action = {type: "testStore.testArray.updateItems", query: item => item === "orion", value: "norion"};
            newState = rootReducer(oldState, action);
            expect(newState.testArray).toEqual(["norion", "onion", "roion", "noion"]);

            action = {type: "testStore.testArray.updateItems", query: item => item === "norion", value: "nonrion"};
            newState = rootReducer(oldState, action);
            expect(newState.testArray).toEqual(["orion", "onion", "roion", "noion"]);

            action = {type: "testStore.testArray.deleteItems", query: item => item === "orion"};
            newState = rootReducer(oldState, action);
            expect(newState.testArray).toEqual(["onion", "roion", "noion"]);

            action = {type: "testStore.testArray.addItem", item: "norion"};
            newState = rootReducer(oldState, action);
            expect(newState.testArray).toEqual([
                "orion",
                "onion",
                "roion",
                "noion",
                "norion"
            ]);

            /*  additional reducer functionality for an array of object*/
            action = {
                type: "testStore.testArrayofObject.updateItems",
                query: item => item.obj2 === "onion",
                value: {obj2: "nonion"}
            };
            newState = rootReducer(oldState, action);
            expect(newState.testArrayofObject).toEqual([
                {obj1: "orion"},
                {obj2: "nonion"},
                {obj3: "roion", obj4: "noion"}
            ]);

            action = {type: "testStore.testArrayofObject.deleteItems", query: item => item.obj2 === "onion"};
            newState = rootReducer(oldState, action);
            expect(newState.testArrayofObject).toEqual([
                {obj1: "orion"},
                {obj3: "roion", obj4: "noion"}
            ]);

            action = {type: "testStore.testArrayofObject.addItem", item: {obj5: "norion"}};
            newState = rootReducer(oldState, action);
            expect(newState.testArrayofObject).toEqual([
                {obj1: "orion"},
                {obj2: "onion"},
                {obj3: "roion", obj4: "noion"},
                {obj5: "norion"}
            ]);
        });

        it("a smart state element has a reducer property and its type is a function", () => {
            let reducer = testStore.testNumber.reducer;
            expect(typeof reducer).toBe("function");
            let defautlState = reducer(undefined, {type: "test"});
            expect(defautlState).toBe(365);
        });

        describe("The nested smart state", () => {
            /* test the nested state have a property set and has the correct type */
            it("should have a get property and its type should be a function", () => {
                let changedState = {testStore:{
                    smartStateNested: {
                        testArrayNested: ["roion", "noion", "orion", "onion"]
                    }
                }};
                ReduxManager.getState = jest.spyOn(ReduxManager, "getState");
                ReduxManager.getState.mockImplementation(() => changedState);
                expect(typeof testStore.smartStateNested.testArrayNested.get).toBe(
                    "function"
                );
                expect(
                    testStore.smartStateNested.testArrayNested.get()
                ).toEqual(["roion", "noion", "orion", "onion"]);
            });
            /* test the nested state have a property set and has the correct type */
            it("should have a set property and its type should be a function", () => {
                expect(typeof testStore.smartStateNested.testArrayNested.set).toBe(
                    "function"
                );
                let action = {type: "testStore.smartStateNested.testArrayNested.set", value:102};
                ReduxManager.dispatch = jest.spyOn(ReduxManager, "dispatch").mockImplementation((action) => {
                    // console.log({action})
                });
                testStore.smartStateNested.testArrayNested.set(102)
                expect(ReduxManager.dispatch).toBeCalledWith(action);
            });
            /* test the nested state have a property set and has the correct type */
            it("should have a getReducers property and functionality", () => {
                let rootReducer = testStore.reducer;
                let oldState = {
                    smartStateNested: {
                        testArrayNested: ["roion", "noion", "orion", "onion"]
                    }
                };
                let action = {type: "testStore.smartStateNested.testArrayNested.set", value:102};
                let newState = rootReducer(oldState, action);
                expect(newState.smartStateNested.testArrayNested).toEqual(102);
            });
        });
    });
});
