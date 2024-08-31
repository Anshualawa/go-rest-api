import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <div className="w-full mx-auto flex lg:w-full lg:mx-auto max-h-screen overflow-hidden">
                <main className="flex-grow p-2 justify-center items-center overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </>
    )
}

export default Layout;