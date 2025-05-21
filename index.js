const fs = require("fs");
const kwords_no_redundancy_4 = fs.readFileSync("dict-4-no-dup2.txt", "utf8").split("\n");
let magicSquare = new Array(16).fill("");
let dict = {};
let str = "";

// const letters = kwords_no_redundancy_4.map(w => w.split("")).flat();
// const letterDict = {};
// for (let i = 0; i < letters.length; i++){
//     if (!letterDict[letters[i]]) letterDict[letters[i]] = 0;
//     letterDict[letters[i]]++;
// }
// console.log(Object.entries(letterDict).sort((a, b) => b[1] - a[1]))

for (let word of kwords_no_redundancy_4){
    const word0to1 = word[0] + word[1];
    const word0to2 = word0to1 + word[2];
    if (!dict[word[0]]){
        dict[word[0]] = [word];
    }
    else {
        dict[word[0]].push(word);
    }
    if (!dict[word0to1]){
        dict[word0to1] = [word];
    }
    else {
        dict[word0to1].push(word)
    }
    if (!dict[word0to2]){
        dict[word0to2] = [word];
    }
    else {
        dict[word0to2].push(word);
    }
    dict[word] = [word];
}
console.log(Object.entries(dict).sort((a, b) => b[1].length - a[1].length).map(e => [e[0], e[1].length]))

let localIndex = 0;
for (let i = 0; i < kwords_no_redundancy_4.length; i++){
    magicSquare = new Array(16).fill("");
    magicSquare[0] = kwords_no_redundancy_4[i][0];
    magicSquare[1] = kwords_no_redundancy_4[i][1];
    magicSquare[2] = kwords_no_redundancy_4[i][2];
    magicSquare[3] = kwords_no_redundancy_4[i][3];
    localIndex = kwords_no_redundancy_4[i][0] === kwords_no_redundancy_4[i - 1]?.[0] ? (localIndex + 1) : 0;
    
    const col1Dict = dict[magicSquare[0]];
    if (i % 100 === 0) console.log(`${i}/${kwords_no_redundancy_4.length}, ${localIndex}/${col1Dict.length}`);
    for (let j = localIndex + 1; j < col1Dict.length; j++){
        const col1 = col1Dict[j];
        magicSquare = magicSquare.map((v, i) => i <= 3 ? v : "");

        if (magicSquare.includes(col1[1])) continue;
        if (magicSquare.includes(col1[2])) continue;
        if (magicSquare.includes(col1[3])) continue;
        if (!dict[magicSquare[1]]) continue;
        if (!dict[magicSquare[2]]) continue;
        if (!dict[magicSquare[3]]) continue;

        magicSquare[4] = col1[1];
        magicSquare[8] = col1[2];
        magicSquare[12] = col1[3];
        for (const col2 of dict[magicSquare[1]]){
            magicSquare = magicSquare.map((v, i) => (i <= 3 || i % 4 === 0) ? v : "");

            if (magicSquare.includes(col2[1])) continue;
            if (magicSquare.includes(col2[2])) continue;
            if (magicSquare.includes(col2[3])) continue;
            if (!dict[col1[1] + col2[1]]) continue;
            if (!dict[col1[2] + col2[2]]) continue;
            if (!dict[col1[3] + col2[3]]) continue;
            magicSquare[5] = col2[1];
            magicSquare[9] = col2[2];
            magicSquare[13] = col2[3];
            for (const row2 of dict[magicSquare[4] + magicSquare[5]]){
                magicSquare = magicSquare.map((v, i) => (i <= 3 || i % 4 <= 1) ? v : "");

                if (magicSquare.includes(row2[2])) continue;
                if (magicSquare.includes(row2[3])) continue;
                if (!dict[magicSquare[2] + row2[2]]) continue;
                if (!dict[magicSquare[3] + row2[3]]) continue;

                magicSquare[6] = row2[2];
                magicSquare[7] = row2[3];
                
                for (const col3 of dict[magicSquare[2] + magicSquare[6]]){
                    magicSquare = magicSquare.map((v, i) => (i <= 7 || i % 4 <= 1) ? v : "");

                    if (magicSquare.includes(col3[2])) continue;
                    if (magicSquare.includes(col3[3])) continue;
                    if (!dict[col1[2] + col2[2] + col3[2]]) continue;
                    if (!dict[col1[3] + col2[3] + col3[3]]) continue;
                    
                    magicSquare[10] = col3[2];
                    magicSquare[14] = col3[3];

                    for (const row3 of dict[magicSquare[8] + magicSquare[9] + magicSquare[10]]){
                        magicSquare[11] = "";
                        magicSquare[15] = "";
                        if (magicSquare.includes(row3[3])) continue;
                        if (dict[magicSquare[3] + magicSquare[7] + row3[3]] === undefined) continue;
                        
                        magicSquare[11] = row3[3];
                        
                        for (const row4 of dict[magicSquare[12] + magicSquare[13] + magicSquare[14]]){
                            magicSquare[15] = "";
                            if (magicSquare.includes(row4[3])) continue;
                            if (dict[magicSquare[3] + magicSquare[7] + magicSquare[11] + row4[3]] === undefined) continue;
                            magicSquare[15] = row4[3];
                            const sq =
                                magicSquare.slice(0, 4).join("") + "\n" + 
                                magicSquare.slice(4, 8).join("") + "\n" + 
                                magicSquare.slice(8, 12).join("") + "\n" + 
                                magicSquare.slice(12).join("") + "\n\n"
                            
                            str += sq;
                            console.log(sq);
                        }
                    }
                }
            }
        }
    }
}

fs.writeFileSync("result_opendict.txt", str);