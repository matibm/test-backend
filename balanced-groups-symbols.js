function balancedGroupSymbols(expression) {
    const stack = [];
    const symbolPairs = {
        '(': ')',
        '[': ']',
        '{': '}'
    };

    for (let i = 0; i < expression.length; i++) {
        const currentSymbol = expression[i];
        
        if (currentSymbol === '(' || currentSymbol === '[' || currentSymbol === '{') {
            stack.push(currentSymbol);
        } else {
            
            if (stack.length === 0 || symbolPairs[stack.pop()] !== currentSymbol) {
                return false;
            }
        }
    }
   
    return stack.length === 0;
}
 
console.log(balancedGroupSymbols("[()]{}{()()}")); // Output: true
console.log(balancedGroupSymbols("[(])")); // Output: false
