import { exec } from "node:child_process";

export const defaultOptions = {
    name: "webtop-test",
    webPort: "5000",
    puid: "1000",
    pgid: "1000",
    timezone: "Europe/Sofia",
    appdata: "/mnt/user/appdata/webtop-test",
};

export type Options = typeof defaultOptions;

function dockerString(options: Options) {
    return `docker run -d --name ${options.name} -p ${options.webPort}:3000 -e PUID=${options.puid} -e PGID=${options.pgid} -e TZ=${options.timezone} -v ${options.appdata}/config:/config -v ${options.appdata}/data:/data -v ${options.appdata}/logs:/logs --restart unless-stopped linuxserver/webtop`;
}

function fakeDockerString(options: Options) {
    const { pid } = exec("python -m http.server ${options.webPort}");
    return `echo ${pid}`;
}

const createDockerContainerFactory =
    (cmdFunction: (options: Options) => string) => (options: Options) => {
        return new Promise((resolve, reject) =>
            exec(cmdFunction(options), (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                }
                resolve(stdout);
            }),
        );
    };

export function createDockerContainer(options: Options) {
    // HACK: made to test in bozhidar's computer
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    if (process.env.USER !== "bozhidar") {
        return createDockerContainerFactory(dockerString)(options);
    } else {
        return createDockerContainerFactory(fakeDockerString)(options);
    }
}
