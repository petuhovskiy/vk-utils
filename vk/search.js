const api = require('./api')
const cachedApi = require('./cachedApi')

const getInfo = (id) => {
    return api.friends.get(id)
        .then(x => x.response)
        .then(x => {
            return {
                id: id,
                friends: x.items,
                count: x.count
            }
        })
}

async function search(id1, id2) {
    console.log('search ' + id1 + ' ' + id2);

    const map1 = {};
    const map2 = {};

    let middle = null;
    
    const queue1 = [];
    const queue2 = [];
    
    queue1.push(id1);
    queue2.push(id2);

    map1[id1] = -1;
    map2[id2] = -1;

    mitm:
    while (queue1.length > 0 && queue2.length > 0) {
        const cur = (queue1.length <= queue2.length) ? queue1 : queue2;

        let cnt = cur.length;
        while (cnt-- > 0) {
            const id = cur.shift();

            console.log('id ' + id);

            if (map1[id] && map2[id]) {
                middle = id;
                break mitm;
            }

            const info = await getInfo(id);
            for (let i = 0; i != info.friends.length; ++i) {
                const toIndex = info.friends[i];
    
                if (map1[id] && !map1[toIndex]) {
                    map1[toIndex] = id;
                    cur.push(toIndex);
                }
    
                if (map2[id] && !map2[toIndex]) {
                    map2[toIndex] = id;
                    cur.push(toIndex);
                }

                if (map1[toIndex] && map2[toIndex]) {
                    middle = toIndex;
                    break mitm;
                }
            }
        }
    }

    if (!middle) {
        return {
            list: [],
            comment: "Way doesn't exist"
        }
    }

    console.log('middle ' + middle);

    let reverse = [];
    let it = middle;
    while (it != -1) {
        reverse.push(it);
        it = map1[it];
    }

    let way = reverse;
    way.reverse();

    it = map2[middle];
    while (it != -1) {
        way.push(it);
        it = map2[it];
    }

    const usersPath = (await api.users.get(way)).response;

    return {
        list: usersPath,
        comment: "Path length: " + way.length + " persons"
    }
}

module.exports = search;