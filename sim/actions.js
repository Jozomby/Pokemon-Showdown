const SET_INITIAL_STATE = 'SET_INITIAL_STATE'
const UPDATE_STATE_FROM_REQUEST = 'UPDATE_STATE_FROM_REQUEST'
const MOVE = 'MOVE'
const SWITCH_POKEMON = 'SWITCH_POKEMON'
const TURN = 'TURN'
const FORME_CHANGE = 'FORME_CHANGE'
const FAINT = 'FAINT'
const START = 'START'
const END = 'END'
const HP_CHANGE = 'HP_CHANGE'
const INFLICT_STATUS = 'INFLICT_STATUS'
const CURE_STATUS = 'CURE_STATUS'
const CURE_TEAM = 'CURE_TEAM'
const STAT_CHANGE = 'STAT_CHANGE'
const WEATHER = 'WEATHER'
const START_FIELD_CONDITION = 'START_FIELD_CONDITION'
const END_FIELD_CONDITION = 'END_FIELD_CONDITION'
const START_SIDE_CONDITION = 'START_SIDE_CONDITION'
const END_SIDE_CONDITION = 'END_SIDE_CONDITION'
const ITEM_CHANGE = 'ITEM_CHANGE'
const ITEM_END = 'ITEM_END'
const ABILITY_CHANGE = 'ABILITY_CHANGE'
const ABILITY_END = 'ABILITY_END'
const TRANSFORM = 'TRANSFORM'
const MEGA_EVOLVE = 'MEGA_EVOLVE'

function setInitialState(team, playerId, opponentId) {
  return { type: SET_INITIAL_STATE, team, playerId, opponentId }
}

function updateStateFromRequest(request) {
  return { type: UPDATE_STATE_FROM_REQUEST, request }
}

function move(sourcePlayer, sourcePokemon, move, targetPlayer, targetPokemon) {
  return { type: MOVE, sourcePlayer, sourcePokemon, move, targetPlayer, targetPokemon }
}

function switchPokemon(player, pokemon, hp, status) {
  return { type: SWITCH_POKEMON, player, pokemon, hp, status }
}

function turn(number) {
  return { type: TURN, number }
}

function formeChange(player, pokemon, newForme, hp, status ) {
  return { type: FORME_CHANGE, player, pokemon, newForme, hp, status }
}

function faint(player, pokemon) {
  return { type: FAINT, player, pokemon }
}

function start(player, pokemon, effect) {
  return { type: START, player, pokemon, effect }
}

function end(player, pokemon, effect) {
  return { type: END, player, pokemon, effect }
}

function hpChange(player, pokemon, hp, status) {
  return { type: HP_CHANGE, player, pokemon, hp, status }
}

function inflictStatus(player, pokemon, status) {
  return { type: INFLICT_STATUS, player, pokemon, status }
}

function cureStatus(player, pokemon, status) {
  return { type: CURE_STATUS, player, pokemon, status }
}

function cureTeam(player) {
  return { type: CURE_TEAM, player }
}

function statChange(player, pokemon, stat, amount) {
  return { type: STAT_CHANGE, player, pokemon, stat, amount }
}

function weather(weather) {
  return { type: WEATHER, weather }
}

function startFieldCondition(condition) {
  return { type: START_FIELD_CONDITION, condition }
}

function endFieldCondition(condition) {
  return { type: END_FIELD_CONDITION, condition }
}

function startSideCondition(player, condition) {
  return { type: START_FIELD_CONDITION, player, condition }
}

function endSideCondition(player, condition) {
  return { type: END_FIELD_CONDITION, player, condition }
}

function itemChange(player, pokemon, item) {
  return { type: ITEM_CHANGE, player, pokemon, item }
}

function itemEnd(player, pokemon) {
  return { type: ITEM_END, player, pokemon }
}

function abilityChange(player, pokemon, ability) {
  return { type: ABILITY_CHANGE, player, pokemon, ability }
}

function abilityEnd(player, pokemon) {
  return { type: ABILITY_END, player, pokemon }
}

function transform(player, pokemon, species) {
  return { type: TRANSFORM, player, pokemon, species }
}

function megaEvolve(player, pokemon) {
  return { type: MEGA_EVOLVE, player, pokemon }
}

module.exports = {
  SET_INITIAL_STATE,
  UPDATE_STATE_FROM_REQUEST,
  MOVE,
  SWITCH_POKEMON,
  TURN,
  FORME_CHANGE,
  FAINT,
  START,
  END,
  HP_CHANGE,
  INFLICT_STATUS,
  CURE_STATUS,
  CURE_TEAM,
  STAT_CHANGE,
  WEATHER,
  START_FIELD_CONDITION,
  END_FIELD_CONDITION,
  START_SIDE_CONDITION,
  END_SIDE_CONDITION,
  ITEM_CHANGE,
  ITEM_END,
  ABILITY_CHANGE,
  ABILITY_END,
  TRANSFORM,
  MEGA_EVOLVE,
  setInitialState,
  updateStateFromRequest,
  move,
  switchPokemon,
  turn,
  formeChange,
  faint,
  start,
  end,
  hpChange,
  inflictStatus,
  cureStatus,
  cureTeam,
  statChange,
  weather,
  startFieldCondition,
  endFieldCondition,
  startSideCondition,
  endSideCondition,
  itemChange,
  itemEnd,
  abilityChange,
  abilityEnd,
  transform,
  megaEvolve
}
