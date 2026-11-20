// Batıkan Karakan, 1700002010
// The same four array forms as js/arrays.mjs, now typed. Run with `npx tsx ts/arrays.ts`.

const playlist: string[] = ['Gidin', 'Sultans of Swing', 'The Adults Are Talking', 'We Are the People', 'My Old Ways']

// Form 1: the function returns a tuple, so each position has its own type.
function parseDuration(text: string): [minutes: number, seconds: number] {
  const [m = '0', s = '0'] = text.split(':')
  return [Number(m), Number(s)]
}
const [minutes, seconds] = parseDuration('5:48') // minutes: number, seconds: number
console.log('form 1:', minutes, seconds)

// Form 2: skip and rest. With noUncheckedIndexedAccess, `secondSong` is string | undefined
// (the array might be shorter), but `rest` is string[] (an empty array at worst, never undefined).
const [, secondSong, ...rest] = playlist
console.log('form 2:', secondSong ?? 'no second song', rest)

// Form 3: swap. Both variables need the same type, or the swap does not compile.
let nowPlaying: string = 'Gidin'
let upNext: string = 'My Old Ways'
;[nowPlaying, upNext] = [upNext, nowPlaying]
console.log('form 3:', nowPlaying, '|', upNext)

// Form 4: defaults. The default removes `undefined` from the type: opener is string, not string | undefined.
const short: string[] = ['Sultans of Swing']
const [opener = 'No song', closer = 'No song'] = short
console.log('form 4:', opener, '|', closer)

// Form 4 with null: the type says what can arrive. null is allowed here and the default does not replace it.
const maybeSongs: (string | null)[] = [null]
const [fromNull = 'No song'] = maybeSongs // type: string | null
console.log('form 4 null:', fromNull)
