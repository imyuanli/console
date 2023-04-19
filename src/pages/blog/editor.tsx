import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import {useEffect, useState} from "react";
import {useSetState} from "ahooks";
import {Button, DatePicker, Input, message, Select} from "antd";
import {get_article, insert_or_update_blog} from "@/service/service";
import {nanoid} from "nanoid";
import {useLocation} from "@@/exports";
import dayjs from "dayjs";
import Loading from "@/components/loading";


const editor = () => {
    const [content, setContent] = useState('# Hello Editor');
    const [data, setData] = useSetState<any>({
        article_id: '',
        title: '',
        describe: '',
        classify_name: '',
        create_time: dayjs().format('YYYY-MM-DD'),
    })
    const [loading, setLoading] = useState<any>(false)
    const {article_id, title, describe, classify_name, create_time} = data
    const location = useLocation()
    useEffect(() => {
        const article_id = location.search.split('=')[1]
        if (article_id) {
            setLoading(true)
            get_article({article_id}).then((res) => {
                if (res) {
                    delete res.article['view_count']
                    setData({...res.article})
                    setLoading(false)
                }
            }).catch(() => {
                setLoading(false)
            })
        }
    }, [])

    const arr: any = [
        {value: 'jack', label: 'Jack'},
        {value: 'lucy', label: 'Lucy'},
        {value: 'Yiminghe', label: 'yiminghe'},
        {value: 'disabled', label: 'Disabled'},
    ]

    const handlePublish = () => {
        let obj = {...data, content}
        if (!data.article_id) {
            obj.article_id = nanoid()
        }
        insert_or_update_blog(obj).then((res) => {
            if (res.article_id) {
                message.success(`${res?.created ? '新建' : '更新'}成功`)
            }
        })
    }
    return (
        <div className={'space-y-3 w-full'}>
            {
                loading ?
                    <Loading/>
                    :
                    <>
                        <div className={'text-xl'}>{article_id ? '编辑' : '添加'}文章</div>
                        <Input
                            placeholder={'标题'}
                            value={title}
                            onChange={(e) => {
                                setData({
                                    title: e.target.value
                                })
                            }}
                        />
                        <Input
                            onChange={(e) => {
                                setData({
                                    describe: e.target.value
                                })
                            }}
                            value={describe}
                            placeholder={'描述'}
                        />
                        <div className={'flex justify-between items-center'}>
                            <div>
                                <Select
                                    placeholder="选择分类"
                                    value={classify_name}
                                    options={arr}
                                    className={'mr-3'}
                                    onChange={(value) => {
                                        setData({
                                            classify_name: value
                                        })
                                    }}
                                />
                                <DatePicker
                                    placeholder={'发布时间'}
                                    value={dayjs(create_time)}
                                    defaultValue={create_time ? create_time : dayjs(create_time)}
                                    onChange={(date, dateString) => {
                                        setData({
                                            create_time: dateString
                                        })
                                    }}
                                />
                            </div>
                            <div className={'space-x-3'}>
                                <Button onClick={handlePublish} type={'primary'}>发布</Button>
                                <Button type={'primary'}>存草稿</Button>
                            </div>
                        </div>
                        <MdEditor
                            modelValue={content}
                            onChange={setContent}
                            style={{
                                height: 800
                            }}
                            showCodeRowNumber={true}
                        />
                    </>
            }
        </div>
    );
}


export default editor