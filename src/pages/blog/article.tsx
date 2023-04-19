import {Button, Table} from "antd";
import {Link} from "@@/exports";
import {useEffect, useState} from "react";
import {get_article_list} from "@/service/service";


const Article = () => {
    const [dataSource, setDataSource] = useState(null)

    useEffect(() => {
        get_article_list().then((res: any) => {
            setDataSource(res['article_list'])
        })
    }, [])
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
                    <Button
                        type={'primary'}
                        danger
                    >
                        下架
                    </Button>
                </div>
            ),
        },
    ];


    return (
        <div>
            <Table columns={columns} dataSource={dataSource} loading={!dataSource}/>
        </div>
    );
}


export default Article