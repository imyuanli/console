import React, {useState} from 'react';
import {
    FileOutlined,
    HomeFilled, ReadOutlined,
    TeamOutlined,
    ToolFilled,
    UserOutlined,
} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Avatar, Button, Layout, Menu, Popover,} from 'antd';
import {Link, Outlet, useLocation, useNavigate} from "@@/exports";
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import dayjs from "dayjs";

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)


const {Header, Content, Footer, Sider} = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const App: React.FC = () => {
    const location = useLocation();
    const pathname = location.pathname
    //初始 key
    const pathArr = pathname.split('/')

    console.log("pathArr",pathArr)
    //登录页面
    if (pathname === '/login') {
        return (
            <div className={'main'}>
                <div className={'content'}>
                    <Outlet/>
                </div>
            </div>
        )
    }

    //收缩
    const [collapsed, setCollapsed] = useState(false);

    const items: MenuItem[] = [
        getItem('博客', 'blog', <ReadOutlined/>, [
            getItem(<Link to={'/blog/editor'}>编辑文章</Link>, 'editor'),
            getItem(<Link to={'/blog/article'}>文章管理</Link>, 'article'),
            getItem(<Link to={'/blog/project'}>项目管理</Link>, 'project'),
        ]),
        getItem('aTools', 'tool', <ToolFilled/>, [
            getItem(<Link to={'/tool/manage'}>工具管理</Link>, 'manage'),
            getItem(<Link to={'/tool/classify'}>分类管理</Link>, 'classify'),
        ]),
    ];
    return (
        <Layout className={'min-h-screen'}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)'}}/>
                <Menu
                    theme="dark"
                    defaultOpenKeys={['blog']}
                    selectedKeys={[pathArr[pathArr.length - 1]]}
                    mode="inline"
                    items={items}
                />
            </Sider>
            <Layout className="site-layout">
                <Header className={'bg-white flex justify-end items-center'}>
                    <Popover
                        content={
                            <Button type={'text'}>退出登录</Button>
                        }
                        trigger="click"
                    >
                        <Avatar icon={<UserOutlined/>}/>
                    </Popover>
                </Header>
                <Content className={'p-3'}>
                    <Outlet/>
                </Content>
                <Footer className={'text-center'}>鸢离 © {new Date().getFullYear()} </Footer>
            </Layout>
        </Layout>
    );
};

export default App;