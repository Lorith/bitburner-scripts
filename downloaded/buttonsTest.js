/** @param {NS} ns */
/** @param {import('../.').NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    let g_sets = { //variables to be controlled with buttons
        var1: true,
        var2: true,
        var3: true
    };

    ns.tail();
    while (1) {
        ns.clearLog();
        g_sets = readFromJSON(ns, "g_settings_test.txt");
        ns.print("var1: " + g_sets.var1);
        ns.print("var2: " + g_sets.var2);
        ns.print("var3: " + g_sets.var3);
        if (g_sets.var1) ns.tprint("var1 is on");
        if (g_sets.var2) ns.tprint("var2 is on");
        if (g_sets.var3) ns.tprint("The thing is on");
        await writeToJSON(ns, g_sets, "g_settings_test.txt");
        await ns.sleep(1000);
    }
}


export function readFromJSON(ns, filename = "/test/jsontest.txt") {
	return JSON.parse(ns.read(filename));
}

export async function writeToJSON(ns, jsonObject, filename = "/test/jsontest.txt") {
	await ns.write(filename, JSON.stringify(jsonObject), "w");
}