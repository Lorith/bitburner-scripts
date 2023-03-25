/** @param {NS} ns */
export async function main(ns) {
    let mode = 0;
    const basiclimits = { "servers": 8, "levels": 13 };
    const limits = { "servers": 18 };
    if (ns.args[0] == "basic") { mode = 1; }

    let hitlimits = false;
    //ns.tprint(false+true);ns.exit();
//try_hnet_buy(ns,1);ns.exit();
    while (true) {
        let upgrade = try_hnet_upgrade(ns, mode);
        let buy = try_hnet_buy(ns, mode);
        if (upgrade == true && buy == true) hitlimits = true;
        if (hitlimits != false) ns.exit();
        await ns.sleep(5000);
    }

    function try_hnet_buy(ns, mode = 0) {//ns.tprint(ns.hacknet.numNodes());ns.exit();
        if (!(ns.hacknet.numNodes() >= limits.servers && mode === 0) || !(ns.hacknet.numNodes() >= basiclimits.servers && mode === 1)) {
            try { ns.hacknet.purchaseNode(); } catch { }
        } else return true;
    }

    function try_hnet_upgrade(ns, mode = 0) {
        let count = 0;
        let cycles = 25;
        const nodes = ns.hacknet.numNodes()
        while (cycles > 0) {
            cycles--
            for (let node = 0; node < nodes; node++) {
                if (count >= basiclimits.servers && mode === 1) return true;
                let stats = ns.hacknet.getNodeStats(node)
                if ((mode === 1 && stats.level >= basiclimits.levels) || (stats.level == 200 && stats.cores == 16 && stats.ram == 64)) {
                    count++; continue;
                }
                try { ns.hacknet.upgradeLevel(node, 1) } catch { }

                if (cycles == 15 || cycles == 5) try { ns.hacknet.upgradeRam(node, 1) } catch { }
                if (cycles == 1) try { ns.hacknet.upgradeCore(node, 1) } catch { }
            }
            if (count == ns.hacknet.maxNumNodes) return true;
        }
    }
}