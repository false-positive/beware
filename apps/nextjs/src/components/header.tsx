import Link from "next/link";

import Title from "../components/title";

const Header = () => {
    return (
        <header className="header">
            <Link href="/" className="header__logo title">
                <Title></Title>
            </Link>
            <div className="header__profile">
                {/* <img src="#" alt="profile" className="header__profile-img" /> */}
                <p className="header__profile-name">
                    John Doe <span>&#x25BC;</span>
                </p>
            </div>
        </header>
    );
};

export default Header;
