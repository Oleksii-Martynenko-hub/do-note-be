const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

module.exports = () => {
    const envsJsonToDotEnv = (envs) => {
        let envsString = ``
    
        for (const key in envs) {
            if (Object.hasOwnProperty.call(envs, key)) {
                if(key[0] === "!") {
                    envsString += `${key.split('!')[1]}=${envs[key]}\n`;
                } else {
                    envsString += `${key}=${envs[key]}\n`;
                }
            }
        }

        return envsString;
    }

    const envsJsonToHeroku = (envs) => {
        let envsString = ''
    
        for (const key in envs) {
            if (Object.hasOwnProperty.call(envs, key)) {
                if(key[0] !== "!") {
                    envsString += ` ${key}='${envs[key]}'`;
                }
            }
        }
    
        exec(`heroku config:set${envsString}`,
            {
                shell: true,
            },
            function(err, stdout, stderr) {
                if (err) throw err;
                else console.log(stdout);
            },
        );

    }

    try {
        const envsJson = JSON.parse(fs.readFileSync(path.join(path.dirname(process.mainModule.filename), 'env.json'), 'utf8'));

        fs.writeFileSync('.env', envsJsonToDotEnv(envsJson));
        envsJsonToHeroku(envsJson)
    } catch (err) {
        console.error(err)
    }

}