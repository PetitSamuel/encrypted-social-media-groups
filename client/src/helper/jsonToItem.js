export function responseToPostArray(response) {
    if(!response || response.length === 0) return [];
    let arr = [];
    for (const item of response) {
        if(!item || !item.user || !item.text || !item.group) continue;
        arr.push({
            author: item.user,
            post: item.text,
            group: item.group,
        });
    }
    return arr;
}
