/** @param {NS} ns */
import {servers} from "./libs/shard/free.js";

export async function main(ns) {

let servs = servers;
let owned = ns.getPurchasedServers()

merge_array(servs, owned);

for (let serv of servs) {
    if (ns.hasRootAccess(serv)) {
        ns.killall(serv)
    }
}
}


function merge_array(dest, source){
    while (source.length > 0){
        let temp = source.shift()
        if (!dest.includes(temp)) dest.push(temp)
    }
    return dest
}