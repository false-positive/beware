import * as React from "react";

function SvgComponent(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            fill="#000"
            height="1rem"
            width="1rem"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 24 24"
            xmlSpace="preserve"
            {...props}
        >
            <path d="M1.98 12L15 2v5.71L23 2v20l-8-5.71V22L1.98 12zM2 2H0v20h2V2z" />
        </svg>
    );
}

export default SvgComponent;
