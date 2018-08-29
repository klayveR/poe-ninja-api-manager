const Helpers = require("./helpers.js");

/*
/ This used to be a requests manager, now it doesn't do much anymore
/ I still decided to keep it for nostalgic reasons
*/
class Request {
  constructor(api, league) {
    this.api = api;
    this.league = league;
  }

  /*
  * Returns data about this request
  */
  get() {
    return {
      url: Helpers.buildApiUrl(this.api.overview, this.api.type, this.league),
      type: this.api.type,
      league: this.league
    };
  }
}

module.exports = Request;
