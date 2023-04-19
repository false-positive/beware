import { type ConstructorOptions } from "docker-modem";
import Dockerode from "dockerode";

type DockerOpts = {
    host: string;
    port: number;
};

export const Docker = ({ host, port }: DockerOpts) => {
    const dockerode = new Dockerode({
        protocol: "ssh",
        host,
        port,
        username: "bw-machines-agent",

        // @ts-expect-error - sshOptions is not in the types
        sshOptions: {
            privateKey: process.env.MACHINE_SSH_PRIVATE_KEY as string,
        } as ConstructorOptions["sshOptions"],
    });
    return {
        container: {
            create: dockerode.createContainer.bind(dockerode),
            get: dockerode.getContainer.bind(dockerode),
        },
        network: {
            get: dockerode.getNetwork.bind(dockerode),
        },
        dockerode,
    };
};
