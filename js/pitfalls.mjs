// Batıkan Karakan, 1700002010
// Things that surprise people. Run with `node js/pitfalls.mjs`.

// Pitfall 1: destructuring undefined or null throws a TypeError.
// A song that was not found (find returns undefined) cannot be taken apart.
const library = [{ title: 'Gidin', artist: 'Peyk' }]
const found = library.find((s) => s.title === 'Yellow')
try {
  const { title } = found
  console.log(title)
} catch (error) {
  console.log('pitfall 1 undefined:', error.constructor.name + ':', error.message)
}
try {
  const { title } = null
  console.log(title)
} catch (error) {
  console.log('pitfall 1 null:', error.constructor.name + ':', error.message)
}
// Fix: give a fallback object.
const { title: safeTitle = 'not found' } = found ?? {}
console.log('pitfall 1 fix:', safeTitle)

// Pitfall 2: a default only applies to undefined, not to null.
// An API might send null for "no cover image"; the default does not help then.
const fromApi = { title: 'My Old Ways', cover: null, explicit: undefined }
const { cover = 'default-cover.png', explicit = false } = fromApi
console.log('pitfall 2:', cover, explicit)
// Fix if null should also mean "use the default": ?? after the pattern.
const coverFixed = fromApi.cover ?? 'default-cover.png'
console.log('pitfall 2 fix:', coverFixed)

// Pitfall 3: assigning to existing variables needs parentheses.
// Without them, `{ title, artist } = song` is read as a block and the file does not even run:
//   SyntaxError: Unexpected token '='
let songTitle, songArtist
const nowPlaying = { songTitle: 'Gidin', songArtist: 'Peyk' }
;({ songTitle, songArtist } = nowPlaying)
console.log('pitfall 3:', songTitle, songArtist)

// Pitfall 4: destructuring copies references, not objects (nested objects are shared).
const song = { title: 'Sultans of Swing', album: { name: 'Dire Straits', year: 1978 } }
const { album } = song // the same as: const album = song.album
album.year = 2025
console.log('pitfall 4:', song.album.year, album === song.album)
// Rest makes a new outer object, but the nested object inside is still shared.
const { title: _t, ...copy } = song
copy.album.name = 'changed through the copy'
console.log('pitfall 4 rest:', song.album.name)

// Pitfall 5: in objects the order does not matter, in arrays it does.
const track = { title: 'We Are the People', artist: 'Empire of the Sun' }
const { artist: a1, title: t1 } = track
console.log('pitfall 5 object:', t1, '-', a1)
const pair = ['We Are the People', 'Empire of the Sun']
const [artistWrong, titleWrong] = pair // I wanted [title, artist] but wrote them the other way
console.log('pitfall 5 array:', 'artist =', artistWrong, '| title =', titleWrong)
