const { exec } = require("node:child_process");

const options = {
    name: "webtop-test",
    webPort: "5000",
    puid: "1000",
    pgid: "1000",
    timezone: "Europe/Sofia",
    appdata: "/mnt/user/appdata/webtop-test",
};

function dockerString(options) {
    return `docker run -d --name ${options.name} -p ${options.webPort}:3000 -e PUID=${options.puid} -e PGID=${options.pgid} -e TZ=${options.timezone} -v ${options.appdata}/config:/config -v ${options.appdata}/data:/data -v ${options.appdata}/logs:/logs --restart unless-stopped linuxserver/webtop`;
}

export function createDockerContainer(options) {
    return new Promise((resolve, reject) =>
        exec(dockerString(options), (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }
            resolve(stdout);
        }),
    );
}
