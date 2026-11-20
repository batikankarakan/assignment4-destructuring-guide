// Batıkan Karakan, 1700002010
// Props and children in TypeScript. Run with `npx tsx ts/props.tsx`.
import type { ComponentProps, PropsWithChildren, ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const html = renderToStaticMarkup

// P1: props is one object. The type describes the whole object and goes after the pattern.
type SongCardProps = { title: string; children?: ReactNode }
function SongCardA(props: SongCardProps) {
  return <div><h2>{props.title}</h2>{props.children}</div>
}
function SongCardB({ title, children }: SongCardProps) {
  return <div><h2>{title}</h2>{children}</div>
}
console.log('P1 A:', html(<SongCardA title="Gidin">Peyk</SongCardA>))
console.log('P1 B:', html(<SongCardB title="Gidin">Peyk</SongCardB>))

// P2: children is only a prop, so the type checks it in both places the same way.
console.log('P2 tags:     ', html(<SongCardB title="Gidin">Peyk</SongCardB>))
console.log('P2 attribute:', html(<SongCardB title="Gidin" children="Peyk" />))

// P3: ReactNode is the type of "anything React can render":
// string, number, boolean, null, undefined, elements and arrays of them. A function is NOT a ReactNode.
const nodes: [string, ReactNode][] = [
  ['string', 'Sultans of Swing'],
  ['number', 348],
  ['false', false],
  ['null', null],
  ['element', <b>Tame Impala</b>],
  ['array', ['Gidin', ' / ', 'My Old Ways']],
]
for (const [name, node] of nodes) {
  console.log(`P3 ${name.padEnd(7)}:`, html(<SongCardB title="X">{node}</SongCardB>))
}
// A render prop needs its own type, because a function is not a ReactNode.
function NowPlaying({ children }: { children: (song: string) => ReactNode }) {
  return <div>{children('The Adults Are Talking')}</div>
}
console.log('P3 render prop:', html(<NowPlaying>{(song) => <b>{song}</b>}</NowPlaying>))

// P4: rest props, typed. The rest type is everything in the props type except the named fields.
type TrackProps = { title: string; children?: ReactNode } & ComponentProps<'section'>
function Track({ title, children, ...rest }: TrackProps) {
  // rest: the section attributes (id, className, ...) without title and children
  return <section {...rest}><h3>{title}</h3>{children}</section>
}
console.log('P4:', html(<Track title="Gidin" id="song-1" className="track">Peyk</Track>))
function TrackLocked({ title, ...rest }: TrackProps) {
  return <section {...rest} className="card">{title}</section>
}
console.log('P4 spread then explicit:', html(<TrackLocked title="Gidin" className="highlight" />))

// P5: props or children, typed. The props version can require exactly what it needs.
type PlaylistProps = { header: string; footer: ReactNode; songs: string[] }
function PlaylistCardProps({ header, footer, songs }: PlaylistProps) {
  return (
    <article>
      <header>{header}</header>
      <ul>{songs.map((s) => <li key={s}>{s}</li>)}</ul>
      <footer>{footer}</footer>
    </article>
  )
}
function PlaylistCardChildren({ children }: PropsWithChildren) {
  return <article>{children}</article>
}
const mySongs = ['Gidin', 'Sultans of Swing', 'My Old Ways']
console.log('P5 props:   ', html(<PlaylistCardProps header="Road trip" footer={<em>3 songs</em>} songs={mySongs} />))
console.log('P5 children:', html(<PlaylistCardChildren><h1>Road trip</h1></PlaylistCardChildren>))

// P6: defaults in a typed component. artist is optional in the type; the default makes it a string inside.
// null is not allowed by this type at all, so the "null does not trigger the default" bug cannot happen here.
type SongProps = { title: string; artist?: string }
function Song({ title, artist = 'Unknown artist' }: SongProps) {
  return <p>{title} - {artist.toUpperCase()}</p>
}
console.log('P6 missing:  ', html(<Song title="Gidin" />))
console.log('P6 undefined:', html(<Song title="Gidin" artist={undefined} />))
console.log('P6 given:    ', html(<Song title="Gidin" artist="Peyk" />))
// If null must be accepted, the type says so and the code has to handle it with ??.
function SongNullable({ title, artist }: { title: string; artist?: string | null }) {
  return <p>{title} - {artist ?? 'Unknown artist'}</p>
}
console.log('P6 null with ??:', html(<SongNullable title="Gidin" artist={null} />))

// P7: three ways to type children and DOM props.
// (a) children?: ReactNode: written by hand, optional.
function Badge({ label, children }: { label: string; children?: ReactNode }) {
  return <span title={label}>{children ?? label}</span>
}
console.log('P7 ReactNode:', html(<Badge label="New">{'Fresh release'}</Badge>), html(<Badge label="New" />))
// (b) PropsWithChildren<P> adds `children?: ReactNode` to P for you.
function Section({ heading, children }: PropsWithChildren<{ heading: string }>) {
  return <section><h2>{heading}</h2>{children}</section>
}
console.log('P7 PropsWithChildren:', html(<Section heading="Liked songs"><p>Gidin</p></Section>))
// (c) ComponentProps<'button'>: every attribute a real <button> accepts, plus my own label.
function PlayButton({ label, ...rest }: ComponentProps<'button'> & { label: string }) {
  return <button type="button" {...rest}>▶ {label}</button>
}
console.log('P7 ComponentProps:', html(<PlayButton label="Play" disabled aria-label="Play Gidin" />))
// What the compiler rejects (real messages from `npx tsc --noEmit`, see README):
//   <PlayButton label="Play" onClick="play()" />  → TS2322: Type 'string' is not assignable to type 'MouseEventHandler<HTMLButtonElement>'.
//   <PlayButton label="Play" href="/x" />         → TS2322 (href is not a button attribute)
//   <Song>Gidin</Song>                             → TS2322 (Song has no children in its type)
//   <SongCardB title="X">{() => 'Gidin'}</SongCardB> → TS2322: Type '() => string' is not assignable to type 'ReactNode'.
