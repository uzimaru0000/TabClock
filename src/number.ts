import { Pos, Path } from './point';

export type Num =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | -1

export const numPath = (num: Num): Path[] => {
    switch (num) {
        case 0:
            return num0;
        case 1:
            return num1;
        case 2:
            return num2;
        case 3:
            return num3;
        case 4:
            return num4;
        case 5:
            return num5;
        case 6:
            return num6;
        case 7:
            return num7;
        case 8:
            return num8;
        case 9:
            return num9;
        case -1:
            return colon;
    }
}

const master: Pos[] = [
    [0, 0], [1, 0],
    [0, 1], [1, 1],
    [0, 2], [1, 2]
];

const mapping = (idxs: [number, number]): Path =>
    idxs.map(idx => master[idx]) as Path

const path = [
    [1, 3],
    [5, 3],
    [5, 4],
    [2, 4],
    [2, 0],
    [1, 0],
    [2, 3],
].map(mapping);

const num0 = [
    path[0],
    path[1],
    path[2],
    path[3],
    path[4],
    path[5],
    path[3],
];

const num1 = [
    path[0],
    path[1],
    path[1],
    path[1],
    path[1],
    path[0],
    path[0]
];

const num2 = [
    path[0],
    path[6],
    path[3],
    path[2],
    path[6],
    path[5],
    path[6]
];

const num3 = [
    path[0],
    path[1],
    path[6],
    path[2],
    path[6],
    path[5],
    path[6]
];

const num4 = [
    path[0],
    path[1],
    path[6],
    path[1],
    path[6],
    path[4],
    path[6]
]

const num5 = [
    path[5],
    path[1],
    path[6],
    path[2],
    path[6],
    path[4],
    path[6]
]

const num6 = [
    path[4],
    path[1],
    path[6],
    path[2],
    path[6],
    path[4],
    path[3],
]

const num7 = [
    path[0],
    path[1],
    path[1],
    path[1],
    path[0],
    path[5],
    path[0],
]

const num8 = [
    path[0],
    path[1],
    path[2],
    path[3],
    path[4],
    path[5],
    path[6],
]

const num9 = [
    path[0],
    path[1],
    path[1],
    path[6],
    path[4],
    path[5],
    path[6],
]

const colon = [
    [[0.5, 0.25], [0.5, 0.75]],
    [[0.5, 1.25], [0.5, 1.75]]
] as Path[];
