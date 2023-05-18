# ts-tensors

Dependent tensor types and operations in TS.

This is a learning project as part of my quest to find deep learning tools that don't drive me crazy. Unfortunately TS doesn't currently support heavy usage of dependent types, so this library is not suitable for real use-cases.

## What is this?

One of the biggest pain points in developing deep learning applications with eg a dynamically-typed language like Python is having to wait until you run your code to detect a Tensor mismatch. With dependent types you can detect these at compile time!

For example:

```ts
import type { Matrix, Scalar, ScalarShape, Tensor, Vector } from "ts-tensors";
import { concat, flatten, transpose } from "ts-tensors";

// These lines will complain if your vectors have the wrong length
const vector1: Vector<2> = [1, 2];
const vector2: Vector<5> = [3, 4, 5, 6, 7];
// Calling `concat` will complain if your vectors don't have the expected length
const concatenated: Vector<7> = concat<2, 5>(vector1, vector2);

// This line will complain if your matrix doesn't have the right shape
const matrix: Matrix<2, 3> = [
	[1, 2, 3],
	[4, 5, 6],
];
// Calling `transpose` will complain if your matrix isn't the expected shape
const transposed: Matrix<3, 2> = transpose<2, 3>(matrix);

// Arbitrary tensors can be specified via a `Shape`
// `Scalar`, `Vector`, and `Matrix` are just wrappers around `Tensor`
type MyTensorShape = readonly [1, 2, 3];
const tensor: Tensor<MyTensorShape> = [
	[
		[1, 2, 3],
		[4, 5, 6],
	],
];
const flattenedTensor: Vector<6> = flatten<MyTensorShape>(tensor);
const scalar: Scalar = 1.234;
// `ScalarShape` = `readonly []`
const flattenedScalar: Vector<1> = flatten<ScalarShape>(scalar);
```

## What's the problem?

Since TS doesn't have good support for tail recursion and its integer type (`bigint`) was only retroactively added to the language (so eg lists are indexed using `number`), the simplest solution I've found is to [enumerate positive integers](./src/lib.ts#L7). However, if we go beyond around 23 we quickly hit up against recursion limits in the type system. So for now we're stuck with very small tensors because eg even a 2x3x4 tensor cannot be represented once you try to flatten it.

(Interestingly TS is able to build this project with natural numbers specified up to 24, but Jest appears to decrease the maximum allowable recursion depth by 1.)
