// const CORS_URL = "https://cors-anywhere.herokuapp.com/";
const SERVER_URL = "https://westwine.herokuapp.com/wines/";

const fetchWineByID = (wineID) => {
  return fetch(`${SERVER_URL}${wineID}`)
    .then((response) => response.json())
}

const fetchWines = () => {
  return fetch(`${SERVER_URL}`)
    .then((response) => response.json())
}

const addWine = (wineObject) => {
  return fetch(`${SERVER_URL}/new`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(wineObject)
  })
}


export default {
  fetchWineByID,
  fetchWines,
  addWine
}
