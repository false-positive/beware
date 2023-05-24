package main

import (
	"log"
	"net"

	"github.com/docker/docker/client"
	"github.com/false-positive/beware/packages/grpc/protos"
	"google.golang.org/grpc"
)


func main() {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		log.Fatalf("failed to create docker client: %v", err)
	}
	
	address := ":5001"
	lis, err := net.Listen("tcp", address)
	if err != nil {
		log.Fatalf("failed to listen on %s: %v", address, err)
	}
	log.Printf("listening on %s", address)

	grpcServer := grpc.NewServer()
	protos.RegisterMachineGatewayServer(grpcServer, &machineGateway{cli: cli})
	err = grpcServer.Serve(lis)
	if err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}