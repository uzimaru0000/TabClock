import { Pos, Path } from "./point";
import { numPath, Num } from './number';

interface Context {
    ctx: CanvasRenderingContext2D,
    grad: Grad
}

interface Grad {
    from: string,
    to: string
}

const main = () => {
    const blurCtx = init('blur_canvas');
    const ctx = init('canvas');

    const fromColor = randomColor();
    const toColor = randomColor();
    const grad = { from: fromColor, to: toColor };
    drawGrad(blurCtx, grad);

    let cancel = loop({ ctx, grad });

    window.addEventListener('focus', () => {
        cancel = loop({ ctx, grad });
    });
    window.addEventListener('blur', () => {
        cancel();
    });
};

const init = (id: string) => {
    const canvas = document.getElementById(id) as HTMLCanvasElement;
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    return canvas.getContext('2d');
};

const loop = (ctx: Context) => {
    let process = 0;
    const inner = () => {
        const date = new Date();
        const timer =
            date.getHours() * 60 * 60 +
            date.getMinutes() * 60 +
            date.getSeconds() +
            date.getMilliseconds() / 1000;

        draw(ctx, timer);
        process = requestAnimationFrame(inner);
    };

    process = requestAnimationFrame(inner);

    return () => {
        cancelAnimationFrame(process);
    };
}

// Draw

const draw = ({ ctx, grad }: Context, time: number) => {
    const scale = ctx.canvas.width * 0.25 / 8;
    const pos = [
        (ctx.canvas.width - (8 * scale + 7 * scale)) / 2,
        (ctx.canvas.height - (2 * scale)) / 2
    ] as Pos;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = chooseTextColor(grad.from);
    ctx.lineWidth = 4;
    drawAnimatedTime(ctx, pos, scale)(time);
}

const createGradient = (ctx: CanvasRenderingContext2D, from: string, to: string) => {
    const grad = ctx.createLinearGradient(0, ctx.canvas.height, ctx.canvas.width, 0);
    grad.addColorStop(0, from);
    grad.addColorStop(1, to);

    return grad;
}

const drawGrad = (ctx: CanvasRenderingContext2D, grad: Grad) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = createGradient(ctx, grad.from, grad.to);
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
}

const drawPath = (ctx: CanvasRenderingContext2D) => ([from, to]: Path) => {
    ctx.moveTo(from[0], from[1]);
    ctx.lineTo(to[0], to[1]);
};

const drawAnimatedTime = (ctx: CanvasRenderingContext2D, pos: Pos, scale: number) =>
    (time: number) => {
        ctx.save();
        const curr = convTimer(time);

        const lerpTime = 0.5;

        const rate = [
            timing((curr.h - Math.floor(curr.h)) * 3600) / lerpTime,
            0,
            timing((curr.m - Math.floor(curr.m)) * 60) / lerpTime,
            0,
            timing((curr.s - Math.floor(curr.s))) / lerpTime
        ];

        const prevTimePath = timePath(pos, scale)(
            looping(0, 23)(Math.floor(curr.h) - 1),
            looping(0, 59)(Math.floor(curr.m) - 1),
            looping(0, 59)(Math.floor(curr.s) - 1)
        );

        const currTimePath = timePath(pos, scale)(
            Math.floor(curr.h),
            Math.floor(curr.m),
            Math.floor(curr.s)
        );

        ctx.beginPath();
        prevTimePath
            .map((x, i) => [x, currTimePath[i], rate[i]] as [Path[][], Path[][], number])
            .map(([c, n, r]) => {
                const [currentPath, nextPath] =
                    [c, n]
                        .map(x => x.reduce((acc, x) => acc.concat(x)))
                return currentPath.map((x, i) => lerpPath(r)(x, nextPath[i]))
            })
            .reduce((acc, x) => acc.concat(x))
            .forEach(drawPath(ctx));

        ctx.stroke();
    }

// util

const convTimer = (t: number) => (
    {
        h: t / 3600,
        m: (t % 3600) / 60,
        s: t % 60
    }
);

const movePath = ([dx, dy]: Pos) => (path: Path): Path =>
    path.map(([x, y]) => [x + dx, y + dy]) as Path;

const scalePath = (scale: number) => (path: Path): Path =>
    path.map(([x, y]) => [x * scale, y * scale]) as Path;

const lerp = (r: number) => ([x1, y1]: Pos, [x2, y2]: Pos): Pos =>
    [x1 * (1 - clamp01(r)) + x2 * clamp01(r), y1 * (1 - clamp01(r)) + y2 * clamp01(r)];

const lerpPath = (r: number) => ([from1, to1]: Path, [from2, to2]: Path): Path =>
    [lerp(r)(from1, from2), lerp(r)(to1, to2)];

const timePath = ([px, py]: Pos, scale: number) => (h: number, m: number, s: number) => {
    const [hPath, mPath, sPath] = [h, m, s]
        .map(n => ("00" + n.toString()).slice(-2).split('').map(Number))
        .map(x => x.map(x => numPath(x as Num)));

    return [hPath, [numPath(-1)], mPath, [numPath(-1)], sPath]
        .map((xs: Path[][]) => xs.map((x: Path[]) => x.map(scalePath(scale))))
        .reduce((acc, xs: Path[][]) => {
            return {
                cnt: acc.cnt + xs.length,
                arr: [
                    ...acc.arr,
                    xs.map((x: Path[], i) => x.map(movePath([px + (scale * 2) * (i + acc.cnt), py])))
                ]
            }
        }, { cnt: 0, arr: [] as Path[][][] }).arr;
}

const randomColor = () =>
    `#${("000000" + Math.floor(Math.random() * 16777216).toString(16)).slice(-6)}`;

const clamp = (min: number, max: number) => (n: number) =>
    Math.min(max, Math.max(n, min))

const clamp01 = clamp(0, 1);

const looping = (min: number, max: number) => (n: number) =>
    n > max
        ? min
        : n < min
            ? max
            : n;

const stringToColor = (color: string) =>
    [
        Math.floor(parseInt(color.slice(1), 16) / (256 * 256)),
        Math.floor(parseInt(color.slice(1), 16) % (256 * 256) / 256),
        Math.floor(parseInt(color.slice(1), 16) % 256)
    ];

const chooseTextColor = (color: string) => {
    // sRGB を RGB に変換し、背景色の相対輝度を求める
    const toRgbItem = (item: number) => {
        const i = item / 255;
        return i <= 0.03928 ? i / 12.92 : Math.pow((i + 0.055) / 1.055, 2.4);
    };

    const [red, green, blue] = stringToColor(color);

    const R = toRgbItem(red);
    const G = toRgbItem(green);
    const B = toRgbItem(blue);
    const Lbg = 0.2126 * R + 0.7152 * G + 0.0722 * B;

    // 白と黒の相対輝度。定義からそれぞれ 1 と 0 になる。
    const Lw = 1;
    const Lb = 0;

    // 白と背景色のコントラスト比、黒と背景色のコントラスト比を
    // それぞれ求める。
    const Cw = (Lw + 0.05) / (Lbg + 0.05);
    const Cb = (Lbg + 0.05) / (Lb + 0.05);

    // コントラスト比が大きい方を文字色として返す。
    return Cw < Cb ? '#242424' : '#eee';
}

const timing = (t: number) =>
    Math.pow(2, 10 * (t - 1));

// run

main();
