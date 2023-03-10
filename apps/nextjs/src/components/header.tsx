import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { FiChevronDown } from "react-icons/fi";

import Title from "../components/title";

const Header = () => {
    const { data: session } = useSession();

    const name =
        session?.user?.name ||
        session?.user.email?.split("@")[0] ||
        "Anonymous";

    return (
        <header className="header">
            <Link href="/" className="header__logo title">
                <Title></Title>
            </Link>
            <div className="header__profile">
                {/* <img src="#" alt="profile" className="header__profile-img" /> */}
                <p
                    className="header__profile-name"
                    onClick={() => void signOut()}
                >
                    {name + " "}
                    <span>
                        <FiChevronDown />
                    </span>
                </p>
            </div>
        </header>
    );
};

export default Header;
