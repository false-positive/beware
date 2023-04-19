import * as React from "react";

function SvgComponent(props) {
    return (
        <svg
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M4 3.25a.75.75 0 00-.75.75v5a.75.75 0 00.75.75.75.75 0 00.75-.75V4.75H9A.75.75 0 009.75 4 .75.75 0 009 3.25zm11 0a.75.75 0 00-.75.75.75.75 0 00.75.75h4.25V9a.75.75 0 00.75.75.75.75 0 00.75-.75V4a.75.75 0 00-.75-.75zm-11 11a.75.75 0 00-.75.75v5a.75.75 0 00.75.75h5a.75.75 0 00.75-.75.75.75 0 00-.75-.75H4.75V15a.75.75 0 00-.75-.75zm16 0a.75.75 0 00-.75.75v4.25H15a.75.75 0 00-.75.75.75.75 0 00.75.75h5a.75.75 0 00.75-.75v-5a.75.75 0 00-.75-.75z"
                color="currentColor"
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default SvgComponent;
