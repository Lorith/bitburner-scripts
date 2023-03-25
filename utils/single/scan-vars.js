export function autocomplete(data, args){
    return [...data.servers];
}

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.tail();
    ns.clearLog();
    const target = ns.args[0];
    const money = ns.formatNumber(ns.getServerMoneyAvailable(target)) + " money from max of " + ns.formatNumber(ns.getServerMaxMoney(target));
    const sec = ns.formatNumber(ns.getServerSecurityLevel(target)) + " security with a minimum of " + ns.getServerMinSecurityLevel(target);
    ns.print(target, ":");
    ns.print("  " , money);
    ns.print("  ", sec);
    ns.print("grow time: ", ns.getGrowTime(target));
    ns.print("hack time: ", ns.getHackTime(target));
    ns.print("weaken time: ", ns.getWeakenTime(target));
    ns.print("  Connected servers: ", ns.scan(target));
    
}