export function isBalanced(str) {
    const pairBrackets = {
        "(": ")",
        "{": "}",
        "[": "]"
    }
    const stack = [];

    for (let index = 0; index < str.length; index++) {
        if (str[index] in pairBrackets) {
            stack.push(str[index]);
        }
        else if (stack.length === 0 || pairBrackets[stack[stack.length - 1]] !== str[index]) {
            return false;
        }
        else {
            stack.pop();
        }
    }

    return stack.length === 0;
}