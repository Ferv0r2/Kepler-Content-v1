const fetch = require("node-fetch");

address = "https://storage.googleapis.com/kepler-452b/evol_log/evol_log.json";

evol_log = fetch(address)
  .then((res) => {
    res.json();
  })
  .then((res) => {
    console.log(res);
  });

export default evol_log;
