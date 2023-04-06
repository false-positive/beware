import { useState } from "react";

import { api } from "~/utils/api";

export default function Test4() {
    // This can either be a tuple ['login'] or string 'login'

    const [id, setId] = useState("");
    const creationMutation = api.machine.create.useMutation();
    const deletionMutation = api.machine.delete.useMutation();
    const handleCreation = () => {
        creationMutation.mutate({ userCourseId: id });
    };
    const handleDeletion = () => {
        deletionMutation.mutate({ userCourseId: id });
    };
    return (
        <div>
            <h1>Test form</h1>
            <input type="text" onChange={(e) => setId(e.target.value)}></input>
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
