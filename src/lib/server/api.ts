import { API_BASE_URL } from "$env/static/private";

export async function api(path: string, options?: RequestInit) {
    return fetch(`${API_BASE_URL}${path}`, options)
}