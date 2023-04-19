import Dockerode from "dockerode";

type DockerOpts = {
    host: string;
    port: number;
};

export const Docker = ({ host, port }: DockerOpts) => {
    const dockerode = new Dockerode({ host, port });
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
