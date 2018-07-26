/**
 * Battle Stream Example
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Example of how to create AIs battling against each other.
 *
 * @license MIT
 * @author Guangcong Luo <guangcongluo@gmail.com>
 */

'use strict'

const BattleStreams = require('./battle-stream')
const Dex = require('./dex')
const {
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
} = require('./actions')
const { store1, store2 } = require('./store')

const team = [
	{
		name: 'Smeargle',
		species: 'Smeargle',
		gender: 'F',
		moves: ['meanlook', 'soak', 'perishsong', 'telekinesis'],
		ability: 'Technician',
		evs: { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 },
		ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
		nature: 'Jolly',
		item: 'Choice Scarf',
		level: 100,
		shiny: false
	},
	{
		name: 'Garchomp',
		species: 'Garchomp',
		gender: 'F',
		moves: ['earthquake', 'firefang', 'stoneedge', 'dragonclaw'],
		ability: 'Rough Skin',
		evs: { hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252 },
		ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
		nature: 'Jolly',
		item: 'Life Orb',
		level: 100,
		shiny: false
	}
]

const realTeam = [
	{
		name: 'Garchomp',
		species: 'Garchomp',
		gender: 'F',
		moves: ['earthquake', 'firefang', 'stoneedge', 'dragonclaw'],
		ability: 'Rough Skin',
		evs: { hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252 },
		ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
		nature: 'Jolly',
		item: 'Life Orb',
		level: 100,
		shiny: false
	},
	{
		name: 'Greninja',
		species: 'Greninja',
		gender: 'F',
		moves: ['hydropump', 'extrasensory', 'gunkshot', 'darkpulse'],
		ability: 'Protean',
		evs: { hp: 0, atk: 4, def: 0, spa: 252, spd: 0, spe: 252 },
		ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
		nature: 'Naive',
		item: 'Expert Belt',
		level: 100,
		shiny: false
	},
	{
		name: 'Heatran',
		species: 'Heatran',
		gender: 'N',
		moves: ['fireblast', 'flashcannon', 'earthpower', 'stoneedge'],
		ability: 'Flash Fire',
		evs: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
		ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
		nature: 'Timid',
		item: 'Leftovers',
		level: 100,
		shiny: false
	},
	{
		name: 'Kartana',
		species: 'Kartana',
		gender: 'N',
		moves: ['leafblade', 'knockoff', 'sacredsword', 'smartstrike'],
		ability: 'Beast Boost',
		evs: { hp: 4, atk: 252, def: 0, spa: 0, spd: 0, spe: 252 },
		ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
		nature: 'Jolly',
		item: 'Muscle Band',
		level: 100,
		shiny: false
	},
	{
		name: 'Keldeo',
		species: 'Keldeo',
		gender: 'N',
		moves: ['hydropump', 'secretsword', 'scald', 'icywind'],
		ability: 'Justified',
		evs: { hp: 0, atk: 0, def: 0, spa: 252, spd: 4, spe: 252 },
		evs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
		nature: 'Timid',
		item: 'Wise Glasses',
		level: 100,
		shiny: false
	},
	{
		name: 'Tyranitar',
		species: 'Tyranitar',
		gender: 'F',
		moves: ['stoneedge', 'crunch', 'pursuit', 'earthquake'],
		ability: 'Sand Stream',
		evs: { hp: 80, atk: 252, def: 0, spa: 0, spd: 0, spe: 176 },
		nature: 'Adamant',
		item: 'Shell Bell',
		level: 100,
		shiny: false
	}
]

/*********************************************************************
 * Helper functions
 *********************************************************************/

/**
 * @param {number[]} array
 */
function randomElem(array) {
	return array[Math.floor(Math.random() * array.length)]
}

/*********************************************************************
 * Define AI
 *********************************************************************/

class RandomPlayerAI extends BattleStreams.BattlePlayer {
	/**
	 * @param {AnyObject} request
	 */
	receiveRequest(request) {
		this.store.dispatch(updateStateFromRequest(request))
		if (request.wait) {
			// wait request
			// do nothing
		} else if (request.forceSwitch) {
			// switch request
			const pokemon = request.side.pokemon
			let chosen = /** @type {number[]} */ ([])
			const choices = request.forceSwitch.map((
				/** @type {AnyObject} */ mustSwitch
			) => {
				if (!mustSwitch) return `pass`
				let canSwitch = [1, 2]
				canSwitch = canSwitch.filter(
					i =>
						// not active
						i > request.forceSwitch.length &&
						// not chosen for a simultaneous switch
						!chosen.includes(i) &&
						// not fainted
						!pokemon[i - 1].condition.endsWith(` fnt`)
				)
				const target = randomElem(canSwitch)
				chosen.push(target)
				return `switch ${target}`
			})
			this.choose(choices.join(`, `))
		} else if (request.active) {
			// move request
			const choices = request.active.map((
				/** @type {AnyObject} */ pokemon,
				/** @type {number} */ i
			) => {
				if (request.side.pokemon[i].condition.endsWith(` fnt`))
					return `pass`
				let canMove = [1, 2, 3, 4].slice(0, pokemon.moves.length)
				canMove = canMove.filter(
					i =>
						// not disabled
						!pokemon.moves[i - 1].disabled
				)
				const move = randomElem(canMove)
				const targetable =
					request.active.length > 1 &&
					['normal', 'any'].includes(pokemon.moves[move - 1].target)
				const target = targetable
					? ` ${1 + Math.floor(Math.random() * 2)}`
					: ``
				return `move ${move}${target}`
			})
			this.choose(choices.join(`, `))
		} else {
			// team preview?
			this.choose(`default`)
		}
	}
}

function parsePokemonName(name) {
	const parts = name.split(' ')
	const pokemon = parts[1]
	const ownerInfo = parts[0]
	const player = ownerInfo.substr(0, ownerInfo.length - 2)
	return { player, pokemon }
}

function tokenizeStream(chunk) {
	const lines = chunk.split('\n')
	const tokens = lines.map(line => {
		return line.split('|')
	})
	return tokens
}

function parseTokens(tokens, store) {
	tokens.map(action => {
		switch (action[0]) {
			case 'move':
				store.dispatch(
					move({
						sourcePlayer: parsePokemonName(action[1]).player,
						sourcePokemon: parsePokemonName(action[1]).pokemon,
						move: action[2],
						targetPlayer: parsePokemonName(action[3]).player,
						targetPokemon: parsePokemonName(action[3]).pokemon
					})
				)
				break
			case 'switch':
			case 'drag':
				store.dispatch(
					switchPokemon({
						...parsePokemonName(action[1]),
						hp: action[3].split(' ')[0],
						status: action[3].split(' ')[1] || 'none'
					})
				)
				break
			case 'turn':
				store.dispatch(
					turn({
						number: parseInt(action[1])
					})
				)
				break
			case 'detailschange':
			case '-formechange':
			case 'replace':
				store.dispatch(
					formeChange({
						...parsePokemonName(action[1]),
						newForme: action[2],
						hp: action[3].split(' ')[0],
						status: action[3].split(' ')[1] || 'none'
					})
				)
				break
			case 'faint':
				store.dispatch(
					faint({
						...parsePokemonName(action[1])
					})
				)
				break
			case '-start':
				store.dispatch(
					start({
						...parsePokemonName(action[1]),
						effect: action[2]
					})
				)
				break
			case '-end':
				store.dispatch(
					end({
						...parsePokemonName(action[1]),
						effect: action[2]
					})
				)
				break
			case '-damage':
			case '-heal':
				store.dispatch(
					hpChange({
						...parsePokemonName(action[1]),
						hp: action[2].split(' ')[0],
						status: action[2].split(' ')[1] || 'none'
					})
				)
				break
			case '-status':
				store.dispatch(
					inflictStatus({
						...parsePokemonName(action[1]),
						status: action[2]
					})
				)
				break
			case '-curestatus':
				store.dispatch(
					cureStatus({
						...parsePokemonName(action[1]),
						status: action[2]
					})
				)
				break
			case '-cureteam':
				store.dispatch(
					cureTeam({
						...parsePokemonName(action[1]).player
					})
				)
				break
			case '-boost':
			case '-unboost':
				store.dispatch(
					statChange({
						...parsePokemonName(action[1]),
						stat: action[2],
						amount: action[3]
					})
				)
				break
			case '-weather':
				store.dispatch(
					weather({
						weather: action[1]
					})
				)
				break
			case '-fieldstart':
			case '-fieldactivate':
				store.dispatch(
					startFieldCondition({
						condition: action[1]
							.replace('move: ', '')
							.replace(' ', '')
							.toLowerCase()
					})
				)
				break
			case '-fieldend':
				store.dispatch(
					endFieldCondition({
						condition: action[1]
							.replace('move: ', '')
							.replace(' ', '')
							.toLowerCase()
					})
				)
				break
			case '-sidestart':
				store.dispatch(
					startSideCondition({
						player: action[1].split(':')[0],
						condition: action[2]
							.replace('move: ', '')
							.replace(' ', '')
							.toLowerCase()
					})
				)
				break
			case '-sideend':
				store.dispatch(
					endSideCondition({
						player: action[1].split(':')[0],
						condition: action[2]
							.replace('move: ', '')
							.replace(' ', '')
							.toLowerCase()
					})
				)
				break
			case '-item':
				store.dispatch(
					itemChange({
						...parsePokemonName(action[1]),
						item: action[2]
					})
				)
				break
			case '-enditem':
				store.dispatch(
					itemEnd({
						...parsePokemonName(action[1])
					})
				)
				break
			case '-ability':
				store.dispatch(
					abilityChange({
						...parsePokemonName(action[1]),
						ability: action[2]
					})
				)
				break
			case '-endability':
				if (!action[3] || !action[3].includes('Transform')) {
					store.dispatch(
						abilityEnd({
							...parsePokemonName(action[1])
						})
					)
				}
				break
			case '-transform':
				store.dispatch(
					transform({
						...parsePokemonName(action[1]),
						species: action[2].split(" ")[1]
					})
				)
				break
			case '-mega':
				store.dispatch(
					megaEvolve({
						...parsePokemonName(action[1])
					})
				)
				break
			default:
				return null
		}
	})
	return tokens
}

/*********************************************************************
 * Run AI
 *********************************************************************/

const streams = BattleStreams.getPlayerStreams(new BattleStreams.BattleStream())

const spec = {
	formatid: 'gen7ou'
}
store1.dispatch(setInitialState(team, 'p1', 'p2'))
store2.dispatch(setInitialState(team, 'p2', 'p1'))

const p1spec = {
	name: 'Bot 1',
	team: Dex.packTeam(team)
}
const p2spec = {
	name: 'Bot 2',
	team: Dex.packTeam(team)
}

// eslint-disable-next-line no-unused-vars
const p1 = new RandomPlayerAI(streams.p1, store1)
// eslint-disable-next-line no-unused-vars
const p2 = new RandomPlayerAI(streams.p2, store2)
;(async () => {
	let chunk
	while ((chunk = await streams.p1.read())) {
		console.log(chunk)
		const tokens = tokenizeStream(chunk)
		const actions = parseTokens(tokens, store1)
		//Call update state action here
	}
	while ((chunk = await streams.p2.read())) {
		console.log(chunk)
		const tokens = tokenizeStream(chunk)
		const action = parseTokens(tokens, store2)
		//Call update state action here
	}
})()

streams.omniscient.write(`>start ${JSON.stringify(spec)}
>player p1 ${JSON.stringify(p1spec)}
>player p2 ${JSON.stringify(p2spec)}`)
