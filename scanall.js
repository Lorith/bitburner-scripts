/** @param {NS} ns */
export async function main(ns) {
    ns.rm("/data/server_list.txt");
    for (let x of scanall(ns).keys()) {
        ns.write("/data/server_list.txt",'"' + x + '",', "a");    
    }
}

function scanall(ns, start_server = "home", dict = new Map()) {
    dict.set(start_server, true);
    for (let serv of ns.scan(start_server)) {
        if (!dict.has(serv)) dict.set(serv, false)
    }
    for (let x of dict.keys()) {
        if (dict.get(x) == false) {
            dict = scanall(ns, x, dict);
            break;
        }
    }
    return dict;
}