import {useEffect} from "react";
import {Table, Image, Tag, Button, Drawer, message} from "antd";
import {get_project_list, insert_or_update_project} from "@/service/service";
import {useSetState} from "ahooks";
import FormFrame from "@/components/form-frame";
import {getDefaultValue} from '@/utils'
import {nanoid} from "nanoid";

const Project = () => {
    //初始值
    const initData: any = {
        name: '',
        description: '',
        link: '',
        tag: '',
        logo: '',
        state: 1,
        version: '',
        powered_by: 'umi',
    }

    //初始数据
    const [state, setState] = useSetState({
        dataSource: null,
        open: false,
        data: {...initData}
    })
    const {dataSource, open, data} = state

    //表单数据
    const stateOptions = [
        {
            label: '维护中',
            value: 0
        },
        {
            label: '稳定运行',
            value: 1
        },
        {
            label: '开发中',
            value: 2
        },
    ]
    const powerOptions = [
        {
            label: 'Umi',
            value: 'umi'
        },
        {
            label: 'React',
            value: 'react'
        },
        {
            label: 'NextJS',
            value: 'next'
        },
        {
            label: 'Remix',
            value: 'remix'
        },
        {
            label: 'Taro',
            value: 'taro'
        },
        {
            label: 'UniApp',
            value: 'uni'
        },
        {
            label: 'Vue3',
            value: 'vue3'
        },
        {
            label: 'Vue2',
            value: 'vue2'
        },
    ]
    const formData = [
        {
            title: 'LOGO',
            attribute: 'logo'
        },
        {
            title: '名称',
            attribute: 'name'
        },
        {
            title: '描述',
            attribute: 'description'
        },
        {
            title: '链接',
            attribute: 'link'
        },
        {
            title: '标签',
            attribute: 'tag'
        },
        {
            title: '状态',
            attribute: 'state',
            options: stateOptions,
        },
        {
            title: '版本',
            attribute: 'version',

        },
        {
            title: '框架',
            attribute: 'powered_by',
            options: powerOptions,
        },
    ]

    //请求数据
    const getProjectList = () => {
        get_project_list().then((res: any) => {
            setState({
                dataSource: res['project_list']
            })
        })
    }
    useEffect(() => {
        getProjectList()
    }, [])

    //表头
    const columns: any = [
        {
            title: 'LOGO',
            dataIndex: 'logo',
            key: 'logo',
            render: (text) => <Image
                width={50}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />,
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '链接',
            dataIndex: 'link',
            key: 'link',
        },
        {
            title: '标签',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, {tag}) => (
                <>
                    <Tag>
                        {tag}
                    </Tag>
                </>
            ),
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            render: (value) => (
                <div>
                    {getDefaultValue(stateOptions, value)}
                </div>
            ),
        },
        {
            title: '版本',
            dataIndex: 'version',
            key: 'version',
        },
        {
            title: '框架',
            dataIndex: 'powered_by',
            key: 'powered_by',
            render: (value) => (
                <div>
                    {getDefaultValue(powerOptions, value)}
                </div>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Button
                    type={'primary'}
                    onClick={() => {
                        onOpenDrawer(record)
                    }}
                >
                    编辑
                </Button>
            ),
        },
    ];

    //打开drawer
    const onOpenDrawer = (record) => {
        setState({
            open: true,
            data: {...record}
        })
    }

    //关闭滞空
    const onCloseDrawer = () => {
        setState({
            open: false,
            data: {...initData}
        })
    }

    //编辑表单修改的值
    const onChangeValue = (attribute, value) => {
        const res = {...data}
        res[attribute] = value
        setState({
            data: {...res}
        })
    }

    //更新或添加值
    const insertOrUpdateProject = () => {
        let obj = {...data}
        if (!data.uid) {
            obj.uid = nanoid()
        }
        insert_or_update_project(obj).then((res) => {
            if (res.uid) {
                getProjectList()
                onCloseDrawer()
                message.success(`${res?.created ? '新建' : '更新'}成功`)
            }
        })
    }
    return (
        <div className={'space-y-3'}>
            <div className={'w-full flex justify-end'}>
                <Button
                    type={'primary'}
                    onClick={() => {
                        setState({
                            open: true,
                        })
                    }}
                >
                    添加项目
                </Button>
            </div>
            <Table columns={columns} dataSource={dataSource} loading={!dataSource}/>
            <Drawer
                title={data.uid ? '编辑' : '新增'}
                placement="right"
                onClose={onCloseDrawer}
                open={open}
                width={'40%'}
                footer={
                    <div className={'flex justify-end'}>
                        <Button size={'large'}
                                type={'primary'}
                                onClick={insertOrUpdateProject}
                        >
                            {data.uid ? "更新" : "添加"}
                        </Button>
                        <Button onClick={onCloseDrawer} size={'large'} className={'ml-3'}>取消</Button>
                    </div>
                }
            >
                <div className={'space-y-6'}>
                    {formData.map((item, index) => {
                        const {title, attribute, options} = item
                        return (
                            <FormFrame
                                key={attribute}
                                title={title}
                                attribute={attribute}
                                value={data[attribute]}
                                onChange={onChangeValue}
                                options={options}
                            />
                        )
                    })}
                </div>
            </Drawer>
        </div>
    )
}


export default Project