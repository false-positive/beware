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
