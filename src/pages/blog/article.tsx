import {Button, message, Popconfirm, Table, Tabs} from "antd";
import {Link} from "@@/exports";
import {useEffect} from "react";
import {get_article_list, update_article_state} from "@/service/service";
import {useSetState} from "ahooks";
import {cancel} from "@umijs/utils/compiled/@clack/prompts";


const Article = () => {
    const [state, setState] = useSetState({
        currentKey: 0,
        dataSource: null,
    })
    const {currentKey, dataSource} = state

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

    useEffect(() => {
        getArticleList()
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
            dataIndex: 'classify_name',
            key: 'classify_name',
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