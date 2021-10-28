"use strict";

class PointF{
	constructor(x,y){
		this[0] = x;
		this[1] = y;
	}
}

function GetCurveControlPoints(knots)
{
	if (knots == null)
		throw "Knots cannot be null";
	let n = knots.length - 1;
	if (n < 1)
		throw "At least two knot points required";
	if (n == 1)
	{ // Special case: Bezier curve should be a straight line.
		let firstControlPoints = []; //new PointF[1];
		// 3P1 = 2P0 + P3
		//firstControlPoints[0][0] = (2 * knots[0][0] + knots[1][0]) / 3;
		//firstControlPoints[0][1] = (2 * knots[0][1] + knots[1][1]) / 3;
		firstControlPoints.push(new PointF((2 * knots[0][0] + knots[1][0]) / 3,(2 * knots[0][1] + knots[1][1]) / 3 ));

		let secondControlPoints = []; //new PointF[1];
		// P2 = 2P1 – P0
		//secondControlPoints[0][0] = 2 *  firstControlPoints[0][0] - knots[0][0];
		//secondControlPoints[0][1] = 2 * 	firstControlPoints[0][1] - knots[0][1];
		
		secondControlPoints.push(new PointF(2 * firstControlPoints[0][0] - knots[0][0], 2 * firstControlPoints[0][1] - knots[0][1] ));
		
		return {P1: firstControlPoints, P2: secondControlPoints};
	}

	// Calculate first Bezier control points
	// Right hand side vector
	let rhs = new Array(n);

	// Set right hand side X values
	for (let i = 1; i < n - 1; ++i)
		rhs[i] = 4 * knots[i][0] + 2 * knots[i + 1][0];
	
	rhs[0] = knots[0][0] + 2 * knots[1][0];
	rhs[n - 1] = (8 * knots[n - 1][0] + knots[n][0]) / 2.0;
	// Get first control points X-values
	let x = GetFirstControlPoints(rhs);

	// Set right hand side Y values
	for (let i = 1; i < n - 1; ++i)
		rhs[i] = 4 * knots[i][1] + 2 * knots[i + 1][1];
	
	rhs[0] = knots[0][1] + 2 * knots[1][1];
	rhs[n - 1] = (8 * knots[n - 1][1] + knots[n][1]) / 2.0;
	// Get first control points Y-values
	let y = GetFirstControlPoints(rhs);

	// Fill output arrays.
	let firstControlPoints = new Array(n);
	let secondControlPoints = new Array(n);
	
	for (let i = 0; i < n; ++i)
	{
		// First control point
		firstControlPoints[i] = new PointF(x[i], y[i]);
		// Second control point
		if (i < n - 1)
			secondControlPoints[i] = new PointF(2 * knots[i + 1][0] - x[i + 1], 2 * knots[i + 1][1] - y[i + 1]);
		else
			secondControlPoints[i] = new PointF((knots[n][0] + x[n - 1]) / 2, (knots[n][1] + y[n - 1]) / 2);
	}
	
	return {P1: firstControlPoints, P2: secondControlPoints};
}

function GetFirstControlPoints(rhs)
{
	let n = rhs.length;
	let x = new Array(n); // Solution vector.
	let tmp = new Array(n); // Temp workspace.

	let b = 2.0;
	x[0] = rhs[0] / b;
	for (let i = 1; i < n; i++) // Decomposition and forward substitution.
	{
		tmp[i] = 1 / b;
		b = (i < n - 1 ? 4.0 : 3.5) - tmp[i];
		x[i] = (rhs[i] - x[i - 1]) / b;
	}
	for (let i = 1; i < n; i++)
		x[n - i - 1] -= tmp[n - i] * x[n - i]; // Backsubstitution.

	return x;
}

export {GetCurveControlPoints};