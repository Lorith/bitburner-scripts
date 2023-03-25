/** @param {NS} ns */
import { get_max_threads, servers } from "/libs/shard_lib.js";

export async function main(ns) {
    const debug = false;
    const single_server_per_hack = true;

    var targets = servers;
    var confirmed_targets = [];
    var hacktargs = [];
    var total_ram = 0;
    var total_threads = 0;
    var threads_per_hack = 0;
    var threads_needed_for_hacktarg = 0;
    const min_ram = 16;
    const save_ram = 4;
    const save_ram_self = 256;
    const copy = "/utils/const/autohack.js";
    const running = "/utils/single/setup-serv.js";
    const cost = ns.getScriptRam("/utils/const/autohack.js");
    const cost_self = ns.getScriptRam("/utils/single/setup-serv.js");
    const own_servs = ns.getPurchasedServers();
    const self = ns.getHostname();
    var own_only = false;
    const max_money_needed = 500000;


    if (min_ram < save_ram + cost) {
        ns.tprint("Error: Cannot run within the minimum usable RAM.  Increase minimum, or decrease saved.");
        ns.exit();
    }

    if (ns.args.length != 0) {
        if (ns.args[0] == "own") own_only = true;
        if (ns.args[1] == "home") confirmed_targets.push("home");
    }
    else {
        own_only = await ns.prompt("Only run on owned servers?");
    }

    addcontents(targets, own_servs);


    // check if target has enough RAM to pass min requirements and has/can get root access
    for (let targ of targets) {
        var root = ns.hasRootAccess(targ);
        if (root == false && ns.getServerRequiredHackingLevel(targ) <= skill) {
            root = crackit(ns, targ);
        }
        if (root == true && ns.getServerMaxRam(targ) >= min_ram) {
            confirmed_targets.push(targ);
        }
        if (root == true && ns.getServerMaxMoney(targ) >= max_money_needed) {
            hacktargs.push(targ)
        }
    }

    if (ns.args.length == 1 && ns.args[0] != "all" && ns.args[0] != "own") {
        confirmed_targets = [ns.args[0]];
    }

    if (own_only) {
        confirmed_targets = own_servs;
    }
    //ns.tprint(targets,"\n\n\n",confirmed_targets);ns.exit();
    if (single_server_per_hack) {
        var temp1 = hacktargs;
        var temp2 = [];
        var highest = "";
        var val = 0;
        while (temp1.length > 0) {
            for (let serv of temp1) {
                var tempmon = ns.getServerMaxMoney(serv);
                if (tempmon > val) {
                    highest = serv;
                    val = tempmon;
                }
            }
            temp2.push(highest);
            val = 0;
            temp1.splice(temp1.indexOf(highest), 1);
        }
        val = 0;
        hacktargs = temp2;
        temp1 = confirmed_targets;
        temp2 = [];
        while (temp1.length > 0) {
            for (let serv of temp1) {
                var tempram = ns.getServerMaxRam(serv);
                if (tempram > val) {
                    highest = serv;
                    val = tempram;
                }
            }
            val = 0;
            temp2.push(highest);
            temp1.splice(temp1.indexOf(highest), 1);
        }
        confirmed_targets = temp2;
        for (let i = 0; i < confirmed_targets.length; i++) {
            ns.scp(copy, confirmed_targets[i]);
            ns.scp("/utils/const/const_weaken.js", confirmed_targets[i]);
            ns.scriptKill("/utils/const/autohack.js", confirmed_targets[i]);
            ns.scriptKill("/utils/const/const_weaken.js", confirmed_targets[i]);
            var usableram = ns.getServerMaxRam(String(confirmed_targets[i])) * 0.95;
            var threadcount = get_max_threads(cost, usableram);
            if (i < hacktargs.length) {
                ns.exec(running, self, 1, String(confirmed_targets[i]), String(hacktargs[i]), threadcount);
            } else {
                threadcount = get_max_threads(1.75, usableram);
                ns.exec("utils/const/const_weaken.js", String(confirmed_targets[i]), threadcount, "n00dles");
            }
        }
        ns.exit();
    }

    for (let targ of confirmed_targets) {
        total_ram += ns.getServerMaxRam(targ) - save_ram;
    }

    total_threads = Math.max(Math.floor(total_ram / cost), 0);
    if (total_threads == 0) {
        ns.tprint("Error: total threads = 0");
        ns.exit();
    }
    threads_per_hack = Math.max(Math.floor(total_threads / hacktargs.length), 1);
    threads_needed_for_hacktarg = threads_per_hack;
    if (debug) { ns.tprint("per_hack: ", threads_per_hack); }

    // run on confirmed servers
    for (let targ of confirmed_targets) {
        ns.scriptKill("/utils/const/autohack.js", targ);
        await ns.sleep(500);
        if (debug) { ns.tprint("Before usable threads check for ", targ, "."); }
        var usable_threads = possible_threads_on_server(targ);
        if (debug) { ns.tprint("After usable threads check."); }
        ns.scp(copy, targ);
        while (usable_threads > 0) {
            if (threads_needed_for_hacktarg > 0) {
                var updated = false;
                while (updated == false) {
                    if ((ns.getServerMaxRam(self) - ns.getServerUsedRam(self)) > cost_self + save_ram_self) {
                        const usable = Math.min(usable_threads, threads_needed_for_hacktarg);
                        if (debug) { ns.tprint("usable: ", usable); }
                        if (debug) { ns.tprint("usable threads: ", usable_threads); }
                        ns.exec(running, self, 1, targ, String(hacktargs[0]), usable);
                        threads_needed_for_hacktarg -= usable;
                        updated = true;
                        usable_threads -= usable;
                        if (debug) { ns.tprint("Hacktargs: ", hacktargs); }
                        if (debug) { ns.tprint("Threads_needed_for_hacktarg: ", threads_needed_for_hacktarg); }
                        if (debug) { ns.tprint("usable threads: ", usable_threads); }
                        if (debug) { ns.tprint("usable: ", usable); }
                        if (threads_needed_for_hacktarg <= 0) { hacktargs.splice(0, 1); threads_needed_for_hacktarg = threads_per_hack; }
                        if (debug) { ns.tprint("Hacktargs: ", hacktargs); }
                        if (debug) { ns.tprint("Threads_needed_for_hacktarg: ", threads_needed_for_hacktarg); ns.tprint("Exiting exec section."); }
                    }
                    else {
                        await ns.sleep(1000);
                    }
                }
            }
            else {
                threads_needed_for_hacktarg = threads_per_hack;
                hacktargs.pop();
            }
        }
    }

    function addcontents(target, source) {
        for (let targ of source) {
            target.push(targ);
        }
    }

    function rand(min, max) {
        return Math.floor((Math.random() * (max - min + 1)) + min)
    }

    function possible_threads_on_server(server) {
        var max = ns.getServerMaxRam(server);
        var free = max - ns.getServerUsedRam(server);
        if (debug) { ns.tprint("RAM on server: ", free, "/", max); }
        if (debug) { ns.tprint("calc: ", free - save_ram, " then ", Math.floor((free - save_ram) / cost)); }
        return (Math.max(Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server) - save_ram) / cost), 0));
    }

}

export function crackit(ns, targ) {
    const available_ports = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"].filter(file => ns.fileExists(file, "home"))
    available_ports.map(program => eval('ns.${program}.split(".exe")[0].toLowerCase()}(targ)'))
    if (ns.getServerNumPortsRequired(targ) <= ports) ns.nuke(targ);
    return ns.hasRootAccess(targ);
}