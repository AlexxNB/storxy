const { test } = require('uvu');
const {snapshot} = require('uvu/assert');
const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const DIR = 'test'

fs.readdirSync(DIR).sort((a,b)=>Number(a.split('_')[0])-Number(b.split('_')[0])).forEach(file => {
    if(file !== 'index.js' && !file.startsWith('_') && file.endsWith('.js')){
        const name = file.replace(/\.js$/,'')
        const ssFile = path.join(DIR,'snapshots', name+'.snapshot');

        let expected = null;

        if(!fs.existsSync(ssFile)) {
            console.log(`WARNING ${file}: No snapshot file, will be created with current output, please check!`);
        }else{
            expected = fs.readFileSync(ssFile,'utf-8');
        }

        const {stderr,stdout} = spawnSync(`node`,[`./${file}`],{cwd:DIR});
        const actual = stdout.toString('utf-8').trim();

        if(stderr.length > 0) 
            console.log(`ERROR ${file}:`, stderr.toString('utf-8'));
        else if(expected === null){
           fs.writeFileSync(ssFile,actual);
           console.log(`--- Created snapshot for ${name} ---`);
           console.log(actual);
           console.log(`--- End snapshot for ${name} ---`);
           expected = actual;
        }

        test(file, () => {
            snapshot(actual, expected);
        });
        
    }
});

test.run();