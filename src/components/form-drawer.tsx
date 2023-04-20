import {Button, Drawer, message, Table} from "antd";
import FormFrame from "@/components/form-frame";
import React, {useState} from "react";
import {nanoid} from "nanoid";

interface props {
    btnText: string,
    columns: any,
    dataSource: any,
    id: any,
    initData: any,
    formData: any,
    data: any,
    setState: any,
    api: any,
    getTableList: any
}

const FormDrawer: React.FunctionComponent<props> = ({
                                                        btnText,
                                                        columns,
                                                        dataSource,
                                                        id,
                                                        initData,
                                                        formData,
                                                        data,
                                                        setState,
                                                        api,
                                                        getTableList
                                                    }) => {
    const [open, setOpen] = useState(false)

    const onCloseDrawer = () => {
        setOpen(false)
        setState({
            data: {...initData}
        })
    }

    const onChangeValue = (attribute, value) => {
        const res = {...data}
        res[attribute] = value
        setState({
            data: {...res}
        })
    }

    const handleInsertOrUpdate = () => {
        let obj = {...data}
        if (!data[id]) {
            obj[id] = nanoid()
        }
        api(obj).then((res) => {
            if (res) {
                getTableList()
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
                        setOpen(true)
                    }}
                >
                    {btnText}
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={dataSource}
                loading={!dataSource}
            />
            <Drawer
                title={data[id] ? '编辑' : '新增'}
                placement="right"
                onClose={onCloseDrawer}
                open={open}
                width={'40%'}
                footer={
                    <div className={'flex justify-end'}>
                        <Button size={'large'}
                                type={'primary'}
                                onClick={handleInsertOrUpdate}
                        >
                            {data[id] ? "更新" : "添加"}
                        </Button>
                        <Button
                            onClick={onCloseDrawer}
                            size={'large'}
                            className={'ml-3'}
                        >
                            取消
                        </Button>
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
    );
}


export default FormDrawer