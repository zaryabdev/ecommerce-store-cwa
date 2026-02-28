const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white border-t">
            <div className="py-10 mx-auto">
                <p className="text-xs text-center text-black">
                    &copy; {year} Store, Inc. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
