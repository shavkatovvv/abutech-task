import { Route, Routes } from "react-router-dom";
import { LoginUser } from "./login/login";
import { Home } from "./home/home";
import { SertTable } from "./components/sert";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LoginUser />} />
                <Route path="/app" element={<Home />}>
                    <Route index element={<SertTable />} />
                </Route>
            </Routes>
        </>
    );
}

export default App;
