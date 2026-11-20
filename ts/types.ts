// Batıkan Karakan, 1700002010
// What only TypeScript adds (topics T1 to T5). Run with `npx tsx ts/types.ts`.

type Song = { title: string; artist: string; plays?: number }
const gidin: Song = { title: 'Gidin', artist: 'Peyk', plays: 12 }

// T1: `{ title: string }` inside a pattern is a RENAME, not a type.
// This looks like "title is a string" but it means "take title and call it `string`":
//   function show({ title: string }) { ... }
//   error TS7031: Binding element 'string' implicitly has an 'any' type.
// The type goes AFTER the whole pattern:
function show({ title, artist }: { title: string; artist: string }): string {
  return `${artist} - ${title}`
}
// Rename AND type together: the rename is in the pattern, the type after it.
function showRenamed({ title: name }: { title: string }): string {
  return name.toUpperCase()
}
console.log('T1:', show(gidin), '|', showRenamed(gidin))

// T2: a tuple return type, and what `as const` does.
function topSong(): [title: string, plays: number] {
  return ['My Old Ways', 30]
}
const [topTitle, topPlays] = topSong() // string, number
console.log('T2 tuple:', topTitle, topPlays + 1)

// Without a tuple type, an array literal is widened to (string | number)[]:
const loose = ['Gidin', 196] // (string | number)[]
const [looseTitle] = loose // string | number | undefined
console.log('T2 loose:', typeof looseTitle)
// With `as const` it becomes a readonly tuple of literal types:
const fixed = ['Gidin', 196] as const // readonly ['Gidin', 196]
const [fixedTitle, fixedSeconds] = fixed // 'Gidin', 196
console.log('T2 as const:', fixedTitle.length, fixedSeconds / 60)

// T3: noUncheckedIndexedAccess. An array may be empty, so the first item is string | undefined.
const queue: string[] = ['Gidin', 'We Are the People']
const [first] = queue // string | undefined
// first.toUpperCase() → error TS18048: 'first' is possibly 'undefined'.
if (first !== undefined) {
  console.log('T3 checked:', first.toUpperCase())
}
const [firstOrDefault = 'nothing queued'] = [] as string[] // a default removes undefined: string
console.log('T3 default:', firstOrDefault)
const emptyQueue: string[] = []
const [none] = emptyQueue
console.log('T3 empty:', none ?? 'queue is empty')

// T4: optional fields and defaults change the type of the variable.
const { plays } = gidin // number | undefined, because plays?: number
const { plays: playsWithDefault = 0 } = gidin // number, the default removes undefined
console.log('T4:', plays, playsWithDefault)
const noPlays: Song = { title: 'Sultans of Swing', artist: 'Dire Straits' }
const { plays: p1 } = noPlays
const { plays: p2 = 0 } = noPlays
console.log('T4 missing:', p1, p2)

// T5: one compile error caused by destructuring: a property the type does not have.
// error TS2339: Property 'genre' does not exist on type 'Song'.
// @ts-expect-error genre is not part of Song; this line is here on purpose to show the error.
const { genre } = gidin
console.log('T5 at run time:', genre)
// Fix: add the field to the type (as optional), then a default can be used.
type SongWithGenre = Song & { genre?: string }
const tagged: SongWithGenre = { ...gidin, genre: 'Anatolian rock' }
const { genre: fixedGenre = 'unknown' } = tagged
console.log('T5 fix:', fixedGenre)
