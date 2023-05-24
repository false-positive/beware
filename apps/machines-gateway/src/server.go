package main

import (
	"context"
	"log"

	"github.com/docker/docker/client"
	"github.com/docker/docker/errdefs"
	"github.com/false-positive/beware/packages/grpc/protos"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"
)

type machineGateway struct {
	protos.UnimplementedMachineGatewayServer
	cli *client.Client
}

func (m *machineGateway) CreateMachine(ctx context.Context, req *protos.CreateMachineRequest) (*protos.Machine, error) {
	if req.CourseId == "" {
		return nil, status.Error(codes.InvalidArgument, "course id is required")
	}
	if req.UserCourseId == "" {
		return nil, status.Error(codes.InvalidArgument, "user course id is required")
	}
	id, err := createMachine(m.cli, req.CourseId, req.UserCourseId)
	if err != nil {
		if errdefs.IsNotFound(err) {
			return nil, status.Error(codes.NotFound, "course not found")
		}
		// TODO: show error in dev
		log.Printf("failed to create machine: %v", err)
		return nil, status.Error(codes.Internal, "failed to create machine")
	}
	return &protos.Machine{
		Id: id,
	}, nil
}

func (m *machineGateway) SleepMachine(ctx context.Context, req *protos.Machine) (*emptypb.Empty, error) {
	if !isValidMachineId(req.Id) {
		return nil, status.Error(codes.InvalidArgument, "invalid machine id")
	}
	err := sleepMachine(m.cli, req.Id)
	if err != nil {
		if errdefs.IsNotFound(err) {
			return nil, status.Error(codes.NotFound, "machine not found")
		}
		// TODO: show error in dev
		log.Printf("failed to sleep machine: %v", err)
		return nil, status.Error(codes.Internal, "failed to sleep machine")
	}
	return &emptypb.Empty{}, nil
}

func (m *machineGateway) WakeMachine(ctx context.Context, req *protos.Machine) (*emptypb.Empty, error) {
	if !isValidMachineId(req.Id) {
		return nil, status.Error(codes.InvalidArgument, "invalid machine id")
	}
	err := wakeMachine(m.cli, req.Id)
	if err != nil {
		if errdefs.IsNotFound(err) {
			return nil, status.Error(codes.NotFound, "machine not found")
		}
		// TODO: show error in dev
		log.Printf("failed to wake machine: %v", err)
		return nil, status.Error(codes.Internal, "failed to wake machine")
	}
	return &emptypb.Empty{}, nil
}

func (m *machineGateway) RemoveMachine(ctx context.Context, req *protos.Machine) (*emptypb.Empty, error) {
	if !isValidMachineId(req.Id) {
		return nil, status.Error(codes.InvalidArgument, "invalid machine id")
	}
	err := removeMachine(m.cli, req.Id)
	if err != nil {
		if errdefs.IsNotFound(err) {
			return nil, status.Error(codes.NotFound, "machine not found")
		}
		// TODO: show error in dev
		log.Printf("failed to remove machine: %v", err)
		return nil, status.Error(codes.Internal, "failed to remove machine")
	}
	return &emptypb.Empty{}, nil
}
