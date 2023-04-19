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
            <path d="M0 16q0-2.784 1.088-5.312T4 6.304t4.384-2.912 5.344-1.088q2.784 0 5.312 1.088t4.384 2.912 2.912 4.384T27.424 16h2.304q.736 0 1.28.416t.8 1.024.16 1.28-.64 1.184l-4.576 4.576q-.672.672-1.6.672t-1.632-.672l-4.576-4.576q-.512-.512-.608-1.184t.128-1.28.8-1.024T20.576 16h2.272q0-2.464-1.216-4.576t-3.328-3.328-4.576-1.216T9.12 8.096t-3.328 3.328T4.576 16t1.216 4.608 3.328 3.328 4.608 1.216q1.728 0 3.36-.64l3.424 3.392q-3.136 1.824-6.784 1.824-2.816 0-5.344-1.088T4 25.728t-2.912-4.384T0 16z" />
        </svg>
    );
}

export default SvgComponent;