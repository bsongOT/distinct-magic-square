const fs = require("fs");

const str = JSON.parse(fs.readFileSync("korean.json", 'utf8')).map(wi => wi["-가"]).join("\n");
const opendictArr = getOpendictArray();
const arr = [...new Set([...str
    .split("\n")
        .filter(w => !w.startsWith("-") && !w.endsWith("-"))
        .map(w => w.replaceAll("-", "").replaceAll("^", "").replaceAll(" ", ""))
        .filter(w => 
            w[0] !== w[1] && w[0] !== w[2] && w[0] !== w[3] &&
            w[1] !== w[2] && w[1] !== w[3] && w[2] !== w[3]
        )
        .filter(w => w.split("")
            .every(ws => 
                ws.charCodeAt(0) >= '가'.charCodeAt(0) && 
                ws.charCodeAt(0) <= '힣'.charCodeAt(0)
            )
        )
        .filter(w => w.length === 4),
    ...opendictArr
        .filter(w => !w.startsWith("-") && !w.endsWith("-"))
        .map(w => w.replaceAll("-", "").replaceAll("^", "").replaceAll(" ", ""))
        .filter(w => 
            w[0] !== w[1] && w[0] !== w[2] && w[0] !== w[3] &&
            w[1] !== w[2] && w[1] !== w[3] && w[2] !== w[3]
        )
        .filter(w => w.split("")
            .every(ws => 
                ws.charCodeAt(0) >= '가'.charCodeAt(0) && 
                ws.charCodeAt(0) <= '힣'.charCodeAt(0)
            )
        )
        .filter(w => w.length === 4)
    ])]
    .sort();

function getOpendictArray(){
    const dir = fs.readdirSync("opendict");
    const arr = [];

    for (const path of dir.map(fn => `opendict/${fn}`)){
        const str = fs.readFileSync(path, 'utf8');
        const json = JSON.parse(str);
        arr.push(...json.channel.item.map(i => i.wordinfo.word))
    }

    return arr;
}

fs.writeFileSync("dict-4-no-dup2.txt", arr.join("\n"));