const { exec } = require("node:child_process");

export const defaultOptions = {
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

function fakeDockerString(options) {
    return "python -m http.server ${options.webPort}";
}

const createDockerContainerFactory = (cmdFunction) => (options) => {
    return new Promise((resolve, reject) =>
        exec(cmdFunction(options), (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }
            resolve(stdout);
        }),
    );
};

export function createDockerContainer(options) {
    // HACK: made to test in bozhidar's computer
    if (process.env.USER !== "bozhidar") {
        return createDockerContainerFactory(dockerString)(options);
    } else {
        return createDockerContainerFactory(fakeDockerString)(options);
    }
}
