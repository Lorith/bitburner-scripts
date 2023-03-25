/** @param {NS} ns */
export async function main(ns) {
    let owned = []
    const save_home = Math.pow(2, 14);
    const sharescript = "/utils/const/share.js"
    while (true) {
        owned = ns.getPurchasedServers();
        owned.push("home")
        for (let serv of owned) {
            ns.scp(sharescript, serv, "home");
            let free = 0;
            if (serv == "home") free = ns.getServerMaxRam("home") - save_home - ns.getServerUsedRam("home");
            else {
                ns.killall(serv);
                free = ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv);
            }
            let threads = Math.floor(free / ns.getScriptRam(sharescript));
            if (threads > 0) ns.exec(sharescript, serv, threads);
        }
        await ns.sleep(300000);
    }
}