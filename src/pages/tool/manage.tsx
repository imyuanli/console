import {Button, message, Popconfirm} from "antd";
import React, {useEffect, useRef} from "react";
import {useSetState} from "ahooks";
import {
    delete_tool,
    get_tools_list,
    insert_or_update_tool
} from "@/service/service";
import dayjs from "dayjs";
import withAuth from "@/hocs/withAuth";
import FormDrawer from "@/components/form-drawer";
import {
    BookOutlined,
    CodeOutlined,
    DribbbleOutlined,
    FileImageOutlined,
    FileSyncOutlined, FontSizeOutlined,
    PlaySquareOutlined, RetweetOutlined, ToolOutlined
} from "@ant-design/icons";

function Tool() {
    //初始值
    const initData: any = {
        name: '',
        link: '',
        state: 'idle',
        type: 'other',
    }

    //初始数据
    const [state, setState] = useSetState({
        dataSource: [],
        data: {...initData},
    })
    const {dataSource, data} = state

    //表单数据
    const stateOptions: any = [
        {
            value: 'idle',
            label: '无状态',
            color: '',
        },
        {
            value: 'new',
            label: 'NEW',
            color: '#87d068',
        },
        {
            value: 'hot',
            label: 'HOT',
            color: '#f50',
        },
        {
            value: 'free',
            label: '限时免费',
            color: 'orange',
        },
        {
            value: 'vip',
            label: 'VIP',
            color: 'gold',
        },
        {
            value: 'bug',
            label: 'BUG',
            color: '#bfbfbf',
        },
    ]
    const typeOptions: any = [
        {
            value: 'file',
            label: '文档转换',
            icon: <FileSyncOutlined/>
        },
        {
            value: 'picture',
            label: '图片工具',
            icon: <FileImageOutlined/>
        },
        {
            value: 'av',
            label: '影音工具',
            icon: <PlaySquareOutlined/>
        },
        {
            value: 'life',
            label: '生活娱乐',
            icon: <DribbbleOutlined/>
        },
        {
            value: 'code',
            label: '开发工具',
            icon: <CodeOutlined/>
        },
        {
            value: 'study',
            label: '教育学习',
            icon: <BookOutlined/>
        },
        {
            value: 'text',
            label: '文本工具',
            icon: <FontSizeOutlined/>
        },
        {
            value: 'data',
            label: '数据换算',
            icon: <RetweetOutlined/>
        },
        {
            value: 'other',
            label: '其他工具',
            icon: <ToolOutlined/>
        },
    ]
    const formData = [
        {
            title: '名称',
            attribute: 'name'
        },
        {
            title: '路由',
            attribute: 'link'
        },
        {
            title: '状态',
            attribute: 'state',
            options: stateOptions,
        },
        {
            title: '类型',
            attribute: 'type',
            options: typeOptions,
        },
    ]

    //获取全部工具
    const getToolsList = () => {
        get_tools_list().then(
            (res: any) => {
                if (!res.errno) {
                    setState({
                        dataSource: res,
                    })
                }
            }
        )
    }
    //首次加载
    useEffect(() => {
        getToolsList()
    }, [])

    //获取状态
    const getState = (value: any) => {
        const res = stateOptions.find(item => item.value === value)
        return res?.label
    }
    const get_tool_type = (value: any) => {
        const res = typeOptions.find((item: any) => item.value == value)
        return res?.label
    }
    const childRef = useRef(null)
    const columns: any = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '路由',
            dataIndex: 'link',
            key: 'link',
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (value: any) => <div>
                <span>{getState(value)}</span>
            </div>,
        },
        {
            title: '分类',
            dataIndex: 'type',
            key: 'type',
            render: (value: any) => <div>
                {get_tool_type(value)}
            </div>,
        },
        {
            title: '使用次数',
            dataIndex: 'views',
            key: 'views',
        },
        {
            title: '创建日期',
            dataIndex: 'create_time',
            key: 'create_time',
            render: (value: any) => <div>
                {dayjs(value).format('YYYY-MM-DD HH:mm')}
            </div>,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            render: (value: any, record: any) => <div>
                <Button
                    type={'primary'}
                    className={'mr-3'}
                    onClick={() => {
                        childRef.current.onOpenDrawer(record)
                    }}
                >
                    编辑
                </Button>
                <Popconfirm
                    title={`确定删除${record.name}?`}
                    onConfirm={() => {
                        delete_tool({tid: record.tid}).then((res) => {
                            if (res) {
                                message.success('删除成功')
                                getToolsList()
                            }
                        })
                    }}
                    okText="确认"
                    cancelText="取消"
                >
                    <Button danger>删除</Button>
                </Popconfirm>
            </div>,
        },
    ];

    return (
        <FormDrawer
            ref={childRef}
            btnText={'新增工具'}
            columns={columns}
            dataSource={dataSource}
            id={'uid'}
            data={data}
            setState={setState}
            initData={initData}
            formData={formData}
            api={insert_or_update_tool}
            getTableList={getToolsList}
        />
    );
}


export default withAuth(Tool)