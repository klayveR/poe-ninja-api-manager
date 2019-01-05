/*globals jest*/
const Helpers = require("./helpers");

describe("Helper class", () => {
    describe("isSameObject", () => {
        it("Should return true exact same object", () => {
            const object = {
                property: "test"
            };

            expect(Helpers.isSameObject(object, object)).toEqual(true);
        });

        it("Should return true for two objects with the same properties", () => {
            const object1 = {
                property: "test"
            };
            const object2 = {
                property: "test"
            };

            expect(Helpers.isSameObject(object1, object2)).toEqual(true);
        });

        it("Should return false for two objects with different properties", () => {
            const object1 = {
                property: "foo"
            };
            const object2 = {
                property: "bar"
            };

            expect(Helpers.isSameObject(object1, object2)).toEqual(false);
        });
    });
});
