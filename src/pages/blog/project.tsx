import {useEffect, useRef} from "react";
import {Image, Tag, Button} from "antd";
import {get_project_list, insert_or_update_project} from "@/service/service";
import {useSetState} from "ahooks";
import {getDefaultValue} from '@/utils'
import FormDrawer from "@/components/form-drawer";
import withAuth from "@/hocs/withAuth";

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
    const {dataSource, data} = state

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
            title: '优先级',
            attribute: 'priority'
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

    const childRef = useRef(null)
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
            title: '优先级',
            dataIndex: 'priority',
            key: 'priority',
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
                        childRef.current.onOpenDrawer(record)
                    }}
                >
                    编辑
                </Button>
            ),
        },
    ];


    return (
        <FormDrawer
            ref={childRef}
            btnText={'新增分类'}
            columns={columns}
            dataSource={dataSource}
            id={'uid'}
            data={data}
            setState={setState}
            initData={initData}
            formData={formData}
            api={insert_or_update_project}
            getTableList={getProjectList}
        />
    )
}


export default withAuth(Project)