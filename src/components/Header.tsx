type HeaderProperties = {
    title: string;
    subtitle: string;
}

const Header = ({ title, subtitle }: HeaderProperties) => {
    return (
        <>
            <div>{title}</div>
            <p>{subtitle}</p>
        </>
    )
}

export default Header;