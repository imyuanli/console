export const getDefaultValue = (arr, value) => {
    const res = arr.find(item => item.value == value)
    return res.label
}
export const IMG_URL = 'https://qiniu.imyuanli.cn'