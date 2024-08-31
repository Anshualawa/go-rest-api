const Breadcrumbs = () => {
    return (
        <>
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <a
                            href="#"
                            className="ml-1 inline-flex text-sm font-medium text-gray-800 hover:underline md:ml-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-4 h-4 w-4"
                            >
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            Documentation
                        </a>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                            >
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                            <a
                                href="#"
                                className="ml-1 text-sm font-medium text-gray-800 hover:underline md:ml-2"
                            >
                                Application UI
                            </a>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                            >
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                            <span className="ml-1 text-sm font-medium text-gray-800 hover:underline md:ml-2">
                                Breadcrumbs
                            </span>
                        </div>
                    </li>
                </ol>
            </nav>

        </>
    )
}

export default Breadcrumbs