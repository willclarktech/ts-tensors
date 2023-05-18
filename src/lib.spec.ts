/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Matrix, Scalar, Tensor, Vector } from "./lib";
import { concat, flatten, matrixMultiply, transpose } from "./lib";

describe("ts-tensors", () => {
	const scalar1: Scalar = 0;
	const scalar2: Scalar = 20;
	const scalar3: Scalar = -2;
	const scalar4: Scalar = 1.234;
	// @ts-expect-error: vector is not a scalar=
	const badScalar1: Scalar = [1, 2, 3];
	// @ts-expect-error: matrix is not a scalar
	const badScalar2: Scalar = [
		[1, 2],
		[3, 4],
		[5, 6],
	];

	const vector1: Vector<1> = [20];
	const vector2: Vector<4> = [1, 2, 3, 4];
	// @ts-expect-error: vector cannot be empty
	const badVector1: Vector<0> = [];
	// @ts-expect-error: vector has too few elements
	const badVector2: Vector<1> = [];
	// @ts-expect-error: vector has too many elements
	const badVector3: Vector<1> = [1, 2];
	// @ts-expect-error: vector has too few elements
	const badVector4: Vector<4> = [1, 2];
	// @ts-expect-error: scalar is not a vector
	const badVector5: Vector<1> = 123;
	// // @ts-expect-error: matrix is not a vector
	// const badVector5: Vector<4> = [
	// 	[1, 2],
	// 	[3, 4],
	// ];

	const matrix1: Matrix<2, 3> = [
		[1, 2, 3],
		[4, 5, 6],
	];
	console.log("matrix1", matrix1);

	const matrix2 = transpose<2, 3>(matrix1);
	console.log("matrix2", matrix2);

	const matrix3 = matrixMultiply<2, 3, 2>(matrix1, matrix2);
	console.log("matrix3", matrix3);

	const vc = concat<1, 4>(vector1, vector2);

	const flattened1 = flatten<readonly []>(scalar2);
	const flattened2 = flatten<readonly [1]>(vector1);
	const flattened3 = flatten<readonly [4]>(vector2);
	const flattened4 = flatten<readonly [2, 3]>(matrix1);
	console.log("flattened4", flattened4);

	const tensor1: Tensor<readonly [2, 3, 4]> = [
		[
			[1, 2, 3, 4],
			[5, 6, 7, 8],
			[9, 10, 11, 12],
		],
		[
			[13, 14, 15, 16],
			[17, 18, 19, 20],
			[21, 22, 23, 24],
		],
	];

	const flattened5 = flatten<readonly [2, 3, 4]>(tensor1);
	console.log("flattened5", flattened5);

	describe("tensor operations", () => {
		describe("isScalar", () => {
			it("works", () => {
				throw new Error("Not implemented");
			});
		});
		describe("flatten", () => {
			it("works", () => {
				throw new Error("Not implemented");
			});
		});
	});
});
