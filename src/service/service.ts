import request from './request'
import BASE_URL from './base_url'

export async function get_project_list(payload?: any) {
    return request.get(BASE_URL + `blog/get_project_list/`, payload)
}

export async function get_article_list(payload?: any) {
    return request.get(BASE_URL + `blog/get_article_list/`, payload)
}

export async function get_article(payload?: any) {
    return request.post(BASE_URL + `blog/get_article/`, payload)
}

export async function insert_or_update_project(payload?: any) {
    return request.post(BASE_URL + `console/insert_or_update_project/`, payload)
}


export async function insert_or_update_article(payload?: any) {
    return request.post(BASE_URL + `console/insert_or_update_article/`, payload)
}

export async function update_article_state(payload?: any) {
    return request.post(BASE_URL + `console/update_article_state/`, payload)
}

