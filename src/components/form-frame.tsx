import {Input, Select} from "antd";
import React from "react";

interface props {
    title: string,
    attribute: string,
    value: any,
    options: any,
    onChange: any
}

const FormFrame: React.FunctionComponent<props> = ({title, attribute, value, options, onChange}) => {
    return (
        <div className={'space-y-1'}>
            <div>{title}</div>
            <div>
                {
                    options ?
                        <Select
                            value={value}
                            style={{width: '100%'}}
                            onChange={
                                (val) => {
                                    onChange(attribute, val)
                                }
                            }
                            options={options}
                        />
                        :
                        <Input
                            value={value}
                            onChange={
                                (e) => {
                                    onChange(attribute, e.target.value)
                                }
                            }
                        />
                }
            </div>
        </div>
    );
}


export default FormFrame