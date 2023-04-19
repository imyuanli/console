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
        getItem('Blog', 'blog', <ReadOutlined/>, [
            getItem(<Link to={'/blog/editor'}>编辑文章</Link>, 'editor'),
            getItem(<Link to={'/blog/project'}>项目管理</Link>, 'project'),
            // getItem(<Link to={'/blog'}>编辑文章</Link>, 'b-editor'),
            // getItem(<Link to={'/blog/article'}>文章管理</Link>, 'b-article'),
            // getItem(<Link to={'/blog/classify'}>分类管理</Link>, 'b-classify'),
            // getItem(<Link to={'/blog/recycle'}>回收站</Link>, 'b-del'),
        ]),
        // getItem(<Link to={'/'}>首页</Link>, 'index', <HomeFilled/>),
        // getItem('aTools', 'atools', <ToolFilled/>, [
        //     getItem(<Link to={'/atools'}>工具管理</Link>, 't-tools'),
        //     getItem(<Link to={'/atools/classify'}>分类管理</Link>, 't-type'),
        //     getItem(<Link to={'/atools/recycle'}>回收站</Link>, 't-del'),
        // ]),
        //
        // getItem(<Link to={'/user'}>管理用户</Link>, 'user', <UserOutlined/>),
    ];
    return (
        <Layout className={'min-h-screen'}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div style={{height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)'}}/>
                <Menu
                    theme="dark"
                    defaultOpenKeys={['blog']}
                    defaultSelectedKeys={[pathArr[pathArr.length - 1]]}
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