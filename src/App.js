import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import {Layout} from 'antd';
import SideMenu from "./components/SideMenu/SideMenu";
import Footer from "./components/Footer/Footer";
const {Header} = Layout;

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <SideMenu/>
                <Layout>
                    <Header>Header</Header>
                    <Layout.Content style={{padding: '32px'}}>
                        <AppRouter/>
                    </Layout.Content>
                    <Footer/>
                </Layout>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
