//复位
export const restoration = (fullPath) => {
    let path = decodeURIComponent(fullPath)
    if (sessionStorage.getItem(path)) {
        window.scrollTo({ top: sessionStorage.getItem(path) * 1, behavior: "instant" });
        sessionStorage.removeItem(path)
    } 
}
//记录
export const record = (fullPath, height) => {
    sessionStorage.setItem(decodeURIComponent(fullPath), height);
}
