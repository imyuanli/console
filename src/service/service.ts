import request from './request'
import BASE_URL from './base_url'

export async function get_project_list(payload?: any) {
    return request.get(BASE_URL + `blog/get_project_list/`, payload)
}

export async function insert_or_update_project(payload?: any) {
    return request.post(BASE_URL + `console/insert_or_update_project/`, payload)
}

