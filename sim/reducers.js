const omit = require('lodash/omit')
const groupBy = require('lodash/groupBy')
const {
	SET_INITIAL_STATE,
	UPDATE_STATE_FROM_REQUEST,
	UPDATE_STATE_FROM_CHUNK,
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
	ACTIVATE
} = require('./actions')
const Dex = require('./dex')

const initialState = {
	player: {
		id: '',
		spikes: 0,
		toxicSpikes: 0,
		stealthRock: false,
		uproar: {
			active: false,
			turns: 0
		},
		reflect: {
			active: false,
			turns: 0
		},
		lightScreen: {
			active: false,
			turns: 0
		},
		safeguard: {
			active: false,
			turns: 0
		},
		mist: {
			active: false,
			turns: 0
		},
		luckyChant: {
			active: false,
			turns: 0
		},
		tailwind: {
			active: false,
			turns: 0
		},
		pokemon: []
	},
	opponent: {
		id: '',
		spikes: 0,
		toxicSpikes: 0,
		stealthRock: false,
		uproar: {
			active: false,
			turns: 0
		},
		reflect: {
			active: false,
			turns: 0
		},
		lightScreen: {
			active: false,
			turns: 0
		},
		safeguard: {
			active: false,
			turns: 0
		},
		mist: {
			active: false,
			turns: 0
		},
		luckyChant: {
			active: false,
			turns: 0
		},
		tailwind: {
			active: false,
			turns: 0
		},
		pokemon: []
	},
	fieldEffects: {
		weather: {
			type: 'none',
			turns: 0
		},
		electricterrain: {
			active: false,
			turns: 0
		},
		grassyterrain: {
			active: false,
			turns: 0
		},
		mistyterrain: {
			active: false,
			turns: 0
		},
		psychicterrain: {
			active: false,
			turns: 0
		},
		trickroom: {
			active: false,
			turns: 0
		},
		wonderroom: {
			active: false,
			turns: 0
		},
		magicroom: {
			active: false,
			turns: 0
		},
		gravity: {
			active: false,
			turns: 0
		},
		mudsport: {
			active: false,
			turns: 0
		},
		watersport: {
			active: false,
			turns: 0
		},
		perishsong: {
			active: false,
			turns: 0
		}
	}
}

function updatePokemon(state, player, pokemon, key, value) {
	return state.map(user => {
		if (user.id === player) {
			const containsPokemon = user.pokemon.reduce((accumulator, poke) => {
				return poke.name === pokemon
			}, false)
			if (!containsPokemon) {
				return {
					...user,
					pokemon: [
						...user.pokemon,
						{
							name: pokemon,
							[key]: value
						}
					]
				}
			} else {
				return {
					...user,
					pokemon: user.pokemon.map(poke => {
						if (poke.name === pokemon) {
							return {
								...poke,
								[key]: value
							}
						} else {
							return poke
						}
					})
				}
			}
		} else {
			return user
		}
	})
}

function pokebot(state = initialState, action) {
	switch (action.type) {
		case SET_INITIAL_STATE:
			return {
				...state,
				player: {
					...state.player,
					id: action.playerId,
					hazards: state.hazards,
					weather: state.weather,
					pokemon: action.team.map(pokemon => {
						return omit(
							{ ...pokemon, type: Dex.getTemplate(pokemon.name).types },
							['species', 'evs', 'ivs', 'nature', 'shiny']
						)
					})
				},
				opponent: {
					...state.opponent,
					id: action.opponentId
				}
			}
			break
		case UPDATE_STATE_FROM_REQUEST:
			const groupedPokemon = groupBy(
				state.player.pokemon.concat(action.request.side.pokemon),
				pokemon => pokemon.name || pokemon.details.split(',')[0]
			)
			const pokemon = Object.entries(groupedPokemon).map(pokemon => {
				const oldPokemon = pokemon[1][0].name
					? pokemon[1][0]
					: pokemon[1][1]
				const newPokemon = !pokemon[1][0].name
					? pokemon[1][0]
					: pokemon[1][1]

				return {
					name: oldPokemon.name,
					gender: oldPokemon.gender,
					type: oldPokemon.type,
					hp: newPokemon.condition.split(' ')[0],
					status: newPokemon.condition.split(' ')[1] || null,
					formeChanged: false,
					trapped: newPokemon.active && oldPokemon.trapped,
					confused: newPokemon.active && oldPokemon.confused,
					infatuated: newPokemon.active && oldPokemon.infatuated,
					telekinesis: newPokemon.active && oldPokemon.telekinesis,
					active: newPokemon.active,
					stats: newPokemon.stats,
					statChanges: oldPokemon.statChanges,
					moves: newPokemon.active
						? action.request.active
						: oldPokemon.moves,
					ability: oldPokemon.ability,
					item: newPokemon.item,
					level: oldPokemon.level
				}
			})

			return {
				...state,
				player: {
					...state.player,
					pokemon: pokemon
				}
			}
			break
		case MOVE:
      return state.map(user => {
        if (user.id === action.sourcePlayer) {
          return {
            ...user,
            pokemon: user.pokemon.map(poke => {
              if (pokemon.name === action.sourcePokemon) {
                return {
                  ...poke,
                  moves: poke.moves.map(move => {
                    if (move.move === action.move) {
                      return {
                        ...move,
                        pp: move.pp++
                      }
                    } else {
                      return move
                    }
                  })
                }
              } else {
                return poke
              }
            })
          }
        } else {
          return user
        }
      })
			break
		case SWITCH_POKEMON:
			const newState = state.map(user => {
				if (user.id === action.player) {
					return {
						...user,
						pokemon: user.pokemon.map(poke => {
							return {
								...poke,
								active: false
							}
						})
					}
				} else {
					return user
				}
			})
			return updatePokemon(
				newState,
				action.player,
				action.pokemon,
				'active',
				true
			)
			break
		case TURN:
			return state.map(section => {
				return section.map(item => {
					if (item.turns) {
						return {
							...item,
							turns: item.turns++
						}
					} else {
						return item
					}
				})
			})
			break
		case FORME_CHANGE:
      const formeChangedState = updatePokemon(
        state,
        action.player,
        action.pokemon,
        'formeChanged',
        true
      )
			return updatePokemon(
				formeChangedState,
				action.player,
				action.pokemon,
				'hp',
				action.hp
			)
			break
		case FAINT:
			return updatePokemon(
				state,
				action.player,
				action.pokemon,
				'status',
				'fnt'
			)
			break
		case START:
			if (action.effect.includes('confusion')) {
        return updatePokemon(
          state,
          action.player,
          action.pokemon,
          'confused',
          true
        )
      } else if (action.effect.includes('infatuated')) {
        return updatePokemon(
          state,
          action.player,
          action.pokemon,
          'infatuated',
          true
        )
      } else if (action.effect.includes('telekinesis')) {
        return updatePokemon(
          state,
          action.player,
          action.pokemon,
          'telekinesis',
          true
        )
      } else if (action.effect.includes('trapped')) {
        return updatePokemon(
          state,
          action.player,
          action.pokemon,
          'trapped',
          true
        )
      }
      break
    case END:
    if (action.effect.includes('confusion')) {
      return updatePokemon(
        state,
        action.player,
        action.pokemon,
        'confused',
        false
      )
    } else if (action.effect.includes('infatuated')) {
      return updatePokemon(
        state,
        action.player,
        action.pokemon,
        'infatuated',
        false
      )
    } else if (action.effect.includes('telekinesis')) {
      return updatePokemon(
        state,
        action.player,
        action.pokemon,
        'telekinesis',
        false
      )
    } else if (action.effect.includes('trapped')) {
      return updatePokemon(
        state,
        action.player,
        action.pokemon,
        'trapped',
        false
      )
    }
    break
		case HP_CHANGE:
			return updatePokemon(
				state,
				action.player,
				action.pokemon,
				'hp',
				action.hp
			)
			break
		case INFLICT_STATUS:
			return updatePokemon(
				state,
				action.player,
				action.pokemon,
				'status',
				action.status
			)
			break
		case CURE_STATUS:
			return updatePokemon(
				state,
				action.player,
				action.pokemon,
				'status',
				'none'
			)
			break
		case CURE_TEAM:
			return state.map(user => {
				if (user.id === action.player) {
					return {
						...user,
						pokemon: user.pokemon.map(poke => {
							return {
								...poke,
								status: 'none'
							}
						})
					}
				} else {
					return user
				}
			})
			break
		case STAT_CHANGE:
			return state.map(user => {
				if (user.id === action.player) {
					return {
						...user,
						pokemon: user.pokemon.map(poke => {
							if (poke.name === action.pokemon) {
								return {
									...poke,
									statChanges: {
										...poke.statChanges,
										[action.stat]:
											poke.statChanges[action.stat] + action.amount
									}
								}
							} else {
								return poke
							}
						})
					}
				} else {
					return user
				}
			})
		case WEATHER:
			return {
				...state,
				fieldEffects: {
					...state.fieldEffects,
					weather: {
						...state.fieldEffects.weather,
						type: action.weather
					}
				}
			}
			break
		case START_FIELD_CONDITION:
			return {
				...state,
				fieldEffects: {
					...state.fieldEffects,
					[action.condition]: {
						active: true,
						turns: 1
					}
				}
			}
			break
		case END_FIELD_CONDITION:
			return {
				...state,
				fieldEffects: {
					...state.fieldEffects,
					[action.condition]: {
						active: false,
						turns: 0
					}
				}
			}
			break
		case START_SIDE_CONDITION:
			return
			state.map(user => {
				if (user.id === action.player) {
					return {
						...user,
						[action.condition]: {
							active: true,
							turns: 1
						}
					}
				} else {
					return user
				}
			})

			break
		case END_SIDE_CONDITION:
			return
			state.map(user => {
				if (user.id === action.player) {
					return {
						...user,
						[action.condition]: {
							active: false,
							turns: 0
						}
					}
				} else {
					return user
				}
			})

			break
		case ITEM_CHANGE:
			return updatePokemon(
				state,
				action.player,
				action.pokemon,
				'item',
				action.item
			)
			break
		case ITEM_END:
			return updatePokemon(
				state,
				action.player,
				action.pokemon,
				'item',
				'none'
			)
			break
		case ABILITY_CHANGE:
			return updatePokemon(
				state,
				action.player,
				action.pokemon,
				'ability',
				action.ability
			)
			break
		case ABILITY_END:
			return updatePokemon(
				state,
				action.player,
				action.pokemon,
				'ability',
				'none'
			)
			break
		case TRANSFORM:
			return updatePokemon(
        state,
        action.player,
        action.pokemon,
        'name',
        action.species
      )
      break
    case MEGA_EVOLVE:
      return updatePokemon(
        state,
        action.player,
        action.pokemon,
        'formeChanged',
        true
      )
      break
		default:
			return state
	}
}

module.exports = { pokebot }
