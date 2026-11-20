// Batıkan Karakan, 1700002010
// Object destructuring (forms 5 to 10). Run with `node js/objects.mjs`.
// My data: one song from my Spotify playlist as an object.

const song = {
  title: 'Sultans of Swing',
  artist: 'Dire Straits',
  duration: 348, // seconds (5:48)
  album: { name: 'Dire Straits', year: 1978 },
  tags: ['rock', 'guitar'],
}

// Form 5: properties by name. The order in the pattern does not matter.
let { artist, title } = song
console.log('form 5:', title, '-', artist)

// Without destructuring:
// let artist = song.artist; let title = song.title

// Form 5, a name that is not in the object: undefined, no error.
const { genre } = song
console.log('form 5 missing:', genre)

// Form 6: rename while you take it. Source on the left of the colon, new name on the right.
const { title: songName, duration: seconds } = song
console.log('form 6:', songName, seconds)
// Only the NEW names exist: after `{ duration: seconds }` there is no variable `duration`.
// (In my quiz, console.log(title) after `{ title: songName }` crashed with
// "ReferenceError: title is not defined". Here `title` exists only because of form 5 above.)
console.log('form 6 old name:', typeof duration)

// Form 7: default values for fields that are missing.
const { liked = false, plays = 0, artist: by = 'Unknown artist' } = song
console.log('form 7:', liked, plays, by)

// Form 7 with undefined and null: the default only replaces undefined.
const { rating = 5 } = { rating: undefined }
const { cover = 'no-cover.png' } = { cover: null }
console.log('form 7 undefined:', rating)
console.log('form 7 null:', cover)

// Form 8: rest in an object. Everything I did not name goes into a NEW object.
const { tags, album, ...info } = song
console.log('form 8:', info)
console.log('form 8 is new:', info === song, 'song still has tags:', 'tags' in song)

// Form 9: nested patterns. `album:` and `tags:` are paths, not variables.
const {
  album: { name: albumName, year },
  tags: [firstTag],
} = song
console.log('form 9:', albumName, year, firstTag)

// Form 9, a missing nested object throws: there is nothing to walk into.
try {
  const { label: { name } } = song
  console.log(name)
} catch (error) {
  console.log('form 9 missing:', error.constructor.name + ':', error.message)
}

// Form 10: a computed key. The key is decided at run time from a variable.
for (const field of ['title', 'artist', 'duration']) {
  const { [field]: value } = song
  console.log('form 10:', field, '->', value)
}

// Form 10 with a default, for a field the song does not have.
const missingField = 'lyrics'
const { [missingField]: lyrics = 'no lyrics' } = song
console.log('form 10 missing:', lyrics)
