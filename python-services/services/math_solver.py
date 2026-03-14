from sympy import symbols, solve, simplify, latex, sympify
from sympy.parsing.sympy_parser import parse_expr
import re

def solve_equation(equation_str: str) -> dict:
    """Solve a mathematical equation using SymPy"""
    try:
        x = symbols('x')
        # Clean the equation string
        eq_str = equation_str.replace("^", "**").replace("×", "*").replace("÷", "/")

        if "=" in eq_str:
            left, right = eq_str.split("=", 1)
            left_expr = parse_expr(left.strip())
            right_expr = parse_expr(right.strip())
            equation = left_expr - right_expr
        else:
            equation = parse_expr(eq_str)

        solution = solve(equation, x)
        latex_solutions = [latex(s) for s in solution]

        return {
            "solutions": [str(s) for s in solution],
            "latex": latex_solutions,
            "simplified": str(simplify(equation)),
        }
    except Exception as e:
        return {"error": str(e), "solutions": []}

def simplify_expression(expr_str: str) -> dict:
    """Simplify a mathematical expression"""
    try:
        expr_str = expr_str.replace("^", "**")
        expr = parse_expr(expr_str)
        simplified = simplify(expr)
        return {
            "original": expr_str,
            "simplified": str(simplified),
            "latex": latex(simplified),
        }
    except Exception as e:
        return {"error": str(e)}