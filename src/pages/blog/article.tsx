import {Button, message, Popconfirm, Table, Tabs} from "antd";
import {Link} from "@@/exports";
import {useEffect} from "react";
import {
    get_article_list,
    get_classify_list,
    insert_or_update_article_classify,
    update_article_state
} from "@/service/service";
import {useSetState} from "ahooks";
import FormDrawer from "@/components/form-drawer";


const Article = () => {
    const initData: any = {
        classify_id: '',
        classify_label: '',
        classify_value: '',
    }
    const [state, setState] = useSetState({
        currentKey: 0,
        dataSource: null,
        classifyList: null,
        data: {...initData}
    })
    const {currentKey, dataSource, classifyList, data} = state
    const getArticleList = () => {
        setState({
            dataSource: null
        })
        get_article_list({is_delete: currentKey}).then((res: any) => {
            setState({
                dataSource: res['article_list']
            })
        })
    }
    const getClassifyList = () => {
        setState({
            classifyList: null
        })
        get_classify_list().then((res) => {
            if (res) {
                setState({
                    classifyList: res['classify_list']
                })
            }
        })
    }
    useEffect(() => {
        getClassifyList()
    }, [])
    useEffect(() => {
        if (currentKey == 3) {
            getClassifyList()
        } else {
            getArticleList()
        }
    }, [currentKey])

    //表头
    const columns: any = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '描述',
            dataIndex: 'describe',
            key: 'describe',
        },
        {
            title: '分类',
            dataIndex: 'classify_value',
            key: 'classify_value',
        },
        {
            title: '阅读数量',
            key: 'view_count',
            dataIndex: 'view_count',
        },
        {
            title: '时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <div className={'space-x-3'}>
                    <Button
                        type={'primary'}
                    >
                        <Link to={`/blog/editor?article_id=${record.article_id}`}>
                            编辑
                        </Link>
                    </Button>
                    <Popconfirm
                        title={`确认${currentKey ? '上架' : '下架'}?`}
                        onConfirm={() => {
                            handleChangeArticleState(record.article_id)
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type={'primary'}
                            danger
                        >
                            {currentKey ? '上架' : '下架'}
                        </Button>
                    </Popconfirm>

                </div>
            ),
        },
    ];
    const handleChangeArticleState = (article_id) => {
        update_article_state({article_id, is_delete: currentKey ? 0 : 1}).then((res) => {
            if (res) {
                message.success(`${currentKey ? '上架' : '下架'}成功`)
                getArticleList()
            }
        })
    }

    //分类
    const columnsClassify: any = [
        {
            title: '名称',
            dataIndex: 'classify_label',
            key: 'classify_label',
        },
        {
            title: '属性',
            dataIndex: 'classify_value',
            key: 'classify_value',
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <div className={'space-x-3'}>
                    <Button
                        type={'primary'}
                    >
                        <Link to={`/blog/editor?article_id=${record.article_id}`}>
                            编辑
                        </Link>
                    </Button>
                    <Popconfirm
                        title={`确认删除?`}
                        onConfirm={() => {
                            console.log(record.classify_id)
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type={'primary'}
                            danger
                        >
                            删除
                        </Button>
                    </Popconfirm>

                </div>
            ),
        },
    ];
    const formData = [
        {
            title: '名称',
            attribute: 'classify_label'
        },
        {
            title: '属性',
            attribute: 'classify_value',
        },
    ]

    return (
        <div>
            <Tabs
                activeKey={currentKey}
                items={
                    [
                        {
                            key: 0,
                            label: `已上架`,
                            children: <Table columns={columns} dataSource={dataSource} loading={!dataSource}/>,
                        },
                        {
                            key: 1,
                            label: `草稿箱`,
                            children: <Table columns={columns} dataSource={dataSource} loading={!dataSource}/>,
                        },
                        {
                            key: 3,
                            label: `文章分类`,
                            children: <>
                                <FormDrawer
                                    btnText={'新增分类'}
                                    columns={columnsClassify}
                                    dataSource={classifyList}
                                    id={'classify_id'}
                                    data={data}
                                    setState={setState}
                                    initData={initData}
                                    formData={formData}
                                    api={insert_or_update_article_classify}
                                    getTableList={getClassifyList}
                                />
                            </>,
                        },
                    ]
                }
                onChange={(key) => {
                    setState({
                        currentKey: key
                    })
                }}
            />

        </div>
    );
}


export default Article