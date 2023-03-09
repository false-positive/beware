const { exec } = require("node:child_process");

export const defaultOptions = {
    name: "webtop-test",
    webPort: "5000",
    puid: "1000",
    pgid: "1000",
    timezone: "Europe/Sofia",
    appdata: "/mnt/user/appdata/webtop-test",
};

// @ts-ignore
function dockerString(options) {
    return `docker run -d --name ${options.name} -p ${options.webPort}:3000 -e PUID=${options.puid} -e PGID=${options.pgid} -e TZ=${options.timezone} -v ${options.appdata}/config:/config -v ${options.appdata}/data:/data -v ${options.appdata}/logs:/logs --restart unless-stopped linuxserver/webtop`;
}

// @ts-ignore
export function createDockerContainer(options) {
    exec(dockerString(options), (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}
