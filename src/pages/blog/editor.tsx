import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import {useEffect, useState} from "react";
import {useSetState} from "ahooks";
import {Button, DatePicker, Input, message, Select} from "antd";
import {get_article, get_classify_list, insert_or_update_article} from "@/service/service";
import {nanoid} from "nanoid";
import {useLocation} from "@@/exports";
import dayjs from "dayjs";
import Loading from "@/components/loading";
import BASE_URL from "@/service/base_url";
import axios from "axios";
import {IMG_URL} from "@/utils";
import withAuth from "@/hocs/withAuth";

const initData = {
    article_id: '',
    title: '',
    describe: '',
    classify_value: '',
    create_time: dayjs().format('YYYY-MM-DD'),
    preview_theme: 'default',
    code_theme: 'atom',
}
const previewThemeOptions: any = [
    {value: 'default', label: 'default'},
    {value: 'github', label: 'github'},
    {value: 'vuepress', label: 'vuepress'},
    {value: 'mk-cute', label: 'mk-cute'},
    {value: 'smart-blue', label: 'smart-blue'},
    {value: 'cyanosis', label: 'cyanosis'},
]
const codeThemeOptions: any = [
    {value: 'atom', label: 'atom'},
    {value: 'a11y', label: 'a11y'},
    {value: 'github', label: 'github'},
    {value: 'gradient', label: 'gradient'},
    {value: 'kimbie', label: 'kimbie'},
    {value: 'paraiso', label: 'paraiso'},
    {value: 'qtcreator', label: 'qtcreator'},
    {value: 'stackoverflow', label: 'stackoverflow'},
]
const editor = () => {
    const [content, setContent] = useState('# Hello Editor');
    const [classifyOptions, setClassifyOptions] = useState([]);

    useEffect(() => {
        get_classify_list().then((res) => {
            if (res) {
                const list = res['classify_list'].map((item) => {
                    return {
                        label: item.classify_label,
                        value: item.classify_value,
                    }
                })
                setClassifyOptions([...list])
            }
        })
    }, [])

    const [data, setData] = useSetState<any>(initData)
    const [loading, setLoading] = useState<any>(false)
    const {article_id, title, describe, classify_value, create_time, preview_theme, code_theme} = data
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

    const onUploadImg = async (files, callback) => {
        const res = await Promise.all(
            files.map((file) => {
                return new Promise((rev, rej) => {
                    const form = new FormData();
                    form.append('file', file);
                    axios.post(`${BASE_URL}console/upload_blog_image/`, form, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                        .then((res) => rev(res))
                        .catch((error) => rej(error));
                });
            })
        );
        callback(res.map((item) => `${IMG_URL}/${item.data.data}`))
    };

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
                            <div className={'space-x-3'}>
                                <Select
                                    style={{minWidth: 150}}
                                    placeholder="选择分类"
                                    value={classify_value}
                                    options={classifyOptions}
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
                                <Select
                                    style={{minWidth: 150}}
                                    placeholder="预览主题"
                                    value={preview_theme}
                                    options={previewThemeOptions}
                                    onChange={(value) => {
                                        setData({
                                            preview_theme: value
                                        })
                                    }}
                                />
                                <Select
                                    style={{minWidth: 150}}
                                    placeholder="代码主题"
                                    value={code_theme}
                                    options={codeThemeOptions}
                                    onChange={(value) => {
                                        setData({
                                            code_theme: value
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
                                height: '75vh'
                            }}
                            showCodeRowNumber={true}
                            onUploadImg={onUploadImg}
                            previewTheme={preview_theme}
                            codeTheme={code_theme}
                        />
                    </>
            }
        </div>
    );
}

export default withAuth(editor)
