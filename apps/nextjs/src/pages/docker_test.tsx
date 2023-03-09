import { api } from "~/utils/api";

export default function Test4() {
    // This can either be a tuple ['login'] or string 'login'
    const creationMutation = api.machine.create.useMutation();
    const deletionMutation = api.machine.delete.useMutation();
    const handleCreation = () => {
        const id = "clf1dab4g0000uidwlao6rzdu";
        creationMutation.mutate(id);
    };
    const handleDeletion = () => {
        const id = "clf1dab4g0000uidwlao6rzdu";
        deletionMutation.mutate(id);
    };
    return (
        <div>
            <h1>Test form</h1>
            <button
                onClick={handleCreation}
                disabled={creationMutation.isLoading}
            >
                Test Create
            </button>
            <button
                onClick={handleDeletion}
                disabled={deletionMutation.isLoading}
            >
                Test Delete
            </button>
            {creationMutation.error && (
                <p>Something went wrong! {creationMutation.error.message}</p>
            )}

            {deletionMutation.error && (
                <p>Something went wrong! {deletionMutation.error.message}</p>
            )}
        </div>
    );
}
