import {Button, Card, Input, message, Tabs, TabsProps} from "antd";
import {KeyOutlined, UserOutlined} from "@ant-design/icons";
import {useSetState} from "ahooks";
import {get_login} from "@/service/service";
import store from 'store'
import {useLocation, useNavigate} from "@@/exports"
import {useEffect} from "react";

const Login = () => {
    const navigate = useNavigate()
    const redirectUrl = (url) => {
        navigate(url)
    }

    useEffect(() => {
        if (store.get('token')) {
            redirectUrl('/')
        }
    }, [])

    const [data, setData] = useSetState({
        username: '',
        password: ''
    })
    const {username, password} = data

    const location = useLocation()
    const handleLogin = () => {
        if (!username) {
            message.warning('用户名为空')
            return
        }
        if (!password) {
            message.warning('密码为空')
            return
        }
        get_login({
            username,
            password,
        }).then((res) => {
            if (res) {
                store.set('token', res.token)
                redirectUrl(location.search.split('=')[1])
            }
        })
    }

    return (
        <div className={'w-full h-96 flex-center flex-col'}>
            <div className={'text-3xl font-semibold my-12'}>
                Yuanli's Console
            </div>
            <div className={'max-w-md'}>
                <Tabs
                    size={'small'}
                    defaultActiveKey="1"
                    centered
                    items={[
                        {
                            key: '1',
                            label: `账户密码登录`,
                            children: <Card>
                                <div className={'space-y-6'}>
                                    <Input
                                        placeholder={'用户名'}
                                        prefix={<UserOutlined/>}
                                        onChange={(e) => {
                                            setData({
                                                username: e.target.value
                                            })
                                        }}
                                    />
                                    <Input
                                        placeholder={'密码'}
                                        prefix={<KeyOutlined/>}
                                        onChange={(e) => {
                                            setData({
                                                password: e.target.value
                                            })
                                        }}
                                    />
                                    <Button
                                        type={'primary'}
                                        className={'w-full'}
                                        onClick={handleLogin}
                                    >
                                        登录
                                    </Button>
                                </div>
                            </Card>,
                        },
                    ]}
                />
            </div>
        </div>
    );
}


export default Login