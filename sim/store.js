const { createStore } = require('redux')
const { pokebot } = require('./reducers')

const store1 = createStore(pokebot)
const store2 = createStore(pokebot)

module.exports = { store1, store2 }
