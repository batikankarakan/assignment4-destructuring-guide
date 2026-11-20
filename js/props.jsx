// Batıkan Karakan, 1700002010
// Props and children in plain JavaScript (JSX). Run with `npx tsx js/props.jsx`.
import { renderToStaticMarkup } from 'react-dom/server'

const html = renderToStaticMarkup

// P1: props is ONE object. Both components receive { title, children }.
// SongCardA reads it with dots; SongCardB takes it apart in the parameter (form 5 inside form 11).
function SongCardA(props) {
  console.log('P1 props object:', props)
  return <div><h2>{props.title}</h2>{props.children}</div>
}
function SongCardB({ title, children }) {
  return <div><h2>{title}</h2>{children}</div>
}
console.log('P1 A:', html(<SongCardA title="Gidin">Peyk</SongCardA>))
console.log('P1 B:', html(<SongCardB title="Gidin">Peyk</SongCardB>))

// P2: children is only a prop. Between the tags or as an attribute: the same object.
console.log('P2 tags:     ', html(<SongCardB title="Gidin">Peyk</SongCardB>))
console.log('P2 attribute:', html(<SongCardB title="Gidin" children="Peyk" />))
// Both at once: the content between the tags overwrites the attribute, silently.
console.log('P2 both:     ', html(<SongCardB title="Gidin" children="from prop">from tags</SongCardB>))

// P3: what children can be, and what appears on the screen.
const childCases = [
  ['string', 'Sultans of Swing'],
  ['number', 348],
  ['zero', 0],
  ['true', true],
  ['false', false],
  ['null', null],
  ['undefined', undefined],
  ['one element', <b>Tame Impala</b>],
  ['array', ['Gidin', ' / ', 'My Old Ways']],
]
for (const [name, value] of childCases) {
  console.log(`P3 ${name.padEnd(11)}:`, html(<SongCardB title="X">{value}</SongCardB>))
}
// Several elements between the tags arrive as an array in props.children.
function CountChildren({ children }) {
  return <p>{Array.isArray(children) ? `array of ${children.length}` : typeof children}</p>
}
console.log('P3 several elements:', html(
  <CountChildren><i>Gidin</i><i>My Old Ways</i><i>We Are the People</i></CountChildren>,
))
console.log('P3 one element:     ', html(<CountChildren><i>Gidin</i></CountChildren>))
console.log('P3 no children:     ', html(<CountChildren />))
// The 0 trap: `likes && ...` shows a 0 when likes is 0, because 0 is a number and React renders numbers.
const likes = 0
console.log('P3 zero trap:', html(<SongCardB title="Gidin">{likes && <span>{likes} likes</span>}</SongCardB>))
console.log('P3 zero fix: ', html(<SongCardB title="Gidin">{likes > 0 && <span>{likes} likes</span>}</SongCardB>))
// A function: React does not call it. It renders nothing and warns (the warning goes to stderr).
console.log('P3 function:', html(<SongCardB title="X">{() => 'Gidin'}</SongCardB>))
// ...unless the component calls it itself (a "render prop").
function NowPlaying({ children }) {
  return <div>{children('The Adults Are Talking')}</div>
}
console.log('P3 render prop:', html(<NowPlaying>{(song) => <b>{song}</b>}</NowPlaying>))

// P4: separate children from the other props with rest, and spread the rest onto a DOM element.
function Track({ title, children, ...rest }) {
  console.log('P4 rest:', rest)
  return <section {...rest}><h3>{title}</h3>{children}</section>
}
console.log('P4:', html(<Track title="Gidin" id="song-1" className="track" data-plays="12">Peyk</Track>))
// The order decides who wins: a later attribute overwrites an earlier one.
function TrackDefaultClass({ title, ...rest }) {
  return <section className="card" {...rest}>{title}</section> // caller can override
}
function TrackLockedClass({ title, ...rest }) {
  return <section {...rest} className="card">{title}</section> // caller cannot override
}
console.log('P4 explicit then spread:', html(<TrackDefaultClass title="Gidin" className="highlight" />))
console.log('P4 spread then explicit:', html(<TrackLockedClass title="Gidin" className="highlight" />))
// Rest with a name that already exists: title is taken out, so it is NOT in rest and NOT on the section.
function TitleTwice({ title, ...rest }) {
  return <section {...rest}>{title}</section>
}
console.log('P4 named prop not in rest:', html(<TitleTwice title="Gidin" />))
// key is not a prop: React keeps it for itself, the component never sees the value.
// Surprise: in development `'key' in props` is true, because React puts a hidden getter there
// that only warns (stderr) and returns undefined. Object.keys does not list it.
function ShowKey(props) {
  const { key, title } = props
  return <p>{`key: ${key}, title: ${title}, 'key' in props: ${'key' in props}, keys: ${Object.keys(props)}`}</p>
}
console.log('P4 key:', html(<ShowKey key="k1" title="Gidin" />))
// Fix: pass the value under a different name.
function ShowId({ songId, title }) {
  return <p>{`${songId}: ${title}`}</p>
}
console.log('P4 key fix:', html(<ShowId key="k1" songId="k1" title="Gidin" />))

// P5: props or children? The same card built twice.
// (a) with header and footer props: the card decides WHERE each part goes.
function PlaylistCardProps({ header, footer, songs }) {
  return (
    <article>
      <header>{header}</header>
      <ul>{songs.map((s) => <li key={s}>{s}</li>)}</ul>
      <footer>{footer}</footer>
    </article>
  )
}
// (b) with children only: the caller writes the whole inside.
function PlaylistCardChildren({ children }) {
  return <article>{children}</article>
}
const mySongs = ['Gidin', 'Sultans of Swing', 'My Old Ways']
console.log('P5 props:   ', html(
  <PlaylistCardProps header="Road trip" footer="3 songs" songs={mySongs} />,
))
console.log('P5 children:', html(
  <PlaylistCardChildren>
    <header>Road trip</header>
    <ul>{mySongs.map((s) => <li key={s}>{s}</li>)}</ul>
    <footer>3 songs</footer>
  </PlaylistCardChildren>,
))
// The children version also accepts things the props version never planned for:
console.log('P5 children, free shape:', html(
  <PlaylistCardChildren><h1>Only a title, no list</h1></PlaylistCardChildren>,
))

// P6: defaults for props (form 7). undefined triggers the default, null does not.
function Song({ title, artist = 'Unknown artist' }) {
  return <p>{title} - {artist}</p>
}
console.log('P6 missing:  ', html(<Song title="Gidin" />))
console.log('P6 undefined:', html(<Song title="Gidin" artist={undefined} />))
console.log('P6 null:     ', html(<Song title="Gidin" artist={null} />))
console.log('P6 given:    ', html(<Song title="Gidin" artist="Peyk" />))

// P6, a component that changes its props: in development React freezes the props object.
function Rename(props) {
  try {
    props.title = 'changed'
  } catch (error) {
    return <p>{`${error.constructor.name}: ${error.message}`}</p>
  }
  return <p>{props.title}</p>
}
console.log('P6 change props:', html(<Rename title="Gidin" />))

// P7: types. In plain JavaScript nothing checks props: a wrong type renders without an error.
console.log('P7 no types in JS:', html(<Song title={404} artist={['Peyk', 'Dire Straits']} />))
// The typed version (ReactNode, PropsWithChildren, ComponentProps<'button'>) is in ts/props.tsx.
