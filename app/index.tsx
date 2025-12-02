import Login from "./stacks/login";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            const isLoggedIn = false;

            if(isLoggedIn) {
                return router.navigate("/tabs/home");
            } else {
                return <Login />;
            }

        }, 1000);

        return () => clearTimeout(timeout);

    }, [router]);

    return <Login/>;
}