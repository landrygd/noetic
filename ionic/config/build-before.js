const fs = require('fs');

module.exports = (ctx) => {

    if (ctx.build && ctx.build.configuration && ctx.build.configuration === "production") {

        console.log("production build: performing version bump...");

        // update package.json:
        let packageJSON = JSON.parse(fs.readFileSync('package.json', 'utf-8').toString());
        let versionArray = packageJSON.version.split(".");
        versionArray[2] = (parseInt(versionArray[2])+1).toString();
        packageJSON.version = versionArray.join(".");
        fs.writeFileSync('package.json', JSON.stringify(packageJSON, null, "\t"), 'utf-8');
        console.log("package.json app version updated");

        let prodEnvData = fs.readFileSync(`src/environments/environment.prod.ts`, 'utf-8');
        prodEnvData = prodEnvData.replace(/CURRENT_VERSION: ".*"/, `CURRENT_VERSION: "${packageJSON.version}"`);
        fs.writeFileSync('src/environments/environment.prod.ts', prodEnvData, 'utf-8');
        console.log("environments.prod.ts app version updated");

        let devEnvData = fs.readFileSync(`src/environments/environment.dev.ts`, 'utf-8');
        devEnvData = devEnvData.replace(/CURRENT_VERSION: ".*"/, `CURRENT_VERSION: "${packageJSON.version}"`);
        fs.writeFileSync('src/environments/environment.dev.ts', devEnvData, 'utf-8');
        console.log("environments.dev.ts app version updated");

        let localEnvData = fs.readFileSync(`src/environments/environment.local.ts`, 'utf-8');
        localEnvData = localEnvData.replace(/CURRENT_VERSION: ".*"/, `CURRENT_VERSION: "${packageJSON.version}"`);
        fs.writeFileSync('src/environments/environment.local.ts', localEnvData, 'utf-8');
        console.log("environments.local.ts app version updated");

        let defaultEnvData = fs.readFileSync(`src/environments/environment.ts`, 'utf-8');
        defaultEnvData = defaultEnvData.replace(/CURRENT_VERSION: ".*"/, `CURRENT_VERSION: "${packageJSON.version}"`);
        fs.writeFileSync('src/environments/environment.ts', defaultEnvData, 'utf-8');
        console.log("environments.ts app version updated");

        let configXmlData = fs.readFileSync('config.xml', 'utf-8');
        configXmlData = configXmlData.replace(/id="com.yourapp.ionic" version=".*"/, `id="com.yourapp.ionic" version="${packageJSON.version}"`);
        fs.writeFileSync('config.xml', configXmlData,'utf-8');
        console.log("config.xml app version updated");

    };

};