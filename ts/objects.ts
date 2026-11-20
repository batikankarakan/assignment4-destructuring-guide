// Batıkan Karakan, 1700002010
// The same six object forms as js/objects.mjs, now typed. Run with `npx tsx ts/objects.ts`.

type Album = { name: string; year: number }
type Song = {
  title: string
  artist: string
  duration: number // seconds
  album: Album
  tags: string[]
  liked?: boolean
}

const song: Song = {
  title: 'Sultans of Swing',
  artist: 'Dire Straits',
  duration: 348,
  album: { name: 'Dire Straits', year: 1978 },
  tags: ['rock', 'guitar'],
}

// Form 5: properties by name. The types come from Song: title is string, duration is number.
let { title, duration } = song
console.log('form 5:', title, duration)
duration = duration + 1 // let: the variable can change; the object does not.
console.log('form 5 after change:', duration, song.duration)

// Form 6: rename. The colon is a rename, NOT a type (see T1 in ts/types.ts).
const { artist: by, album: record } = song
console.log('form 6:', by, record.name)

// Form 7: default. liked is optional (boolean | undefined); with a default it becomes boolean.
const { liked = false } = song
console.log('form 7:', liked)

// Form 8: rest. TypeScript computes the rest type: Omit<Song, 'album' | 'tags'>.
const { album, tags, ...info } = song
console.log('form 8:', info, album.year, tags.length)

// Form 9: nested patterns. firstTag is string | undefined because of noUncheckedIndexedAccess.
const {
  album: { name: albumName, year },
  tags: [firstTag = 'no tag'],
} = song
console.log('form 9:', albumName, year, firstTag)

// Form 10: a computed key. The key must be a key of Song, so the value type is a union.
const fields: (keyof Song)[] = ['title', 'artist', 'duration']
for (const field of fields) {
  const { [field]: value } = song // value: string | number | boolean | Album | string[] | undefined
  console.log('form 10:', field, '->', value)
}
// With a literal key the type is exact.
const exact = 'duration' as const
const { [exact]: secondsOnly } = song // number
console.log('form 10 exact:', secondsOnly / 60)
