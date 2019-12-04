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
            return num0();
        case 1:
            return num1();
        case 2:
            return num2();
        case 3:
            return num3();
        case 4:
            return num4();
        case 5:
            return num5();
        case 6:
            return num6();
        case 7:
            return num7();
        case 8:
            return num8();
        case 9:
            return num9();
        case -1:
            return colon();
    }
}

const master: Pos[] = [
    [0, 0], [1, 0],
    [0, 1], [1, 1],
    [0, 2], [1, 2]
];

const mapping = (idxs: [number, number]): Path =>
    idxs.map(idx => master[idx]) as Path

const num0 = (): Path[] => {
    return [
        [0, 1],
        [1, 3],
        [3, 5],
        [4, 5],
        [2, 4],
        [2, 0],
        [0, 1],
    ].map(mapping);
}

const num1 = (): Path[] =>
    [
        [1, 3],
        [3, 5],
        [1, 3],
        [3, 5],
        [1, 3],
        [3, 5],
        [1, 3],
    ].map(mapping);

const num2 = (): Path[] =>
    [
        [0, 1],
        [1, 3],
        [2, 3],
        [2, 4],
        [4, 5],
        [0, 1],
        [1, 3],
    ].map(mapping);

const num3 = (): Path[] =>
    [
        [0, 1],
        [1, 3],
        [2, 3],
        [3, 5],
        [4, 5],
        [0, 1],
        [1, 3],
    ].map(mapping);

const num4 = (): Path[] =>
    [
        [0, 2],
        [1, 3],
        [2, 3],
        [3, 5],
        [0, 2],
        [1, 3],
        [2, 3],
    ].map(mapping);

const num5 = (): Path[] =>
    [
        [0, 1],
        [0, 2],
        [2, 3],
        [3, 5],
        [4, 5],
        [0, 1],
        [0, 2],
    ].map(mapping);

const num6 = (): Path[] =>
    [
        [0, 2],
        [2, 3],
        [2, 4],
        [3, 5],
        [4, 5],
        [0, 2],
        [2, 3],
    ].map(mapping);

const num7 = (): Path[] =>
    [
        [0, 1],
        [1, 3],
        [3, 5],
        [0, 1],
        [1, 3],
        [3, 5],
        [0, 1],
    ].map(mapping);

const num8 = (): Path[] =>
    [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3],
        [2, 4],
        [3, 5],
        [4, 5],
    ].map(mapping);

const num9 = (): Path[] =>
    [
        [0, 1],
        [0, 2],
        [1, 3],
        [2, 3],
        [3, 5],
        [0, 1],
        [0, 2],
    ].map(mapping);

const colon = (): Path[] =>
    [
        [[0.5, 0.25], [0.5, 0.75]],
        [[0.5, 1.25], [0.5, 1.75]]
    ];
