const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const readline = require('readline')

let occurrences = 0

async function walk(ext, word, root){
    try{
        const list = await fsp.readdir(root)
        
        list.forEach(async entry => {
            const fullPath = path.join(root, entry)
            const stat = await fsp.stat(fullPath)
            
            if(stat.isDirectory(fullPath)){
                walk(ext, word, fullPath)
            }else if(stat.isFile() && entry.endsWith(`.${ext}`)){
                read(fullPath, word)
            }
        })
    }catch(e){
        console.error(e)
    }
}

function read(filepath, word){
    let lineNumber = 0
    readline.createInterface({
        input: fs.createReadStream(filepath),
        crlfDelay: Infinity
    }).on('line', line => search(line, filepath, lineNumber++, word))
}

function search(line, filepath, lineNumber, word){
    let fromIndex = 0
    while(true){
        const pos = line.indexOf(word, fromIndex)
        if(pos === -1) break
        fromIndex = pos + word.length
        print(filepath, lineNumber, pos)
        ++occurrences
    }
}

function print(filepath, lineNumber, position){
    console.log(`path: ${filepath}, line: ${lineNumber}, column: ${position}`)
}

exports.start = (ext, word, root) => walk(ext, word, root)
exports.occurrences = () => occurrences