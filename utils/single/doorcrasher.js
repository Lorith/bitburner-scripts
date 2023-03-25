import {servers} from "/libs/shard/free.js"

/** searches for servers and smashes them all, if possible.
 * @param {NS} ns */
export async function main(ns) {
    let retval = [];
    for (let serv of servers) {
        if (ns.hasRootAccess(serv)) {
            retval.push(serv);
        } else {
            if (await crackit(ns, serv)) {
                retval.push(serv);
            }
        }
    }
    return retval;
}
// ns.exec()
export async function crackit(ns, targ) {
    const available_ports = ["BruteSSH.exe","FTPCrack.exe","relaySMTP.exe","HTTPWorm.exe","SQLInject.exe"].filter(file => ns.fileExists(file, "home"));
    available_ports.map(program => eval(`ns.${program.split(".exe")[0].toLowerCase()}(targ)`));
    await ns.sleep(100);
    if (ns.getServerNumPortsRequired(targ) <= available_ports.length) ns.nuke(targ);
    return ns.hasRootAccess(targ);
    ns.getServer();
}