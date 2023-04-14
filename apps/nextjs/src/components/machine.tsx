import { forwardRef, useRef, useState, type ReactElement } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { api } from "~/utils/api";

export const useCreateMachine = (
    { isReset }: { isReset: boolean } = { isReset: true },
) => {
    const utils = api.useContext();
    return api.machine.create.useMutation({
        onMutate() {
            const loadingToast = toast("creating machine...", {
                isLoading: true,
            });
            return { loadingToast };
        },
        onSuccess(data, _variables, ctx) {
            if (ctx) {
                toast.done(ctx.loadingToast);
            }
            toast(
                isReset ? "ookay, created machine" : "reset machine, all good",
            );
            // TODO: update now instead of after refetch?
            void utils.course.byId.invalidate({ id: data.courseId });
        },
        onError() {
            toast("error creating machine, oopsies");
        },
        onSettled(_data, _err, _variables, ctx) {
            if (ctx) {
                toast.done(ctx.loadingToast);
            }
        },
    });
};

export const useDeleteMachine = () => {
    const utils = api.useContext();
    return api.machine.delete.useMutation({
        onMutate() {
            const loadingToast = toast("deleting machine...", {
                isLoading: true,
            });
            return { loadingToast };
        },
        onSuccess(data) {
            toast("deleted machine, byebye");
            // TODO: update now instead of after refetch?
            void utils.course.byId.invalidate({ id: data.courseId });
        },
        onError() {
            toast("error deleting machine, oopsies");
        },
        onSettled(_data, _err, _variables, ctx) {
            if (ctx) {
                toast.done(ctx.loadingToast);
            }
        },
    });
};

export const useReloadMachineFrame = () => {
    const simulationFrameFrameRef = useRef<HTMLIFrameElement>(null);

    return {
        reloadMachineFrame: () => {
            const iframe = simulationFrameFrameRef.current;
            if (iframe) {
                iframe.src = iframe.src;
            }
        },
        simulationFrameFrameRef,
    };
};

/**
 * Checks if the machine is accessible from the web.
 *
 * If the machine is connected, this means that it is safe to load the machine's url in an iframe.
 *
 * This is done by checking if the machine's css/fullscreen.svg is accessible.
 * It's impossible to do this with a simple fetch, because of CORS.
 *
 * @param machineUrl the url of the machine, returned by the courses api
 * @returns a promise that resolves to true if the machine is connected, false otherwise
 */
const isMachineWebConnected = (machineUrl: string) =>
    new Promise<boolean>((resolve) => {
        const img = new Image();
        img.src = `${machineUrl}/css/fullscreen.svg?${Date.now()}`;
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
    });

export const SimulationFrame = forwardRef<
    HTMLIFrameElement,
    {
        machineUrl: string;
        className?: string;
        connectingComponent: ReactElement;
        disconnectedComponent: ReactElement;
    }
>(
    (
        { machineUrl, className, connectingComponent, disconnectedComponent },
        ref,
    ) => {
        const [machineHasConnected, setMachineHasConnected] = useState(false);
        const { data: isConnected } = useQuery({
            queryKey: ["isMachineWebConnected", machineUrl],
            queryFn: () => isMachineWebConnected(machineUrl),
            initialData: false,
            onSuccess(isConnected) {
                if (isConnected && !machineHasConnected) {
                    setMachineHasConnected(true);
                }
            },
            refetchInterval(isAvailable) {
                return !isAvailable ? 1000 : 1000 * 60;
            },
            cacheTime: 0,
            // TODO: *only* if machine disconnects, invalidate the `byId` query, because the url might have changed
        });

        if (!isConnected) {
            return machineHasConnected
                ? disconnectedComponent
                : connectingComponent;
        }
        return (
            <iframe
                ref={ref}
                src={machineUrl}
                allowFullScreen={true}
                className={className}
            ></iframe>
        );
    },
);
SimulationFrame.displayName = "SimulationFrame";
