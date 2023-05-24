package main

import (
	"context"
	"log"
	"strings"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/docker/errdefs"
)

const (
	DOCKER_CONTAINER_PREFIX = "DockerContainer:"
	DOCKER_TRAEFIK_NETWORK = "beware-traefik"
	WEBTOP_IMAGE = "lscr.io/linuxserver/webtop:arch-xfce-version-2023-03-31"
)

func isValidMachineId(machineId string) bool {
	return strings.HasPrefix(machineId, DOCKER_CONTAINER_PREFIX)
}

func createMachine(cli *client.Client, imageName, userCourseId string) (string, error) {
	id, err := runWebtopContainer(cli, imageName, "/"+userCourseId, "webtop-"+userCourseId, true)
	if err != nil {
		return "", err
	}
	return DOCKER_CONTAINER_PREFIX+id, nil
}

func sleepMachine(cli *client.Client, machineId string) error {
	if err := cli.ContainerStop(context.Background(), machineId[len(DOCKER_CONTAINER_PREFIX):], container.StopOptions{}); err != nil {
		return err
	}
	return nil
}

func wakeMachine(cli *client.Client, machineId string) error {
	if err := cli.ContainerStart(context.Background(), machineId[len(DOCKER_CONTAINER_PREFIX):], types.ContainerStartOptions{}); err != nil {
		return err
	}
	return nil
}

func removeMachine(cli *client.Client, machineId string) error {
	if err := cli.ContainerRemove(context.Background(), machineId[len(DOCKER_CONTAINER_PREFIX):], types.ContainerRemoveOptions{Force: true}); err != nil {
		return err
	}
	return nil
}

func runWebtopContainer(cli *client.Client, image, basePath, containerName string, recreateWhenExisting bool) (string, error) {
	cr, err := cli.ContainerCreate(context.Background(), &container.Config{
		Image: image,
		Env:  []string{"SUBFOLDER="+basePath+"/"},
		Labels: map[string]string{
			"traefik.http.routers."+containerName+".rule": "Path(`"+basePath+"`) || PathPrefix(`"+basePath+"/`)",
			"traefik.http.routers."+containerName+".middlewares": "auth",
			"traefik.http.services."+containerName+".loadbalancer.server.port": "3000",
		},
	}, nil, nil, nil, containerName);
	if err != nil {
		if errdefs.IsConflict(err) {
			// remove existing container
			if err := cli.ContainerRemove(context.Background(), containerName, types.ContainerRemoveOptions{Force: true}); err != nil {
				return "", err
			}
			if recreateWhenExisting {
				return runWebtopContainer(cli, image, basePath, containerName, false)
			} else {
				return "", err
			}
		} else {
			return "", err
		}
	}

	if err := cli.NetworkConnect(context.Background(), DOCKER_TRAEFIK_NETWORK, containerName, nil); err != nil {
		// remove created container
		if rmErr := cli.ContainerRemove(context.Background(), containerName, types.ContainerRemoveOptions{Force: true}); rmErr != nil {
			log.Println("Failed to remove container", containerName, rmErr, "after network connect error", err)
		}
		return "", err
	}

	if err := cli.ContainerStart(context.Background(), containerName, types.ContainerStartOptions{}); err != nil {
		// remove created container
		if rmErr := cli.ContainerRemove(context.Background(), containerName, types.ContainerRemoveOptions{Force: true}); rmErr != nil {
			log.Println("Failed to remove container", containerName, rmErr, "after network connect error", err)
		}
		return "", err
	}

	return cr.ID, nil
}