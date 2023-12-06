function snail(arr) {
    const result = [];

    while (arr.length) {
        result.push(...arr.shift());
 
        for (let i = 0; i < arr.length; i++) {
            result.push(arr[i].pop());
        }

        if (arr.length) {
            result.push(...arr.pop().reverse());
        }

        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i].length > 0) {
                result.push(arr[i].shift());
            }
        }
    }

    return result;
}

const array = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

console.log(snail(array)); // Output: [1,2,3,6,9,8,7,4,5]
