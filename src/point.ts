export type Pos = [number, number];

export type Path = [Pos, Pos];

export interface Point {
    pos: Pos,
    vec: Pos
}