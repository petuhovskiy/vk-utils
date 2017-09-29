const api = require('./api')
const _ = require('underscore')

const getInfo = (id) => {
    return api.friends.get(id)
        .then(x => {
            return x.response;
        })
        .then(x => {
            return {
                id: id,
                friends: x.items,
                count: x.count
            }
        })
}

async function search(id1, id2) {

    const map = {};
    let middle = null;
    const queue1 = [];
    const queue2 = [];

    queue1.push(id1);
    queue2.push(id2);

    map[id1] = {x: '', y: null};
    map[id2] = {x: null, y: ''};
    
    mitm:
    while (queue1.length > 0 && queue2.length > 0) {
        const cur = (queue1.length < queue2.length) ? queue1 : queue2;

        let cnt = cur.length;
        while (cnt-- > 0) {
            const id = cur.shift();
            let t = map[id];
            if (t.x != null && t.y != null) {
                middle = id;
                break mitm;
            }

            let leave = false;

            const info = await getInfo(id);
            for (let i = 0; i != info.friends.length; ++i) {
                const toIndex = info.friends[i];

                if (!map[toIndex]) {
                    map[toIndex] = {x: null, y: null};
                }
    
                const to = map[toIndex];
    
                if (t.x != null && to.x == null) {
                    to.x = id;
                    cur.push(toIndex);
                }
    
                if (t.y != null && to.y == null) {
                    to.y = id;
                    cur.push(toIndex);
                }
                
                if (to.x != null && to.y != null) {
                    middle = toIndex;
                    break mitm;
                }
            }
        }
    }

    if (middle == null) {
        return {
            list: [],
            comment: "Way doesn't exist"
        }
    }

    let reverse = [];
    let it = middle;
    while (it != '') {
        reverse.push(it);
        it = map[it].x;
    }

    let way = reverse;
    way.reverse();

    it = map[middle].y;
    while (it != '') {
        way.push(it);
        it = map[it].y;
    }

    const usersPath = (await api.users.get(way)).response;

    return {
        list: usersPath,
        comment: "Path length: " + way.length + " persons"
    }
}

module.exports = search;