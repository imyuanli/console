import {Button, Card, Input, message, Tabs, TabsProps} from "antd";
import {KeyOutlined, UserOutlined} from "@ant-design/icons";
import {useSetState} from "ahooks";

const Login = () => {
    const [data, setData] = useSetState({
        username: '',
        password: ''
    })
    const {username, password} = data
    const handleLogin = () => {
        if (!username) {
            message.warning('用户名为空')
            return
        }
        if (!password) {
            message.warning('密码为空')
            return
        }

        //    todo 登录的代码
    }

    return (
        <div className={'w-full h-96 flex-center'}>
            <div className={'max-w-7xl'}>
                <Tabs
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