import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import {useEffect, useState} from "react";
import {useSetState} from "ahooks";
import {Button, DatePicker, Input, message, Select} from "antd";
import {get_article, insert_or_update_article} from "@/service/service";
import {nanoid} from "nanoid";
import {useLocation} from "@@/exports";
import dayjs from "dayjs";
import Loading from "@/components/loading";


const editor = () => {
    const [content, setContent] = useState('# Hello Editor');
    const initData = {
        article_id: '',
        title: '',
        describe: '',
        classify_value: '',
        create_time: dayjs().format('YYYY-MM-DD'),
    }

    const [data, setData] = useSetState<any>(initData)
    const [loading, setLoading] = useState<any>(false)
    const {article_id, title, describe, classify_value, create_time} = data
    const location = useLocation()
    useEffect(() => {
        const article_id = location.search.split('=')[1]
        if (article_id) {
            setLoading(true)
            get_article({article_id}).then((res) => {
                if (res) {
                    delete res.article['view_count']
                    setData({...res.article})
                    setContent(res.article.content)
                    setLoading(false)
                }
            }).catch(() => {
                setLoading(false)
            })
        } else {
            setData({...initData})
            setContent('# Hello Editor')
        }
    }, [location])

    const arr: any = [
        {value: 'jack', label: 'Jack'},
        {value: 'lucy', label: 'Lucy'},
        {value: 'Yiminghe', label: 'yiminghe'},
        {value: 'disabled', label: 'Disabled'},
    ]

    const handlePublish = (is_delete) => {
        let obj = {...data, content}
        obj.is_delete = is_delete
        if (!data.article_id) {
            obj.article_id = nanoid()
        }
        insert_or_update_article(obj).then((res) => {
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
                                    value={classify_value}
                                    options={arr}
                                    className={'mr-3'}
                                    onChange={(value) => {
                                        setData({
                                            classify_value: value
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
                                <Button danger onClick={() => {
                                    handlePublish(0)
                                }} type={'primary'}>发布</Button>
                                <Button onClick={() => {
                                    handlePublish(1)
                                }} type={'primary'}>存草稿</Button>
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