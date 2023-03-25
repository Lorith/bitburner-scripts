import {servers, safePrompt} from "./libs/shard/free.js"

let debug = false
let show_conts = false
let check_servs = [...servers, "home"]
/** @param {NS} ns */
export async function main(ns) {
    ns.clearLog()
    ns.disableLog("ALL")
    ns.tail()
    debug = await safePrompt(ns,"Enable debug?")
    show_conts = await safePrompt(ns,"Show located contracts?")
    let cont_servs = []
    while(true){
    for (let serv of check_servs) {
        let ls = ns.ls(serv,".cct")
        if (ls != "") {
            if (debug) ns.print(`Found on ${serv}: ${ls}`)
            cont_servs.push(serv)
        }
    }String
    for (let serv of cont_servs) {    
        let conts = String(ns.ls(serv,".cct")).split(",")
        if (debug) ns.print(typeof(conts))
        for (let cont of conts) {
            let contType = ns.codingcontract.getContractType(cont,serv)
            let data = ns.codingcontract.getData(cont, serv)
            if (contType.includes(":") && !contType.includes("HammingCodes")) contType = contType.slice(0,contType.indexOf(":"))
            switch(contType + ""){
                default:
                    break
                case "Compression I":
                    ns.print(`Server ${serv} had a solvable contract of type ${contType}`)
                    ns.print(ns.codingcontract.attempt(compression1(ns,data),cont,serv))
                    break;
                case "Encryption I":
                    ns.print(`Server ${serv} had a solvable contract of type ${contType}`)
                    ns.print(ns.codingcontract.attempt(cipher1(ns,data),cont,serv))
                    break;
                case "Encryption II":
                    ns.print(`Server ${serv} had a solvable contract of type ${contType}`)
                    ns.print(ns.codingcontract.attempt(cipher2(ns,data),cont,serv))
                    break;
                case "Array Jumping Game":
                    //ns.print(`Server ${serv} had a solvable contract of type ${contType}`)
                    //ns.print(ns.codingcontract.attempt(arrayjump1(ns,data),cont,serv))
                    break;
            }
            if (debug || show_conts) ns.print(`Server ${serv} has: ${cont} of type: ${contType}`)
        }
    }
    if (debug) ns.print(`Contracts found on: ${cont_servs}!`)
    await ns.sleep(10*60*1000)
    }
    ns.exit();
    let test = await ns.prompt("Enter data", {type: "text"})
    ns.print(comp1(ns,test))
    // ns.codingcontract.createDummyContract(contractType)
    // ns.codingcontract.getContractType(filename, host)
    // ns.codingcontract.getData(filename, host)
    // ns.codingcontract.getDescription(filename, host)
    // ns.codingcontract.getNumTriesRemaining(filename, host)
    // ns.codingcontract.attempt(answer, filename, host)
//ns.codingcontract.createDummyContract("Compression I: RLE Compression")
}

/** Still need contract info:
 * "Spiralize Matrix"
 */

/* Find Largest Prime Factor
A prime factor is a factor that is a prime number. What is the largest prime factor of 37274972?
*/


/* Subarray with Maximum Sum
Given the following integer array, find the contiguous subarray (containing at least one number) which has the largest sum and return that sum. 'Sum' refers to the sum of all the numbers in the subarray.
-9,8,8,-5,-9,-5,-5,-2,-8,-8,8,2,1,-4,-2,1,-5,-7,-7,-4,2,-1,-4,5,8,-6,-4,-10,-6,5,6,4,-5,-8
*/

/* Total Ways to Sum
It is possible write four as a sum in exactly four different ways:

    3 + 1
    2 + 2
    2 + 1 + 1
    1 + 1 + 1 + 1

How many different distinct ways can the number 39 be written as a sum of at least two positive integers?
*/


/* Total Ways to Sum II
How many different distinct ways can the number 189 be written as a sum of integers contained in the set:

[2,3,5,7,8,9,10,11,12,13,14]?

You may use each integer in the set zero or more times.
*/


//  * "Spiralize Matrix"


/* "Array Jumping Game"
You are given the following array of integers:

4,0,0,8,2,2,4,0,9,3

Each element in the array represents your MAXIMUM jump length at that position. This means that if you are at position i and your maximum jump length is n, you can jump to any position from i to i+n.

Assuming you are initially positioned at the start of the array, determine whether you are able to reach the last index.

Your answer should be submitted as 1 or 0, representing true and false respectively
*/


/* Array Jumping Game II
You are given the following array of integers:

2,1,3,2,3,3

Each element in the array represents your MAXIMUM jump length at that position. This means that if you are at position i and your maximum jump length is n, you can jump to any position from i to i+n.

Assuming you are initially positioned at the start of the array, determine the minimum number of jumps to reach the end of the array.

If it's impossible to reach the end, then the answer should be 0.
*/


/* Merge Overlapping Intervals
Given the following array of arrays of numbers representing a list of intervals, merge all overlapping intervals.

[[18,21],[8,12],[7,15],[9,15],[21,30],[23,32],[11,12],[9,11],[20,22],[16,20],[16,26],[13,17],[22,28],[17,26],[7,14],[3,5],[18,27],[19,29],[20,28]]

Example:

[[1, 3], [8, 10], [2, 6], [10, 16]]

would merge into [[1, 6], [8, 16]].

The intervals must be returned in ASCENDING order. You can assume that in an interval, the first number will always be smaller than the second.
*/


/* Generate IP Addresses
Given the following string containing only digits, return an array with all possible valid IP address combinations that can be created from the string:

202132123169

Note that an octet cannot begin with a '0' unless the number itself is actually 0. For example, '192.168.010.1' is not a valid IP.
Examples:
25525511135 -> ["255.255.11.135", "255.255.111.35"]
1938718066 -> ["193.87.180.66"]
*/


/* Algorithmic Stock Trader I
You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:

54,188,83,179,168,93,121,199,53,145,178,139,92,174,46,64,5,170,195,106,40,177,3,9,129,20,22,87,116,3,105,33

Determine the maximum possible profit you can earn using at most one transaction (i.e. you can only buy and sell the stock once). If no profit can be made then the answer should be 0. Note that you have to buy the stock before you can sell it
*/


/* "Algorithmic Stock Trader II"
You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:

191,76,124,156,159,197,62,45,50,102,147,169

Determine the maximum possible profit you can earn using as many transactions as you'd like. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you buy it again.

If no profit can be made, then the answer should be 0
*/


/* Algorithmic Stock Trader III
You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:

199,152,39,130,171,178,169,52,15,107,37,129,132,136,152

Determine the maximum possible profit you can earn using at most two transactions. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you buy it again.

If no profit can be made, then the answer should be 0
*/


/* Algorithmic Stock Trader IV
You are given the following array with two elements:

[8, [28,35,101,103,41,35]]

The first element is an integer k. The second element is an array of stock prices (which are numbers) where the i-th element represents the stock price on day i.

Determine the maximum possible profit you can earn using at most k transactions. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you can buy it again.

If no profit can be made, then the answer should be 0.
*/


/* Minimum Path Sum in a Triangle
Given a triangle, find the minimum path sum from top to bottom. In each step of the path, you may only move to adjacent numbers in the row below. The triangle is represented as a 2D array of numbers:

[
       [3],
      [1,7],
     [8,3,8],
    [7,1,6,9],
   [2,2,9,4,8],
  [5,6,9,9,2,8]
]

Example: If you are given the following triangle:

[
     [2],
    [3,4],
   [6,5,7],
  [4,1,8,3]
]

The minimum path sum is 11 (2 -> 3 -> 5 -> 1).
*/


/* Unique Paths in a Grid I
You are in a grid with 9 rows and 13 columns, and you are positioned in the top-left corner of that grid. You are trying to reach the bottom-right corner of the grid, but you can only move down or right on each step. Determine how many unique paths there are from start to finish.

NOTE: The data returned for this contract is an array with the number of rows and columns:

[9, 13]
*/


/* Unique Paths in a Grid II
You are located in the top-left corner of the following grid:

0,0,
0,0,
0,0,
0,0,
0,0,
1,0,
0,0,
0,0,

You are trying reach the bottom-right corner of the grid, but you can only move down or right on each step. Furthermore, there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.

Determine how many unique paths there are from start to finish.

NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
*/


/* Shortest Path in a Grid
You are located in the top-left corner of the following grid:

  [[0,0,1,0,1,1,1,0,1],
   [0,0,0,1,0,0,0,0,0],
   [0,1,0,0,1,0,0,0,0],
   [1,0,0,1,0,0,0,0,0],
   [0,0,0,1,1,0,0,1,1],
   [1,0,1,1,1,0,0,0,0],
   [0,0,0,1,1,0,0,0,0]]

You are trying to find the shortest path to the bottom-right corner of the grid, but there are obstacles on the grid that you cannot move onto. These obstacles are denoted by '1', while empty spaces are denoted by 0.

Determine the shortest path from start to finish, if one exists. The answer should be given as a string of UDLR characters, indicating the moves along the path

NOTE: If there are multiple equally short paths, any of them is accepted as answer. If there is no path, the answer should be an empty string.
NOTE: The data returned for this contract is an 2D array of numbers representing the grid.

Examples:

    [[0,1,0,0,0],
     [0,0,0,1,0]]

Answer: 'DRRURRD'

    [[0,1],
     [1,0]]

Answer: ''
*/


/* Sanitize Parentheses in Expression
Given the following string:

(a)))a)(a)((()a((

remove the minimum number of invalid parentheses in order to validate the string. If there are multiple minimal ways to validate the string, provide all of the possible results. The answer should be provided as an array of strings. If it is impossible to validate the string the result should be an array with only an empty string.

IMPORTANT: The string may contain letters, not just parentheses. Examples:
"()())()" -> [()()(), (())()]
"(a)())()" -> [(a)()(), (a())()]
")(" -> [""]
*/


/* Find All Valid Math Expressions
You are given the following string which contains only digits between 0 and 9:

91583067272

You are also given a target number of -55. Return all possible ways you can add the +(add), -(subtract), and *(multiply) operators to the string such that it evaluates to the target number. (Normal order of operations applies.)

The provided answer should be an array of strings containing the valid expressions. The data provided by this problem is an array with two elements. The first element is the string of digits, while the second element is the target number:

["91583067272", -55]

NOTE: The order of evaluation expects script operator precedence NOTE: Numbers in the expression cannot have leading 0's. In other words, "1+01" is not a valid expression Examples:

Input: digits = "123", target = 6
Output: [1+2+3, 1*2*3]

Input: digits = "105", target = 5
Output: [1*0+5, 10-5]
*/


/* HammingCodes: Integer to Encoded Binary
You are given the following decimal Value:
665210039452
Convert it to a binary representation and encode it as an 'extended Hamming code'. Eg:
Value 8 is expressed in binary as '1000', which will be encoded with the pattern 'pppdpddd', where p is a parity bit and d a data bit. The encoding of
8 is 11110000. As another example, '10101' (Value 21) will result into (pppdpdddpd) '1001101011'.
The answer should be given as a string containing only 1s and 0s.
NOTE: the endianness of the data bits is reversed in relation to the endianness of the parity bits.
NOTE: The bit at index zero is the overall parity bit, this should be set last.
NOTE 2: You should watch the Hamming Code video from 3Blue1Brown, which explains the 'rule' of encoding, including the first index parity bit mentioned in the previous note.

Extra rule for encoding:
There should be no leading zeros in the 'data bit' section
*/


/* HammingCodes: Encoded Binary to Integer
You are given the following encoded binary string:
'10000011111101110000011100010101'

Treat it as an extended Hamming code with 1 'possible' error at a random index.
Find the 'possible' wrong bit, fix it and extract the decimal value, which is hidden inside the string.

Note: The length of the binary string is dynamic, but its encoding/decoding follows Hamming's 'rule'
Note 2: Index 0 is an 'overall' parity bit. Watch the Hamming code video from 3Blue1Brown for more information
Note 3: There's a ~55% chance for an altered Bit. So... MAYBE there is an altered Bit 😉
Note: The endianness of the encoded decimal value is reversed in relation to the endianness of the Hamming code. Where the Hamming code is expressed as little-endian (LSB at index 0), the decimal value encoded in it is expressed as big-endian (MSB at index 0).
Extra note for automation: return the decimal value as a string
*/


/* Proper 2-Coloring of a Graph
You are given the following data, representing a graph:
[10,[[0,7],[1,3],[2,3],[8,9],[0,6],[0,6],[0,2],[5,8],[3,4],[6,8],[4,8],[0,9]]]
Note that "graph", as used here, refers to the field of graph theory, and has no relation to statistics or plotting. The first element of the data represents the number of vertices in the graph. Each vertex is a unique number between 0 and 9. The next element of the data represents the edges of the graph. Two vertices u,v in a graph are said to be adjacent if there exists an edge [u,v]. Note that an edge [u,v] is the same as an edge [v,u], as order does not matter. You must construct a 2-coloring of the graph, meaning that you have to assign each vertex in the graph a "color", either 0 or 1, such that no two adjacent vertices have the same color. Submit your answer in the form of an array, where element i represents the color of vertex i. If it is impossible to construct a 2-coloring of the given graph, instead submit an empty array.

Examples:

Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
Output: [0, 0, 1, 1]

Input: [3, [[0, 1], [0, 2], [1, 2]]]
Output: []
*/


//  * "Compression I: RLE Compression"
/** @param {NS} ns */
function compression1(ns,data){

    let num = 0
    let char = ""
    let lastchar = data[0]
    let retval = ""
    if (debug) ns.print("Inside comp1")
    let i = 0
    while (i <= data.length) {
        char = data[i]
        if (debug) ns.print("data["+i+"]: "+data[i])
        i++
        if (char === lastchar && num < 9) {
            num ++
        } else {
            retval += (num+lastchar)
            num = 1
            lastchar = char
        } if (debug) ns.print(retval)
    }
    return retval
}


/* Compression II: LZ Decompression
Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to earlier parts of the data. In this variant of LZ, data is encoded in two types of chunk. Each chunk begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data, which is either:

1. Exactly L characters, which are to be copied directly into the uncompressed data.
2. A reference to an earlier part of the uncompressed data. To do this, the length is followed by a second ASCII digit X: each of the L output characters is a copy of the character X places before it in the uncompressed data.

For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character is the start of a new chunk. The two chunk types alternate, starting with type 1, and the final chunk may be of either type.

You are given the following LZ-encoded string:
    3rw7129u3pWEnfEg214NGHP6994N4NdHvj707otYN1J6413X6T813CUj53
Decode it and output the original string.

Example: decoding '5aaabb450723abb' chunk-by-chunk
    5aaabb           ->  aaabb
    5aaabb45         ->  aaabbaaab
    5aaabb450        ->  aaabbaaab
    5aaabb45072      ->  aaabbaaababababa
    5aaabb450723abb  ->  aaabbaaababababaabb
*/


/* "Compression III: LZ Compression"
Compression III: LZ Compression
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to earlier parts of the data. In this variant of LZ, data is encoded in two types of chunk. Each chunk begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data, which is either:

1. Exactly L characters, which are to be copied directly into the uncompressed data.
2. A reference to an earlier part of the uncompressed data. To do this, the length is followed by a second ASCII digit X: each of the L output characters is a copy of the character X places before it in the uncompressed data.

For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character is the start of a new chunk. The two chunk types alternate, starting with type 1, and the final chunk may be of either type.

You are given the following input string:
    iqiqiiqiqiiqiqSqi8eJ1G1KTqW6666666666ITB6666ITjrTjrT5UqjrTjkTjkrTjkTTT1rkTTT1rrFk3j0ao
Encode it using Lempel-Ziv encoding with the minimum possible output length.

Examples (some have other possible encodings of minimal length):
    abracadabra     ->  7abracad47
    mississippi     ->  4miss433ppi
    aAAaAAaAaAA     ->  3aAA53035
    2718281828      ->  627182844
    abcdefghijk     ->  9abcdefghi02jk
    aaaaaaaaaaaa    ->  3aaa91
    aaaaaaaaaaaaa   ->  1a91031
    aaaaaaaaaaaaaa  ->  1a91041
*/
/** @param {NS} ns */

/*Encryption I: Caesar CipherCaesar cipher is one of the simplest encryption technique. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet. For example, with a left shift of 3, D would be replaced by A, E would become B, and A would become X (because of rotation).

You are given an array with two elements:
  ["TABLE EMAIL DEBUG MEDIA POPUP", 20]
The first element is the plaintext, the second element is the left shift value.

Return the ciphertext as uppercase string. Spaces remains the same.*/
//  * "Encryption I: Caesar Cipher"
/** @param {NS} ns */
function cipher1(ns, data){
    const text = data[0]
    let shift = data[1]
    let retval = ""
    const letters = [
    "A","B","C","D","E",
    "F","G","H","I","J",
    "K","L","M","N","O",
    "P","Q","R","S","T",
    "U","V","W","X","Y",
    "Z"]
    for (let i of text){
        if (i == " "){retval += " "; continue}
        let result = letters.indexOf(i)-shift
        if (result < 0) result += 26
        retval += letters[result]
    }
    return retval
}

// Encryption II: Vigenère Cipher
/** @param {NS} ns */
function cipher2(ns,data){
    const text = data[0]
    let key = data[1]
    let retval = ""
    const letters = [
    "A","B","C","D","E",
    "F","G","H","I","J",
    "K","L","M","N","O",
    "P","Q","R","S","T",
    "U","V","W","X","Y",
    "Z"]
    let i = 0
    while (key.length < text.length){
        key += key[i]
        i++
    }
    if (debug)ns.print(`text: ${text}\nkey : ${key}`)
    for (let x in text) {
        const a = letters.indexOf(text[x])
        const b = letters.indexOf(key[x])
        let dif = a + b
        if (dif > 25) dif -= 26
        retval += letters[dif]
        if (debug)ns.print(`${x}:${text[x]}>${key[x]}=>${dif}>${letters[dif]}`)
    }
    return retval
}