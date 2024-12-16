export const getEmojiTab = (emoji) => {
    let tab = [];
    for (const key of Object.keys(emoji)) {
        let tabItem = {}
        for (const item of emoji[key]) {
            if (item.ext.toLowerCase().indexOf('gif') === -1) {
                tabItem = {
                    id: key,
                    name: item.name,
                    ext: item.ext,
                    default: item.default
                }
                if (!tabItem.default) tabItem.path = item.path
                break
            }
        }
        if(!tabItem.hasOwnProperty('id')){
            let item = emoji[key][0]
            tabItem = {
                id: key,
                name: item.name,
                ext: item.ext,
                default: item.default
            }
            if (!tabItem.default) tabItem.path = item.path
        }
        tab.push(tabItem)
    }
    return tab;
}