import { servers } from "/libs/shard/free.js"
/** @param {NS} ns */
export async function main(ns) {
    let targets = [];
    for (let serv of servers) {
        if (ns.getServerMaxMoney(serv) > 0 && ns.hasRootAccess(serv)) { targets.push(serv); }
    }
    let threads = 0;
    for (; ;) {
        for (let targ of targets) {
            threads = Math.floor(ns.hackAnalyzeThreads(targ, ns.getServerMoneyAvailable(targ)));
            let freeRam = ns.getServerMaxRam("home") - ns.getServerUsedRam("home");
            if (threads > freeRam) {
                threads = Math.floor(freeRam / 1.75);
            }
            if (threads > 0) ns.exec("/unihack.js", "home", threads, "--type", "hack", "--target", targ);
            await ns.sleep(500);
        }
    }
}