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
    });
};
