export default function Header() {
    return (
    <>
        <header className="header">
            <a href="/" className="logo">Webreg</a>
            <nav>
                <ul className="nav-list">
                    <li className="nav-item">
                        <a href="/" className="nav-link">Home</a>
                    </li>
                    <li className="nav-item">
                        <a href="/register" className="nav-link">Register Classes</a>
                    </li>
                    <li className="nav-item">
                        <a href="/plan" className="nav-link">Calender</a>
                    </li>
                </ul>
            </nav>
        </header>
    </>
    )
}