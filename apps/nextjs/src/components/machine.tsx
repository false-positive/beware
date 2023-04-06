import { api } from "~/utils/api";

export const useCreateMachine = (
    { isReset }: { isReset: boolean } = { isReset: true },
) =>
    api.machine.create.useMutation({
        onSuccess() {
            alert(
                isReset ? "ookay, created machine" : "reset machine, all good",
            );
        },
        onError() {
            alert("error creating machine, oopsies");
        },
    });
