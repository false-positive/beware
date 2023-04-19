import * as React from "react";

function SvgComponent(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            height="1rem"
            width="1rem"
            {...props}
        >
            <path d="M5.92 24.096q0 .832.576 1.408t1.44.608h16.128q.832 0 1.44-.608t.576-1.408V7.936q0-.832-.576-1.44t-1.44-.576H7.936q-.832 0-1.44.576t-.576 1.44v16.16z" />
        </svg>
    );
}

export default SvgComponent;
