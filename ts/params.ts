// Batıkan Karakan, 1700002010
// Forms 11 and 12 in TypeScript, and the typing rules for patterns in parameters.
// Run with `npx tsx ts/params.ts`.

type DescribeOptions = { title?: string; artist?: string; plays?: number }

// Form 11: the type goes after the WHOLE pattern, and `= {}` after the type.
// Because of `= {}`, every field must be optional in the type, or `{}` would not fit.
function describe({ title = 'Untitled', artist = 'Unknown artist', plays = 0 }: DescribeOptions = {}): string {
  return `${title} by ${artist} (${plays} plays)`
}
console.log('form 11:', describe({ title: 'Gidin', artist: 'Peyk', plays: 12 }))
console.log('form 11 missing field:', describe({ title: 'My Old Ways' }))
console.log('form 11 no argument:', describe())

// Form 11b: an array (tuple) parameter.
type Duration = [title: string, seconds: number]
const durations: Duration[] = [
  ['Gidin', 196],
  ['Sultans of Swing', 348],
  ['The Adults Are Talking', 309],
  ['We Are the People', 267],
  ['My Old Ways', 299],
]
const longOnes = durations.filter(([, seconds]) => seconds > 300).map(([title]) => title)
console.log('form 11b:', longOnes)

// Form 12: loops. Object.entries returns [string, number][] for a Record<string, number>.
const plays: Record<string, number> = { 'Gidin': 12, 'My Old Ways': 30, 'Sultans of Swing': 7 }
for (const [song, count] of Object.entries(plays)) {
  console.log('form 12 entries:', song, count.toFixed(0))
}

// Form 12 with a Map<string, string>: song and artist are both string.
const artistOf = new Map<string, string>([
  ['Gidin', 'Peyk'],
  ['The Adults Are Talking', 'The Strokes'],
  ['We Are the People', 'Empire of the Sun'],
])
for (const [song, artist] of artistOf) {
  console.log('form 12 map:', song, '->', artist.toUpperCase())
}

// Form 12 with objects: the pattern gets its types from the array element type.
type Track = { title: string; artist: string }
const tracks: Track[] = [
  { title: 'Sultans of Swing', artist: 'Dire Straits' },
  { title: 'My Old Ways', artist: 'Tame Impala' },
]
for (const { title, artist } of tracks) {
  console.log('form 12 objects:', `${artist} - ${title}`)
}
