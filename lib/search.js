const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const readline = require('readline')

let occurrences = 0

async function walk(ext, word, root){
    try{
        const list = await fsp.readdir(root, {withFileTypes: true})
        
        list.forEach(async dirent => {
            const fullpath = path.join(root, dirent.name)

            if(dirent.isDirectory()){
                walk(ext, word, fullpath)
            }else if(dirent.isFile() && fullpath.endsWith(`.${ext}`)){
                read(fullpath, word)
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
    // nodejs does not optimize tail recursion
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