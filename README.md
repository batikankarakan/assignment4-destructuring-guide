# Destructuring Field Guide

Name: Batıkan Karakan  
Student number: 1700002010

Bonuses claimed: **Bonus 4: Git repository** (see the end of this file).

> **How this guide was made.** All examples use my own data (songs from my Spotify playlist).
> Before running each example I guessed the output; the wrong guesses and the real errors are in
> [My own log](#my-own-log). I used an AI assistant (Claude) to help write the code and the text of
> this README. Every output below is copied from a real run on my machine (`output.txt`).

## Run

```
npm install
npm run all      # runs the JS and TS examples
npm run check    # type-checks in strict mode
npm run all > output.txt
```

## Contents

- [The idea in one line](#the-idea-in-one-line)
- [Field guide: forms 1 to 12](#field-guide)
- [Pitfalls](#pitfalls)
- [TypeScript topics T1 to T5](#typescript-topics-t1-to-t5)
- [Props and children (P1 to P7)](#props-and-children)
- [JavaScript vs TypeScript](#javascript-vs-typescript)
- [My own log](#my-own-log)
- [Bonus 4: Git repository](#bonus-4-git-repository)

## The idea in one line

Destructuring is a short way to write several plain assignments. The left side is a **pattern**
that describes the shape of the value:

```js
const { title, artist } = song      // is the same as:
const title = song.title
const artist = song.artist

const [first, second] = playlist    // is the same as:
const first = playlist[0]
const second = playlist[1]
```

Arrays are taken apart **by position**, objects **by name**.

**Rest vs spread.** The same three dots do opposite jobs:

- In a **pattern** (left side), `...rest` *collects* what is left into a new array or object:
  `const [first, ...rest] = playlist`.
- In an **expression** (right side), `...list` *expands* an array or object into separate items:
  `const copy = [...playlist]`, `<section {...rest}>`.

---

## Field guide

My data, used in every example:

| Song | Artist | Length |
| --- | --- | --- |
| Gidin | Peyk | 3:16 |
| Sultans of Swing | Dire Straits | 5:48 |
| The Adults Are Talking | The Strokes | 5:09 |
| We Are the People | Empire of the Sun | 4:27 |
| My Old Ways | Tame Impala | 4:59 |

### Form 1: values by position, `const [x, y] = f()`

**Syntax:** `const [minutes, seconds] = parseDuration('5:48')`

**Example** (from `js/arrays.mjs`):

```js
function parseDuration(text) {
  const parts = text.split(':')
  return [Number(parts[0]), Number(parts[1])]
}
const [minutes, seconds] = parseDuration('5:48') // Sultans of Swing
console.log('form 1:', minutes, seconds)

const [m, s, extra] = parseDuration('3:16') // Gidin
console.log('form 1 missing:', m, s, extra)
```

**Output:**

```
form 1: 5 48
form 1 missing: 3 16 undefined
```

**Without destructuring:** `const result = parseDuration('5:48'); const minutes = result[0]; const seconds = result[1]`

**Use it when:** a function returns a few values that belong together and their order is clear,
like `useState` and `useReducer` in React.

**Watch out:** the names are chosen by **position**, not by meaning. Asking for a position that
does not exist (`extra`) gives `undefined`, not an error.

### Form 2: skip and collect the rest, `const [, second, ...others] = list`

**Syntax:** `const [, secondSong, ...rest] = playlist`

**Example** (from `js/arrays.mjs`):

```js
const [, secondSong, ...rest] = playlist
console.log('form 2:', secondSong, rest)
console.log('form 2 rest is new:', rest === playlist, playlist.length)

const [onlyOne, ...nothingLeft] = ['Gidin']
console.log('form 2 empty rest:', onlyOne, nothingLeft)
```

**Output:**

```
form 2: Sultans of Swing [ 'The Adults Are Talking', 'We Are the People', 'My Old Ways' ]
form 2 rest is new: false 5
form 2 empty rest: Gidin []
```

**Without destructuring:** `const secondSong = playlist[1]; const rest = playlist.slice(2)`

**Use it when:** you need the first items separately and the rest as a list (a "head and tail").

**Watch out:** every comma is one position, so `[, second]` skips the first item. The rest only
gets what is **left**, it is a **new** array (the original keeps 5 songs), and it is `[]` when
nothing is left, never `undefined`. The rest must be the last element of the pattern.

### Form 3: swap two variables, `[a, b] = [b, a]`

**Syntax:** `;[nowPlaying, upNext] = [upNext, nowPlaying]`

**Example** (from `js/arrays.mjs`):

```js
let nowPlaying = 'Gidin'
let upNext = 'My Old Ways'
;[nowPlaying, upNext] = [upNext, nowPlaying]
console.log('form 3:', nowPlaying, '|', upNext)
```

**Output:** `form 3: My Old Ways | Gidin`

**Without destructuring:** `const temp = nowPlaying; nowPlaying = upNext; upNext = temp`

**Use it when:** two variables must change places.

**Watch out:** the right side is built **first** from the old values (`['My Old Ways', 'Gidin']`),
then taken apart into the variables. That is why no temporary variable is needed. The line starts
with `[`, so put a `;` before it, or it can join the line above.

### Form 4: default values in arrays, `const [a = 1, b = 2] = []`

**Syntax:** `const [opener = 'No song', closer = 'No song'] = ['Sultans of Swing']`

**Example** (from `js/arrays.mjs`):

```js
const [opener = 'No song', closer = 'No song'] = ['Sultans of Swing']
console.log('form 4:', opener, '|', closer)

const [fromUndefined = 'No song'] = [undefined]
const [fromNull = 'No song'] = [null]
console.log('form 4 undefined:', fromUndefined)
console.log('form 4 null:', fromNull)
```

**Output:**

```
form 4: Sultans of Swing | No song
form 4 undefined: No song
form 4 null: null
```

**Without destructuring:** `const closer = arr[1] === undefined ? 'No song' : arr[1]`

**Use it when:** a position may be missing and there is a sensible fallback.

**Watch out:** the default is used **only for `undefined`**. `null` is a real value and is kept.

### Form 5: properties by name, `let { a, b } = t`

**Syntax:** `let { artist, title } = song`

**Example** (from `js/objects.mjs`):

```js
const song = {
  title: 'Sultans of Swing',
  artist: 'Dire Straits',
  duration: 348, // seconds (5:48)
  album: { name: 'Dire Straits', year: 1978 },
  tags: ['rock', 'guitar'],
}
let { artist, title } = song
console.log('form 5:', title, '-', artist)

const { genre } = song
console.log('form 5 missing:', genre)
```

**Output:**

```
form 5: Sultans of Swing - Dire Straits
form 5 missing: undefined
```

**Without destructuring:** `let artist = song.artist; let title = song.title`

**Use it when:** you need several fields of an object and want short names.

**Watch out:** the variable name must be the **same** as the property name. The order does not
matter (I wrote `artist` first). A name that is not in the object gives `undefined`. With `let`,
changing the variable does **not** change the object.

### Form 6: rename while you take it, `const { a: alpha } = t`

**Syntax:** `const { title: songName, duration: seconds } = song`

**Example** (from `js/objects.mjs`):

```js
const { title: songName, duration: seconds } = song
console.log('form 6:', songName, seconds)
console.log('form 6 old name:', typeof duration)
```

**Output:**

```
form 6: Sultans of Swing 348
form 6 old name: undefined
```

**Without destructuring:** `const songName = song.title; const seconds = song.duration`

**Use it when:** the property name clashes with a variable you already have, or it is not clear in
this place (`duration` → `seconds` says the unit).

**Watch out:** the **old name is not a variable**. In my test, `console.log(title)` after
`const { title: songName } = song` crashed with `ReferenceError: title is not defined`. Read the
colon as "goes into": source on the left, new name on the right. In TypeScript this colon is
**not** a type (see T1).

### Form 7: default values in objects, `const { a = 1 } = t`

**Syntax:** `const { liked = false, plays = 0, artist: by = 'Unknown artist' } = song`

**Example** (from `js/objects.mjs`):

```js
const { liked = false, plays = 0, artist: by = 'Unknown artist' } = song
console.log('form 7:', liked, plays, by)

const { rating = 5 } = { rating: undefined }
const { cover = 'no-cover.png' } = { cover: null }
console.log('form 7 undefined:', rating)
console.log('form 7 null:', cover)
```

**Output:**

```
form 7: false 0 Dire Straits
form 7 undefined: 5
form 7 null: null
```

**Without destructuring:** `const plays = song.plays === undefined ? 0 : song.plays`

**Use it when:** an object may not have a field (options, data from an API).

**Watch out:** like form 4, `undefined` triggers the default and `null` does not. A rename and a
default can be combined: `artist: by = 'Unknown artist'`.

### Form 8: rest in an object, `const { a, ...others } = t`

**Syntax:** `const { tags, album, ...info } = song`

**Example** (from `js/objects.mjs`):

```js
const { tags, album, ...info } = song
console.log('form 8:', info)
console.log('form 8 is new:', info === song, 'song still has tags:', 'tags' in song)
```

**Output:**

```
form 8: { title: 'Sultans of Swing', artist: 'Dire Straits', duration: 348 }
form 8 is new: false song still has tags: true
```

**Without destructuring:** `const info = { ...song }; delete info.tags; delete info.album`

**Use it when:** you want "everything except these fields", for example to pass the other props
of a React component on to a DOM element (see P4).

**Watch out:** `info` is a **new** object and `song` does not change. But it is a shallow copy:
nested objects inside are still shared (see pitfall 4).

### Form 9: nested patterns, `const { p: { x }, list: [first] } = t`

**Syntax:** `const { album: { name: albumName, year }, tags: [firstTag] } = song`

**Example** (from `js/objects.mjs`):

```js
const {
  album: { name: albumName, year },
  tags: [firstTag],
} = song
console.log('form 9:', albumName, year, firstTag)

try {
  const { label: { name } } = song
  console.log(name)
} catch (error) {
  console.log('form 9 missing:', error.constructor.name + ':', error.message)
}
```

**Output:**

```
form 9: Dire Straits 1978 rock
form 9 missing: TypeError: Cannot read properties of undefined (reading 'name')
```

**Without destructuring:** `const albumName = song.album.name; const year = song.album.year; const firstTag = song.tags[0]`

**Use it when:** you need a few values from deep inside an object, and you know the inner object
exists.

**Watch out:** `album:` and `tags:` are only **paths**, not variables. In my test,
`console.log(album)` after `const { album: { year } } = song` crashed with
`ReferenceError: album is not defined`. If the inner object is missing (`label`), the whole line
throws a `TypeError`. A default for the inner object prevents that: `{ label: { name } = {} }`.

### Form 10: a computed key, `const { [key]: value } = t`

**Syntax:** `const { [field]: value } = song`

**Example** (from `js/objects.mjs`):

```js
for (const field of ['title', 'artist', 'duration']) {
  const { [field]: value } = song
  console.log('form 10:', field, '->', value)
}
const missingField = 'lyrics'
const { [missingField]: lyrics = 'no lyrics' } = song
console.log('form 10 missing:', lyrics)
```

**Output:**

```
form 10: title -> Sultans of Swing
form 10: artist -> Dire Straits
form 10: duration -> 348
form 10 missing: no lyrics
```

**Without destructuring:** `const value = song[field]`

**Use it when:** the name of the field is only known at run time (from a variable, a loop, user
input).

**Watch out:** a computed key **must** have a new name after the colon (`[field]: value`), because
JavaScript cannot invent a variable name from a value. It can have a default like any other field.

### Form 11: patterns in parameters, `function f({ a = 1, b } = {})`

**Syntax:** `function describe({ title, artist = 'Unknown artist', plays = 0 } = {})`

**Example** (from `js/params.mjs`):

```js
function describe({ title, artist = 'Unknown artist', plays = 0 } = {}) {
  return `${title} by ${artist} (${plays} plays)`
}
console.log('form 11:', describe({ title: 'Gidin', artist: 'Peyk', plays: 12 }))
console.log('form 11 missing field:', describe({ title: 'My Old Ways' }))
console.log('form 11 no argument:', describe())

function describeStrict({ title, plays = 0 }) { return `${title} (${plays} plays)` }
describeStrict() // inside try/catch in the file

const longOnes = durations.filter(([, seconds]) => seconds > 300).map(([title]) => title)
console.log('form 11b:', longOnes)
```

**Output:**

```
form 11: Gidin by Peyk (12 plays)
form 11 missing field: My Old Ways by Unknown artist (0 plays)
form 11 no argument: undefined by Unknown artist (0 plays)
form 11 without = {}: TypeError: Cannot destructure property 'title' of 'undefined' as it is undefined.
form 11b: [ 'Sultans of Swing', 'The Adults Are Talking' ]
```

**Without destructuring:**

```js
function describe(options) {
  if (options === undefined) options = {}
  const title = options.title
  const plays = options.plays === undefined ? 0 : options.plays
  // ...
}
```

**Use it when:** a function takes an "options object", so callers can give the fields by name and
in any order, and leave some out. Every React component does this with its props.

**Watch out:** there are **two** defaults. `plays = 0` is for a missing field; `= {}` at the end is
for a missing **argument**. Without `= {}`, calling `describe()` crashes, because there is no
object to take `title` from. Array patterns work in parameters too (`([, seconds]) => ...`).

### Form 12: patterns in loops, `for (const [k, v] of Object.entries(o))`

**Syntax:** `for (const [song, count] of Object.entries(plays))`

**Example** (from `js/params.mjs`):

```js
const plays = { 'Gidin': 12, 'My Old Ways': 30, 'Sultans of Swing': 7 }
for (const [song, count] of Object.entries(plays)) {
  console.log('form 12 entries:', song, count)
}
const artistOf = new Map([
  ['Gidin', 'Peyk'],
  ['The Adults Are Talking', 'The Strokes'],
  ['We Are the People', 'Empire of the Sun'],
])
for (const [song, artist] of artistOf) {
  console.log('form 12 map:', song, '->', artist)
}
for (const { title, artist } of tracks) {
  console.log('form 12 objects:', `${artist} - ${title}`)
}
```

**Output:**

```
form 12 entries: Gidin 12
form 12 entries: My Old Ways 30
form 12 entries: Sultans of Swing 7
form 12 map: Gidin -> Peyk
form 12 map: The Adults Are Talking -> The Strokes
form 12 map: We Are the People -> Empire of the Sun
form 12 objects: Dire Straits - Sultans of Swing
form 12 objects: Tame Impala - My Old Ways
```

**Without destructuring:** `for (const entry of Object.entries(plays)) { const song = entry[0]; const count = entry[1] }`

**Use it when:** you loop over key/value pairs (`Object.entries`, a `Map`) or over a list of objects.

**Watch out:** `Object.entries` turns an object into an array of `[key, value]` pairs; a `Map` gives
the same pairs directly. Use `of`, not `in`: `for...in` gives only the keys as strings.

---

## Pitfalls

All from `js/pitfalls.mjs`.

### Pitfall 1: destructuring `undefined` or `null` throws

```js
const found = library.find((s) => s.title === 'Yellow') // not in my library → undefined
const { title } = found
const { title } = null
const { title: safeTitle = 'not found' } = found ?? {}   // fix
```

```
pitfall 1 undefined: TypeError: Cannot destructure property 'title' of 'found' as it is undefined.
pitfall 1 null: TypeError: Cannot destructure property 'title' of 'null' as it is null.
pitfall 1 fix: not found
```

**Why:** a pattern reads properties from the value, and `undefined` and `null` have no properties
at all. Give a fallback object with `?? {}`, or `= {}` in a parameter.

### Pitfall 2: a default only applies to `undefined`, not to `null`

```js
const fromApi = { title: 'My Old Ways', cover: null, explicit: undefined }
const { cover = 'default-cover.png', explicit = false } = fromApi
const coverFixed = fromApi.cover ?? 'default-cover.png'  // fix
```

```
pitfall 2: null false
pitfall 2 fix: default-cover.png
```

**Why:** JavaScript checks `value === undefined` to decide whether to use a default. `null` means
"there is a value, and it is empty", so it is kept. If `null` should also mean "use the default",
use `??`, which handles both.

### Pitfall 3: assigning to existing variables needs parentheses

```js
let songTitle, songArtist
{ songTitle, songArtist } = nowPlaying       // SyntaxError: Unexpected token '='
;({ songTitle, songArtist } = nowPlaying)    // fix
```

```
pitfall 3: Gidin Peyk
```

**Why:** a line that starts with `{` is read as a **block** of code, not an object pattern, so the
`=` after it makes no sense. The parentheses make it an expression. (`const`/`let` lines do not
have this problem.)

### Pitfall 4: it copies references, not objects

```js
const { album } = song            // the same as: const album = song.album
album.year = 2025
console.log('pitfall 4:', song.album.year, album === song.album)

const { title: _t, ...copy } = song
copy.album.name = 'changed through the copy'
console.log('pitfall 4 rest:', song.album.name)
```

```
pitfall 4: 2025 true
pitfall 4 rest: changed through the copy
```

**Why:** a variable holds a reference (an address) to an object. Destructuring copies the address,
so `album` and `song.album` are the **same** object. Even rest only makes a new **outer** object;
the objects inside are still shared.

### Pitfall 5: order does not matter in objects, it does in arrays

```js
const { artist: a1, title: t1 } = track
const [artistWrong, titleWrong] = ['We Are the People', 'Empire of the Sun']
```

```
pitfall 5 object: We Are the People - Empire of the Sun
pitfall 5 array: artist = We Are the People | title = Empire of the Sun
```

**Why:** object patterns match **by name**, so the order of names is free. Array patterns match
**by position**, so if I write the names in the wrong order, the values silently go into the wrong
variables, with no error.

---

## TypeScript topics T1 to T5

From `ts/types.ts`. Output:

```
T1: Peyk - Gidin | GIDIN
T2 tuple: My Old Ways 31
T2 loose: string
T2 as const: 5 3.2666666666666666
T3 checked: GIDIN
T3 default: nothing queued
T3 empty: queue is empty
T4: 12 12
T4 missing: undefined 0
T5 at run time: undefined
T5 fix: Anatolian rock
```

### T1: `{ a: string }` in a pattern is a rename, not a type

```ts
function show({ title: string }) { ... }
// error TS7031: Binding element 'string' implicitly has an 'any' type.

function show({ title, artist }: { title: string; artist: string }) { ... }   // correct
function showRenamed({ title: name }: { title: string }) { ... }               // rename + type
```

Inside a pattern the colon means "rename" (form 6), so `{ title: string }` makes a variable called
`string`. The type of the whole object goes **after** the pattern.

### T2: tuple return types and `as const`

```ts
function topSong(): [title: string, plays: number] { return ['My Old Ways', 30] }
const [topTitle, topPlays] = topSong()          // string, number

const loose = ['Gidin', 196]                    // (string | number)[]
const [looseTitle] = loose                      // string | number | undefined
const fixed = ['Gidin', 196] as const           // readonly ['Gidin', 196]
const [fixedTitle, fixedSeconds] = fixed        // 'Gidin', 196
```

Without a tuple type, TypeScript treats `['Gidin', 196]` as an array of "string or number" of any
length, so every destructured item is `string | number` (and `| undefined` because of T3). A tuple
type or `as const` keeps a fixed length and one type per position. `as const` also makes it
`readonly` and narrows the values to literal types.

### T3: `noUncheckedIndexedAccess`

```ts
const queue: string[] = ['Gidin', 'We Are the People']
const [first] = queue          // string | undefined
first.toUpperCase()            // error TS18048: 'first' is possibly 'undefined'.
if (first !== undefined) first.toUpperCase()          // fix 1: check
const [firstOrDefault = 'nothing queued'] = [] as string[]   // fix 2: default → string
none ?? 'queue is empty'                               // fix 3: ??
```

With this option on, TypeScript admits that an array of type `string[]` might be shorter than you
think, so every item taken by position may be `undefined`. A rest element is still `string[]`,
because an empty array is still an array.

### T4: optional fields and defaults

```ts
type Song = { title: string; artist: string; plays?: number }
const { plays } = gidin                           // number | undefined
const { plays: playsWithDefault = 0 } = gidin     // number
```

An optional field (`plays?`) gives `number | undefined`. A default **removes** `undefined` from the
type, because TypeScript knows the default is used exactly when the value is `undefined`.

### T5: a compile error caused by destructuring

```ts
// @ts-expect-error genre is not part of Song; this line is here on purpose to show the error.
const { genre } = gidin
// error TS2339: Property 'genre' does not exist on type 'Song'.

type SongWithGenre = Song & { genre?: string }      // fix: add the field to the type
const { genre: fixedGenre = 'unknown' } = tagged
```

In JavaScript, a missing property silently gives `undefined` (form 5). TypeScript refuses it,
because it usually means a typo or a wrong type. The fix is to put the field in the type (optional
if it may be missing). `@ts-expect-error` is used only here, on purpose.

---

## Props and children

A React component receives **one object**, its props. The attributes written in JSX become its
fields, and what is written **between** the tags becomes one more field, called `children`.
Destructuring is how a component takes that object apart.

All examples are in `js/props.jsx` and `ts/props.tsx`, rendered with `renderToStaticMarkup`.

### P1: props is one object

```jsx
function SongCardA(props) {
  console.log('P1 props object:', props)
  return <div><h2>{props.title}</h2>{props.children}</div>
}
function SongCardB({ title, children }) {
  return <div><h2>{title}</h2>{children}</div>
}
```

```
P1 props object: { title: 'Gidin', children: 'Peyk' }
P1 A: <div><h2>Gidin</h2>Peyk</div>
P1 B: <div><h2>Gidin</h2>Peyk</div>
```

The two components do the same thing. `<SongCardA title="Gidin">Peyk</SongCardA>` calls the
function with **one** object, `{ title: 'Gidin', children: 'Peyk' }`. `SongCardB` is simply
**form 11** (a pattern in a parameter) with **form 5** inside it (properties by name):
`{ title, children }` is short for `const title = props.title; const children = props.children`.

### P2: children is only a prop

```jsx
<SongCardB title="Gidin">Peyk</SongCardB>
<SongCardB title="Gidin" children="Peyk" />
<SongCardB title="Gidin" children="from prop">from tags</SongCardB>
```

```
P2 tags:      <div><h2>Gidin</h2>Peyk</div>
P2 attribute: <div><h2>Gidin</h2>Peyk</div>
P2 both:      <div><h2>Gidin</h2>from tags</div>
```

Writing content between the tags is just a nicer way to set the `children` prop: both give the
same props object. When both are given, the content **between the tags wins** and the attribute is
lost without any warning, because an object cannot have two fields with the same name: React sets
`children` from the tags after the attributes, so it overwrites it.

### P3: what children can be

```jsx
<SongCardB title="X">{value}</SongCardB>   // for each value below
```

```
P3 string     : <div><h2>X</h2>Sultans of Swing</div>
P3 number     : <div><h2>X</h2>348</div>
P3 zero       : <div><h2>X</h2>0</div>
P3 true       : <div><h2>X</h2></div>
P3 false      : <div><h2>X</h2></div>
P3 null       : <div><h2>X</h2></div>
P3 undefined  : <div><h2>X</h2></div>
P3 one element: <div><h2>X</h2><b>Tame Impala</b></div>
P3 array      : <div><h2>X</h2>Gidin / My Old Ways</div>
P3 several elements: <p>array of 3</p>
P3 one element:      <p>object</p>
P3 no children:      <p>undefined</p>
P3 zero trap: <div><h2>Gidin</h2>0</div>
P3 zero fix:  <div><h2>Gidin</h2></div>
P3 function: <div><h2>X</h2></div>
P3 render prop: <div><b>The Adults Are Talking</b></div>
```

And on stderr for the function:

```
Functions are not valid as a React child. This may happen if you return children instead of <children /> from render. Or maybe you meant to call this function rather than return it.
```

| children is | What appears |
| --- | --- |
| a string, a number (also `0`) | the text |
| `true`, `false`, `null`, `undefined` | nothing |
| one element | the element; `props.children` is that one object |
| several elements | all of them; `props.children` is an **array** |
| an array | every item, one after another |
| a function | nothing, and a warning; React does not call it |

What I learned from this:

- **Booleans are skipped on purpose**, so `{isPlaying && <span>Now playing</span>}` shows nothing
  when `isPlaying` is false.
- **`0` is not skipped**, so `{likes && <span>{likes} likes</span>}` shows a lonely `0` when
  `likes` is 0. Fix: `{likes > 0 && ...}`.
- The type of `props.children` **changes** with the number of children: `undefined`, one object,
  or an array. So a component should not assume it is always an array.
- A function only works if the component **calls** it itself: `children('The Adults Are Talking')`.
  This is called a *render prop*.

### P4: separating children from the other props

```jsx
function Track({ title, children, ...rest }) {
  console.log('P4 rest:', rest)
  return <section {...rest}><h3>{title}</h3>{children}</section>
}
<Track title="Gidin" id="song-1" className="track" data-plays="12">Peyk</Track>
```

```
P4 rest: { id: 'song-1', className: 'track', 'data-plays': '12' }
P4: <section id="song-1" class="track" data-plays="12"><h3>Gidin</h3>Peyk</section>
```

`{ title, children, ...rest }` is **form 8** in a parameter: `title` and `children` are taken out
by name, and **everything else** goes into `rest`. Then `{...rest}` is a **spread** that puts those
fields on the `<section>` as attributes. This way the component handles its own props and passes
the rest (id, className, data-*, aria-*) to the DOM without listing them one by one. `title` is
not in `rest`, so it does not end up as an attribute on the section.

**Order decides who wins:**

```jsx
function TrackDefaultClass({ title, ...rest }) {
  return <section className="card" {...rest}>{title}</section>
}
function TrackLockedClass({ title, ...rest }) {
  return <section {...rest} className="card">{title}</section>
}
<TrackDefaultClass title="Gidin" className="highlight" />
<TrackLockedClass title="Gidin" className="highlight" />
```

```
P4 explicit then spread: <section class="highlight">Gidin</section>
P4 spread then explicit: <section class="card">Gidin</section>
```

JSX attributes are applied from left to right, like fields in an object literal, and **the last one
wins**. So: explicit **before** the spread = a default the caller can override; explicit **after**
the spread = a fixed value the caller cannot change.

**`key` is not a prop:**

```jsx
function ShowKey(props) {
  const { key, title } = props
  return <p>{`key: ${key}, title: ${title}, 'key' in props: ${'key' in props}, keys: ${Object.keys(props)}`}</p>
}
<ShowKey key="k1" title="Gidin" />
```

```
ShowKey: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)
P4 key: <p>key: undefined, title: Gidin, &#x27;key&#x27; in props: true, keys: title</p>
P4 key fix: <p>k1: Gidin</p>
```

React keeps `key` for itself (to tell list items apart), so destructuring `key` gives `undefined`.
The surprise: `'key' in props` is `true` in development, because React puts a hidden getter there
only to print the warning. `Object.keys` does not show it. The fix is to pass the value under
another name (`songId`).

### P5: props or children?

The same playlist card, built twice:

```jsx
function PlaylistCardProps({ header, footer, songs }) {
  return (
    <article>
      <header>{header}</header>
      <ul>{songs.map((s) => <li key={s}>{s}</li>)}</ul>
      <footer>{footer}</footer>
    </article>
  )
}
function PlaylistCardChildren({ children }) {
  return <article>{children}</article>
}
```

```
P5 props:    <article><header>Road trip</header><ul><li>Gidin</li><li>Sultans of Swing</li><li>My Old Ways</li></ul><footer>3 songs</footer></article>
P5 children: <article><header>Road trip</header><ul><li>Gidin</li><li>Sultans of Swing</li><li>My Old Ways</li></ul><footer>3 songs</footer></article>
P5 children, free shape: <article><h1>Only a title, no list</h1></article>
```

The HTML is the same, but **who decides the layout** is different:

- **Props version:** the card decides the structure: the header is always on top, the footer at the
  bottom, the songs always in a list. The caller only gives the data. In TypeScript the type can
  even require a header.
- **Children version:** the card is only a frame; the caller writes everything inside and can put
  anything there (the last line has no list at all).

**My choice:** I find props more organised, and I use them when the component has **named
places** (a title, a footer, a list of songs), because then every card looks the same and a
missing part is easy to see. I would use children when the component is a **wrapper** around
content it does not need to understand: a card frame, a modal, a layout, a button label.

### P6: defaults for props

```jsx
function Song({ title, artist = 'Unknown artist' }) {
  return <p>{title} - {artist}</p>
}
```

```
P6 missing:   <p>Gidin - Unknown artist</p>
P6 undefined: <p>Gidin - Unknown artist</p>
P6 null:      <p>Gidin - </p>
P6 given:     <p>Gidin - Peyk</p>
```

This is **form 7** in a component. A missing prop and `artist={undefined}` both use the default.
`artist={null}` does **not**: `null` is kept and React renders nothing for it, so the screen shows
an empty space after the dash. In TypeScript (`ts/props.tsx`) the type `artist?: string` does not
allow `null` at all; if `null` must be allowed, the type says `string | null` and the code uses
`artist ?? 'Unknown artist'`.

**A component cannot change its props:**

```jsx
function Rename(props) {
  props.title = 'changed'   // inside try/catch in the file
}
```

```
P6 change props: <p>TypeError: Cannot assign to read only property &#x27;title&#x27; of object &#x27;#&lt;Object&gt;&#x27;</p>
```

React freezes the props object in development. Props belong to the parent; a component that wants
a different value must make a new variable (`const shown = title ?? '...'`), not change props.

### P7: types for props and children

From `ts/props.tsx`:

```tsx
// (a) written by hand
function Badge({ label, children }: { label: string; children?: ReactNode }) { ... }
// (b) PropsWithChildren<P> adds children?: ReactNode to P
function Section({ heading, children }: PropsWithChildren<{ heading: string }>) { ... }
// (c) every attribute of a real <button>, plus my own label
function PlayButton({ label, ...rest }: ComponentProps<'button'> & { label: string }) {
  return <button type="button" {...rest}>▶ {label}</button>
}
```

```
P7 ReactNode: <span title="New">Fresh release</span> <span title="New">New</span>
P7 PropsWithChildren: <section><h2>Liked songs</h2><p>Gidin</p></section>
P7 ComponentProps: <button type="button" disabled="" aria-label="Play Gidin">▶ Play</button>
```

What each allows, and what the compiler rejects (real messages from `npx tsc --noEmit`):

| Code | Result |
| --- | --- |
| `children?: ReactNode`, child is text, a number, an element, `null` | allowed |
| `children?: ReactNode`, child is `() => 'Gidin'` | `TS2322: Type '() => string' is not assignable to type 'ReactNode'.` |
| `{ title: string }` without children, `<NoChildren title="x">text</NoChildren>` | `TS2322: Type '{ children: string; title: string; }' is not assignable to type 'IntrinsicAttributes & { title: string; }'.` |
| `<Card>text</Card>` without the required `title` | `TS2741: Property 'title' is missing in type '{ children: string; }' but required in type '{ title: string; children?: ReactNode; }'.` |
| `PropsWithChildren<{ title: string }>`, `title={42}` | `TS2322: Type 'number' is not assignable to type 'string'.` |
| `ComponentProps<'button'>`, `type="submit" disabled` | allowed |
| `ComponentProps<'button'>`, `onClick="play()"` | `TS2322: Type 'string' is not assignable to type 'MouseEventHandler<HTMLButtonElement>'.` |
| `ComponentProps<'button'>`, `href="/x"` | `TS2322: Type '{ label: string; href: string; }' is not assignable to type 'IntrinsicAttributes & ClassAttributes<HTMLButtonElement> & ButtonHTMLAttributes<HTMLButtonElement> & { ...; }'.` |

In short: `ReactNode` is "anything React can render" (so not a function); a component whose type
has **no** `children` refuses content between its tags; `PropsWithChildren` is a shortcut for
adding `children?: ReactNode`; and `ComponentProps<'button'>` lets the `...rest` from P4 be fully
typed, so the compiler knows which attributes a real button accepts. For a render prop the type
must say it is a function: `children: (song: string) => ReactNode`.

In plain JavaScript none of this is checked: `js/props.jsx` renders
`<Song title={404} artist={['Peyk', 'Dire Straits']} />` as `<p>404 - PeykDire Straits</p>` with no
error at all.

---

## JavaScript vs TypeScript

All errors are real messages from `npx tsc --noEmit` (strict, `noUncheckedIndexedAccess`), made by
compiling wrong code on purpose.

| Form | What stays the same | What you must add in TS | Error when you get it wrong |
| --- | --- | --- | --- |
| 1 `const [x, y] = f()` | the pattern | a tuple return type `[number, number]` | using `x` as the wrong type: `TS2322: Type 'string' is not assignable to type 'number'.` |
| 2 `[, b, ...rest]` | the pattern | nothing; `b` is `T \| undefined`, `rest` is `T[]` | `TS2322: Type 'string[]' is not assignable to type 'string'.` (treating rest as one item) |
| 3 `[a, b] = [b, a]` | the pattern | both variables need compatible types | swapping a `string` and a `number`: `TS2322: Type 'number' is not assignable to type 'string'.` |
| 4/7 defaults | the `= value` syntax | the default must fit the type | `const { plays = 'none' }` used as a number: `TS2322: Type 'number \| "none"' is not assignable to type 'number'.` |
| 5 `{ a, b } = t` | the pattern | a type for `t` | a field not in the type: `TS2339: Property 'genre' does not exist on type 'Song'.` |
| 6 `{ a: alpha }` | the pattern | the type goes after the pattern, never after the colon | `{ title: string }` in a parameter: `TS7031: Binding element 'string' implicitly has an 'any' type.` |
| 8 `{ a, ...rest }` | the pattern | nothing; TS computes the rest type | `TS2339: Property 'title' does not exist on type '{ artist: string; plays?: number \| undefined; }'.` |
| 9 nested | the pattern | the nested fields must exist in the type | `TS2339: Property 'album' does not exist on type 'Song'.` |
| 10 `{ [k]: v }` | the pattern | `k` must be `keyof T`, not any `string` | `TS2537: Type 'Song' has no matching index signature for type 'string'.` |
| 11 params with `= {}` | the pattern and both defaults | a type after the pattern, with optional fields if `= {}` is used | `TS2741: Property 'title' is missing in type '{}' but required in type '{ title: string; }'.` |
| 12 loops | the pattern | nothing; types come from `Object.entries` / `Map<K, V>` | swapping key and value in a `Map<string, number>`: `TS2322: Type 'string' is not assignable to type 'number'.` |
| T3 `[first] = arr` | the pattern | a check, a default or `??` | `TS18048: 'first' is possibly 'undefined'.` |

---

## My own log

Real things that went wrong or surprised me while working on this guide. I wrote down my guess
before running each example.

1. **I thought `[, second]` takes the first song.** I guessed `Song A`, it printed `Song B`.
   The empty place before the comma is a position too; it skips the first item.

2. **I thought rest takes everything.** For `const [first, ...others] = playlist` I guessed all four
   songs; the real output was `[ 'Song B', 'Song C', 'Song D' ]`. Rest only collects what is
   **left** after the named items.

3. **I thought a missing item would be skipped.** For `const [a, b] = ['Song A']` I guessed only
   `Song A`; it printed `Song A undefined`. A missing position is `undefined`, and there is no error.

4. **I thought the swap would not change anything.** For `[nowPlaying, next] = [next, nowPlaying]`
   I guessed `Song A Song B`; it printed `Song B Song A`. The right side is built from the old
   values first.

5. **I thought `null` would use the default.** `const [song = 'Unknown'] = [null]` printed `null`,
   not `Unknown`. Defaults only work for `undefined`. The same thing happened later in React with
   `<Song artist={null} />` (P6).

6. **I thought the old name after a rename is `undefined`.** After `const { title: songName } = song`
   I guessed `console.log(title)` prints `undefined`. It crashed:
   `ReferenceError: title is not defined`. The variable does not exist at all.
   The same happened with a nested pattern: after `const { album: { year } } = song`,
   `console.log(album)` gave `ReferenceError: album is not defined`. In both cases the name before
   the colon is only where to look, not a variable.

7. **I thought `const { album } = song` was a mistake** and should be `song.album`. Writing it as a
   plain assignment, `const album = song.album`, showed me that this is exactly what it means.
   After this I used the "write it as plain assignments" trick for every form.

8. **I thought calling `describe()` without an argument would print `undefined - 0 plays`.** It
   crashed: `TypeError: Cannot destructure property 'title' of 'undefined' as it is undefined.`
   My guess was only right after adding `= {}` to the parameter.

9. **I thought `{ title, artist } = song` would just work** without `const`. The file did not even
   start: `SyntaxError: Unexpected token '='`. A line starting with `{` is a block; it needs
   `({ title, artist } = song)`.

10. **I thought the `children` attribute would win** over the content between the tags. The tags won:
    `<div><h2>Gidin</h2>from tags</div>`, and nothing warned me that my attribute was lost.

11. **I thought `true` and `false` would show as `1` and `0`** (as in some languages). React shows
    nothing for both. But `0` itself **is** shown, which is the source of the `likes && ...` bug.

12. **I thought a function as children would print `Gidin`.** It printed nothing and React warned:
    `Functions are not valid as a React child...`. The component has to call it.

13. **I thought the explicitly written prop always wins over `{...rest}`.** It is the **last** one that
    wins: `className="card" {...rest}` gave `highlight`, `{...rest} className="card"` gave `card`.

14. **`React is not defined`.** When I ran a test `.jsx` file from the project root, I got
    `ReferenceError: React is not defined`. `tsconfig.json` only includes `js/**/*.jsx`, so outside
    that folder the `react-jsx` setting was not used. Moving the file into `js/` fixed it.

15. **`'key' in props` was `true`.** I expected React to remove `key` completely. In development it
    leaves a hidden getter that returns `undefined` and prints a warning; `Object.keys(props)` does
    not show it.

---

## Bonus 4: Git repository

https://github.com/batikankarakan/assignment4-destructuring-guide

The history shows the work in steps, one commit per part (arrays, objects, params, pitfalls, props,
TypeScript forms, TypeScript topics, typed props, output, README). The whole assignment was done on
one day (the deadline day), so the commits are all from the same day. `.gitignore` leaves out
`node_modules`. The project runs after `git clone`, `npm install` and `npm run all`.
