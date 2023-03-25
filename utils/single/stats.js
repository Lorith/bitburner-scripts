/** @param {NS} ns */
export async function main(ns) {
    const servers = ns.getPurchasedServers();
    const numservers = servers.length;
    const homecores = ns.getServer("home").cpuCores;
    ns.tprint("Home: ", homecores,  " CPUs", " and ", ns.formatRam(ns.getServerMaxRam("home")), " of RAM.")
    ns.tprint("Servers: ", numservers, "/", ns.getPurchasedServerLimit());
    ns.tprint("Max server RAM: ", ns.formatRam(ns.getPurchasedServerMaxRam()));
    var con_servs = ns.scan("home");
    for (let serv of servers) {
        const targ = con_servs.indexOf(serv);
        con_servs.splice(targ, 1)
    }
    ns.tprint("Servers connected to home: ", con_servs);
    ns.write("/data/my_servers.txt", servers);
}