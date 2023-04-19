import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import {useState} from "react";
import {useSetState} from "ahooks";
import {Button, DatePicker, Input, message, Select} from "antd";
import {insert_or_update_blog, insert_or_update_project} from "@/service/service";
import {nanoid} from "nanoid";


const editor = () => {
    const [content, setContent] = useState('# Hello Editor');
    const [data, setData] = useSetState({
        article_id: '',
        title: '',
        describe: '',
        classify_name: '',
        create_time: '',
    })

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
        <div className={'space-y-3'}>
            <div className={'text-xl'}>添加文章</div>
            <Input
                placeholder={'标题'}
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
                placeholder={'描述'}
            />
            <div className={'flex justify-between items-center'}>
                <div>
                    <Select
                        placeholder="选择分类"
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
        </div>
    );
}


export default editor