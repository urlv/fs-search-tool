const search = require('./lib/search')

function main(args){
    if (args.length !== 5){
        console.error('You need to enter 3 arguments:\n' +
                      '1. file extension\n' +
                      '2. text to search\n' +
                      '3. starting path')
    }else{
        search.start(args[2], args[3], args[4])
        process.on('beforeExit', () => {
            if(search.occurrences() === 0) console.log('No file was found')
        })
    }
}

main(process.argv)
