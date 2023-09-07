import axios from "axios"
export const require = (TYPE, URL, VALUE) => {
    return axios({
        method: TYPE,
        url: URL,
        params: TYPE === "get" ? VALUE : null,
        data: TYPE === "get" ? null : VALUE
    })
}