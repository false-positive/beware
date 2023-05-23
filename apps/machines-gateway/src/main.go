package main

import (
	"fmt"

	"github.com/docker/docker/client"
)


func main() {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		panic(err)
	}
	
	id, err := createMachine(cli, WEBTOP_IMAGE, "test")
	if err != nil {
		panic(err)
	}
	fmt.Println("Created", id)

	fmt.Scanln()

	err = sleepMachine(cli, id)
	if err != nil {
		panic(err)
	}
	fmt.Println("Sleeping", id)

	fmt.Scanln()
	
	err = wakeMachine(cli, id)
	if err != nil {
		panic(err)
	}
	fmt.Println("Waking", id)
	
	fmt.Scanln()

	err = removeMachine(cli, id)
	if err != nil {
		panic(err)
	}
}