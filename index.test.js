const NinjaAPI = require("./index");
const request = require("request-promise-native");

jest.mock("request-promise-native");

const LEAGUE = "Standard";
const HEADER = { "headers": { "Connection": "keep-alive" }, "json": true };

const buildAPI = (type, overview = "item") => {
    return `https://poe.ninja/api/data/${overview}overview?league=${LEAGUE}&type=${type}`;
};

describe("NinjaAPI class", () => {
    describe("Calling the POE ninja api", () => {
        let ninjaAPI;

        beforeEach(() => {
            const basicApiResponse = { lines: [] };
            request.mockImplementation(() => Promise.resolve(basicApiResponse));

            ninjaAPI = new NinjaAPI({
                league: LEAGUE
            });
        });

        it("Should call the POE ninja api for the various types", done => {
            ninjaAPI.update();

            // TODO: Fix the timeout in the _requestApiData method to prevent 
            // the need for this timeout.
            setTimeout(() => {
                expect(request).toHaveBeenCalledWith(buildAPI("Scarab"), HEADER);
                expect(request).toHaveBeenCalledWith(buildAPI("Resonator"), HEADER);
                expect(request).toHaveBeenCalledWith(buildAPI("Fossil"), HEADER);
                expect(request).toHaveBeenCalledWith(buildAPI("UniqueAccessory"), HEADER);
                expect(request).toHaveBeenCalledWith(buildAPI("UniqueArmour"), HEADER);
                expect(request).toHaveBeenCalledWith(buildAPI("UniqueWeapon"), HEADER);
                expect(request).toHaveBeenCalledWith(buildAPI("UniqueFlask"), HEADER);
                expect(request).toHaveBeenCalledWith(buildAPI("UniqueJewel"), HEADER);
                expect(request).toHaveBeenCalledWith(buildAPI("Map"), HEADER);
                expect(request).toHaveBeenCalledWith(buildAPI("UniqueMap"), HEADER);
                expect(request).toHaveBeenCalledWith(buildAPI("Essence"), HEADER);
                expect(request).toHaveBeenCalledWith(buildAPI("SkillGem"), HEADER);
                expect(request).toHaveBeenCalledWith(buildAPI("Prophecy"), HEADER);
                expect(request).toHaveBeenCalledWith(buildAPI("DivinationCard"), HEADER);
                expect(request).toHaveBeenCalledWith(buildAPI("Fragment", "currency"), HEADER);
                expect(request).toHaveBeenCalledWith(buildAPI("Currency", "currency"), HEADER);
                done();
            }, 3000);
        });
    });
});
