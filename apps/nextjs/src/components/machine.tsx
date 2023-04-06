import { toast } from "react-toastify";

import { api } from "~/utils/api";

export const useCreateMachine = (
    { isReset }: { isReset: boolean } = { isReset: true },
) =>
    api.machine.create.useMutation({
        onMutate() {
            const loadingToast = toast("creating machine...", {
                isLoading: true,
            });
            return { loadingToast };
        },
        onSuccess(_data, _variables, ctx) {
            if (ctx) {
                toast.done(ctx.loadingToast);
            }
            toast(
                isReset ? "ookay, created machine" : "reset machine, all good",
            );
        },
        onError() {
            toast("error creating machine, oopsies");
        },
    });
