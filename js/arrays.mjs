// Batıkan Karakan, 1700002010
// Array destructuring (forms 1 to 4). Plain JavaScript: run with `node js/arrays.mjs`.
// My data: five songs from my own Spotify playlist.

const playlist = ['Gidin', 'Sultans of Swing', 'The Adults Are Talking', 'We Are the People', 'My Old Ways']

// Form 1: values by position. The function returns two values in an array.
function parseDuration(text) {
  const parts = text.split(':')
  return [Number(parts[0]), Number(parts[1])]
}
const [minutes, seconds] = parseDuration('5:48') // Sultans of Swing
console.log('form 1:', minutes, seconds)

// Without destructuring:
// const result = parseDuration('5:48'); const minutes = result[0]; const seconds = result[1]

// Form 1, missing position: there is no third value, so it is undefined (no error).
const [m, s, extra] = parseDuration('3:16') // Gidin
console.log('form 1 missing:', m, s, extra)

// Form 2: skip the first song with an empty slot, collect the rest into a NEW array.
const [, secondSong, ...rest] = playlist
console.log('form 2:', secondSong, rest)
console.log('form 2 rest is new:', rest === playlist, playlist.length)

// Form 2, rest on a short list: rest is an empty array, never undefined.
const [onlyOne, ...nothingLeft] = ['Gidin']
console.log('form 2 empty rest:', onlyOne, nothingLeft)

// Form 3: swap two variables without a temporary variable.
let nowPlaying = 'Gidin'
let upNext = 'My Old Ways'
;[nowPlaying, upNext] = [upNext, nowPlaying]
console.log('form 3:', nowPlaying, '|', upNext)

// Form 4: default values, used when the position is missing.
const [opener = 'No song', closer = 'No song'] = ['Sultans of Swing']
console.log('form 4:', opener, '|', closer)

// Form 4 with undefined and null: the default only replaces undefined.
const [fromUndefined = 'No song'] = [undefined]
const [fromNull = 'No song'] = [null]
console.log('form 4 undefined:', fromUndefined)
console.log('form 4 null:', fromNull)
