import {BrowserRouter} from "react-router-dom";
import AppRouter from "./components/AppRouter";
import {Layout} from 'antd';
import SideMenu from "./components/SideMenu/SideMenu";

const {Header, Footer} = Layout;

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
                    <Footer>Footer</Footer>
                </Layout>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
