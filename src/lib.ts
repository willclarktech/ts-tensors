/**
 * Types
 */

// NOTE: Enumerating valid positive integers is a pain but makes other things
// easier
export type Positives = readonly [
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	21,
	22,
	23,
	// More than this and we hit maximum depth with `Product` (TS2589)
];
export type Positive = Positives[number];

export type Cons<H, T extends readonly unknown[]> = readonly [H, ...T];

type Naturals = Cons<0, Positives>;
export type Natural = Naturals[number];

// Assume non-zero dimensions
export type Shape = readonly Positive[];
export type ScalarShape = readonly [];
export type VectorShape<N extends Positive> = readonly [N];
export type MatrixShape<
	NRows extends Positive,
	NCols extends Positive,
> = readonly [NRows, NCols];

export type Head<L extends Shape> = L extends Cons<infer H, Shape> ? H : never;

export type Tail<L extends Shape> = L extends Cons<
	Positive,
	infer T extends Shape
>
	? T
	: never;

export type Increment = Positives;
export type Decrement = Cons<never, Naturals>;

// NOTE: We need to accept undefined here because of recursion in case we went
// beyond the defined naturals
export type Add<
	N extends Natural | undefined,
	M extends Natural | undefined,
> = N extends undefined
	? never
	: M extends 0
	? N
	: N extends keyof Increment
	? M extends keyof Decrement
		? Add<Increment[N], Decrement[M]>
		: never
	: never;

export type Multiply<
	N extends Natural,
	M extends Natural,
	Acc extends Natural = 0,
> = M extends 0 ? Acc : Multiply<N, Decrement[M], Add<Acc, N>>;

export type Product<
	S extends readonly Natural[],
	Acc extends Natural = 1,
> = S extends ScalarShape
	? Acc
	: S extends Cons<infer H extends Natural, infer T extends readonly Natural[]>
	? Product<T, Multiply<Acc, H>>
	: never;

type Arr<
	N extends Natural,
	S extends Shape,
	Acc extends readonly Tensor<S>[] = readonly [],
> = N extends 0 ? Acc : Arr<Decrement[N], S, Cons<Tensor<S>, Acc>>;

export type Tensor<S extends Shape> = S extends ScalarShape
	? number
	: S extends Cons<infer H extends Positive, infer T extends Shape>
	? Arr<H, T>
	: never;

export type Scalar = Tensor<ScalarShape>;
export type Vector<N extends Positive> = Tensor<VectorShape<N>>;
export type Matrix<NRows extends Positive, NCols extends Positive> = Tensor<
	MatrixShape<NRows, NCols>
>;

/**
 * Tensor operations
 */

export const isScalar = <S extends Shape>(t: Scalar | Tensor<S>): t is Scalar =>
	!Array.isArray(t);

export const flatten = <S extends Shape>(t: Tensor<S>): Vector<Product<S>> => {
	if (isScalar(t)) {
		const v: Vector<1> = [t];
		return v as Vector<Product<S>>;
	}
	const v = t.flatMap((t_: Tensor<Tail<S>>) => flatten<Tail<S>>(t_));
	return v as unknown as Vector<Product<S>>;
};

/**
 * Vector operations
 */

export const concat = <N extends Positive, M extends Positive>(
	v1: Vector<N>,
	v2: Vector<M>,
): Vector<Add<N, M>> => [...v1, ...v2] as unknown as Vector<Add<N, M>>;

export const dotProduct = <N extends Positive>(
	v1: Vector<N>,
	v2: Vector<N>,
): Scalar =>
	v1.reduce(
		(subtotal: number, v: number, i: number) => subtotal + v * v2[i],
		0,
	);

export const outerProduct = <N extends Positive>(
	v1: Vector<N>,
	v2: Vector<N>,
): Matrix<N, N> =>
	v1.map((a) => v2.map((b) => a * b)) as unknown as Matrix<N, N>;

/**
 * Matrix operations
 */

export const transpose = <NRows extends Positive, NCols extends Positive>(
	m: Matrix<NRows, NCols>,
): Matrix<NCols, NRows> => {
	return m[0].map((_, i) => m.map((row) => row[i])) as unknown as Matrix<
		NCols,
		NRows
	>;
};

export const matrixMultiply = <
	N extends Positive,
	M extends Positive,
	P extends Positive,
>(
	m1: Matrix<N, M>,
	m2: Matrix<M, P>,
): Matrix<N, P> =>
	(m1 as readonly (readonly Scalar[])[]).map((row) =>
		(m2 as readonly (readonly Scalar[])[])[0].map((_, j) =>
			row.reduce<Scalar>((subtotal, s1, n) => subtotal + s1 * m2[n][j], 0),
		),
	) as unknown as Matrix<N, P>;
