const fetch = require("node-fetch");

const pinata = "https://gateway.pinata.cloud/ipfs/";

for (let i = 0; i < 20; i++) {
  const address = `https://storage.googleapis.com/kepler-452b/cell_metadata/cell_001/Kepler-452b%20%23${i}.json`;
  fetch(address)
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      const url = pinata + res.image.substring(7);
      console.log(url);
    });
}
