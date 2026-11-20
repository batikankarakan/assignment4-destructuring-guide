// Batıkan Karakan, 1700002010
// Destructuring in parameters and loops (forms 11 and 12). Run with `node js/params.mjs`.

// Form 11: an options object taken apart in the parameter list, with defaults.
// `= {}` at the end is the default for the WHOLE argument; `plays = 0` is the default for one field.
function describe({ title, artist = 'Unknown artist', plays = 0 } = {}) {
  return `${title} by ${artist} (${plays} plays)`
}
console.log('form 11:', describe({ title: 'Gidin', artist: 'Peyk', plays: 12 }))
console.log('form 11 missing field:', describe({ title: 'My Old Ways' }))
console.log('form 11 no argument:', describe())

// Without destructuring:
// function describe(options) {
//   if (options === undefined) options = {}
//   const title = options.title
//   const artist = options.artist === undefined ? 'Unknown artist' : options.artist
//   ...
// }

// Form 11 without `= {}`: calling it with no argument crashes.
function describeStrict({ title, plays = 0 }) {
  return `${title} (${plays} plays)`
}
try {
  describeStrict()
} catch (error) {
  console.log('form 11 without = {}:', error.constructor.name + ':', error.message)
}

// Form 11b: the same idea with an array parameter. The callback gets [title, seconds] pairs.
const durations = [
  ['Gidin', 196],
  ['Sultans of Swing', 348],
  ['The Adults Are Talking', 309],
  ['We Are the People', 267],
  ['My Old Ways', 299],
]
const longOnes = durations.filter(([, seconds]) => seconds > 300).map(([title]) => title)
console.log('form 11b:', longOnes)

// Form 12: patterns in loops. Object.entries gives [key, value] pairs.
const plays = { 'Gidin': 12, 'My Old Ways': 30, 'Sultans of Swing': 7 }
for (const [song, count] of Object.entries(plays)) {
  console.log('form 12 entries:', song, count)
}

// Form 12 with a Map: iterating a Map also gives [key, value] pairs.
const artistOf = new Map([
  ['Gidin', 'Peyk'],
  ['The Adults Are Talking', 'The Strokes'],
  ['We Are the People', 'Empire of the Sun'],
])
for (const [song, artist] of artistOf) {
  console.log('form 12 map:', song, '->', artist)
}

// Form 12 with an array of objects: an object pattern in the loop.
const tracks = [
  { title: 'Sultans of Swing', artist: 'Dire Straits' },
  { title: 'My Old Ways', artist: 'Tame Impala' },
]
for (const { title, artist } of tracks) {
  console.log('form 12 objects:', `${artist} - ${title}`)
}
