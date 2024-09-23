import { Link } from "react-router-dom";

export const Admin404 = () => {
    return (
        <>
            <div className="grid h-screen place-content-center bg-white px-4">
                <div className="text-center">
                    <h1 className="text-9xl font-black text-gray-200">404</h1>

                    <p className="mt-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Uh-oh!
                    </p>

                    <p className="mt-2 text-gray-500">We can&apos;t find that page.</p>

                    <Link
                        to={'/admin-overview'}
                        className="mt-6 inline-block rounded-xl bg-[#00A67C] px-5 py-3 text-sm font-medium text-white  transition delay-100 ease-in-out hover:bg-[#00916D]"
                    >
                        Go Back to Dashboard
                    </Link>
                </div>
            </div>
        </>
    );
};
