/** @param {NS} ns */

import { servers, doorcrasher, merge_array, hackInfo, blank, get_log_size, cap_threads_ram, needs_prep, has_enough_ram } from "/utils/libs/commonlib.js";

const min_ram = 16;
const keep_home_ram = 512;
const keep_ram_percent = 5;
//const max_batches_total = 100;
//const max_batches_server = 20;
//const min_sec_between_batch = 30;
const buffer_delay = 500;
const undead_port = 20;
const send_port = 19;
let prepping = [];

const scriptloc = "/utils/single/"; // replace with "/" if not in a folder
const growit = scriptloc + "grow.js";
const hackit = scriptloc + "hack.js";
const weakenit = scriptloc + "weak.js";

export async function main(ns) {
    ns.disableLog("ALL"); ns.clearLog();
    let logsize = get_log_size(40, 8, ns.ui.getStyles().lineHeight);
    //    ns.resizeTail(logsize[0], logsize[1]);
    const use_servs = await ns.prompt("Which servers do you want to use?", { type: "select", choices: ["Home", "Bought", "Owned", "Hacked", "All"] });
    let prep_ram = await ns.prompt("How many GB of RAM should be the maximum per prep cycle?", { type: "text" });
    if (prep_ram == null || prep_ram < 8 || prep_ram == "") prep_ram = 8;
    const costs = { "growy": ns.getScriptRam(growit), "hacky": ns.getScriptRam(hackit), "weak": ns.getScriptRam(weakenit) };
    const murder_port = ns.getPortHandle(send_port);
    let clean = false;
    let cycle = 11;
    let waiting = 0;
    let batch = 0;
    //    while (!clean) {ns.tryWritePort(send_port, "reset"); clean = true;}
    //    await ns.sleep(30000);
    //if (murder_port.peek() == "reset") { ns.clearPort(send_port) };

    let batches = 0; // set this based on time so it finishes 1/min or 2/min?

    let own_servs = ns.getPurchasedServers();
    let usable = [];
    let targets = [];
    let prep = false;
    let use_hacked = false;
    let use_own = false;
    if (own_servs.length > 0 && (use_servs == "Bought" || use_servs == "Owned" || use_servs == "All")) merge_array(usable, own_servs);
    if (use_servs == "Hacked" || use_servs == "All") use_hacked = true;
    if (use_servs == "Home" || use_servs == "All") usable.push("home");

    if (use_own) merge_array(usable, own_servs);
    if (prepping.length > 0) {
        merge_array(targets, prepping);
        prepping = [];
    }

    ns.tail();

    for (let dest of usable) ns.scp([growit, hackit, weakenit], dest, "home");

    while (true) {
        if (cycle > 10) {
            display_info();
            cycle = 0;
            doorcrasher(ns);
            for (let serv of servers) {
                if (!ns.fileExists(growit, serv)) ns.scp(growit, serv, "home");
                if (!ns.fileExists(hackit, serv)) ns.scp(hackit, serv, "home");
                if (!ns.fileExists(weakenit, serv)) ns.scp(weakenit, serv, "home");
                if (ns.getServerMaxRam(serv) > min_ram && ns.hasRootAccess(serv)) {
                    if (use_hacked) usable.push(serv);
                    if (ns.getServerMaxMoney(serv) > 0 && !targets.includes(serv) && !prepping.includes(serv)) targets.push(serv);
                }
            }
        }
        cycle++
        targets = ["the-hub"];

        if (targets.length > 0) {
            targets = sort_weights(ns, targets);
            for (let serv of targets) {
                let target_info = hackInfo(ns, serv);
                let batch_ram_needed = batch_cost(target_info.threads, costs);
                let host = await findBatchOpening(ns, usable, batch_ram_needed);
                if (host != false && !needs_prep(target_info) && (waiting == 0 || waiting > 30000)) {
                    await runBatch(ns, host, serv, target_info, batch, Math.max(1, prep_mult * Math.ceil((ns.getHackingLevel()) / target_info.times.hacky * 100)));
                    ns.print("Attack batch run on: " + serv + ".");
                    batches++;
                }
                else if (needs_prep(target_info)) {
                    host = "home";//await findBatchOpening(ns, usable, prep_ram);
                    if (host == false) { waiting = 30000 }
                    else {
                        let prep_threads_weak = cap_threads_ram(target_info.prep.weak, prep_ram, costs.weak);
                        let prep_threads_grow = cap_threads_ram(target_info.prep.growy, prep_ram, costs.growy);
                        ns.print("Prepping " + serv + " from " + host + ".  Threads:  W:" + prep_threads_weak + "  G:" + prep_threads_grow);
                        let save_ram = 0;
                        if (host == "home") save_ram = keep_home_ram; else save_ram = ns.getServerMaxRam(serv) * ((100 - keep_ram_percent) / 100);
                        if (prep_threads_weak > 0) {
                            targeted_attack(ns, "weaken", host, prep_threads_weak, serv, 0, 0, 19, 999999999, 1);
                            if (!prepping.includes(serv)) prepping.push(serv);
                            if (targets.includes(serv)) targets.splice(targets.indexOf(serv), 1);
                        }
                        let temp_pid = ns.getRunningScript(growit, serv, prep_threads_grow, serv, 0, 0, 19, 999999999, 1);
                        let temp_enough = has_enough_ram(ns, ns.getServerMaxRam(host) - ns.getServerUsedRam(host), prep_threads_grow, costs.growy, save_ram);
                        let temp_ratio = target_info.stats.money_ratio;
                        ns.tprint(temp_ratio);
                        ns.tprint("Vars to check to launch grow thread: ", temp_pid, ", ", temp_enough, ", ", temp_ratio);
                        ns.tprint("$: ", target_info.stats.current_money, "/", target_info.stats.max_money); await ns.sleep(5000);
                        //                        ns.print("pid: ",temp_pid, "  threads: ", prep_threads_grow, "  costs.growy: ", costs.growy, "  save_ram: ", save_ram,"  enough: ",temp_enough);ns.exit();
                        if (temp_pid == null && temp_enough && target_info.stats.current_money / target_info.stats.max_money < 0.9) {
                            targeted_attack(ns, "grow", host, prep_threads_grow, serv, 0, 0, 19, 999999999, 1);
                            prepping.push(serv);
                            targets.splice(targets.indexOf(serv), 1);
                        } ns.exit();
                    }
                }
            }
            waiting = 30000;
        }
        if (Math.random() > 0.95) {
            for (let serv of prepping)
                if (!(ns.getServerSecurityLevel(serv) - ns.getServerMinSecurityLevel(serv) > 3) || !(ns.getServerMaxMoney(serv) / ns.getServerMoneyAvailable(serv) < 0.55)) {
                    targets.push(serv);
                    prepping.splice(prepping.indexOf(serv), 1);
                }

            if (targets.length > 0) targets = sort_weights(ns, targets);
        }
        await ns.sleep(1000);
        if (waiting != 0) {
            waiting -= 1000;
            if (waiting < 0) waiting = 0;
        }
        //        ns.exit();
    }


    function display_info() {
        ns.ui.clearTerminal();
        ns.tprintf("%s", "\n\n");
        ns.tprintf("%s", "Running hack manager by Shard, V0.1");
        ns.tprintf("%s", "Current settings:");
        ns.tprintf("%s", "Batches: " + batch);
        ns.tprintf("%s", "\n");
        ns.tprintf("%s", "Targets: " + targets);
        ns.tprintf("%s", "\n");
        ns.tprintf("%s", "Prepping: " + prepping);
        ns.tprintf("%s", "minimum ram: " + min_ram);
        ns.tprintf("%s", "Keeping home:" + ns.formatNumber(keep_home_ram) + " of RAM   Other:" + keep_ram_percent + "% of RAM");
        ns.tprintf("%s", "Current batches: " + batches + " using Port: " + undead_port);
    }

}

export async function runBatch(ns, host, serv, hack_info, batch, repeats, prep) {
    if (!prep) {
        targeted_attack(ns, "hack", host, hack_info.threads.hacky, serv, hack_info.delays.hacky, 0, 19, batch, repeats);
        await ns.sleep(buffer_delay);
        targeted_attack(ns, "weaken", host, hack_info.threads.weaken1, serv, 0, 0, 19, batch, repeats);
        await ns.sleep(buffer_delay);
        targeted_attack(ns, "grow", host, hack_info.threads.growy, serv, hack_info.delays.growy, 0, 19, batch, repeats);
        await ns.sleep(buffer_delay);
        targeted_attack(ns, "weaken2", host, hack_info.threads.weaken2, serv, 0, 0, 19, batch, repeats);
    } else {
        targeted_attack(ns, "weaken", host, hack_info.prep.weak, serv, 0, 0, 19, -1, 1);
        await ns.sleep(buffer_delay);
        targeted_attack(ns, "grow", host, hack_info.prep.growy, serv, hack_info.delays.growy, 0, 19, -1, 1);
    }
    // targeted_attack(ns, type, source, threads, target, delay, report_port, listen_port, batch, repeats) 
}

export async function findBatchOpening(ns, usable, batch_ram_needed) {
    for (let server of usable) {
        let serv_ram = 0;
        if (server == "home") serv_ram = serv_ram = ns.getServerMaxRam("home") - keep_home_ram - ns.getServerUsedRam("home");
        else serv_ram = ns.getServerMaxRam(server) / ((100 - keep_ram_percent) / 100) - ns.getServerUsedRam(server);
        //        ns.print("Checking ", server, " for ", ns.formatRam(batch_ram_needed), " and has ", ns.formatRam(serv_ram), "."); await ns.sleep(500);
        if (serv_ram > batch_ram_needed) return server;
    }
    return false;
}

function targeted_attack(ns, type, source, threads, target, delays, report_port, listen_port, batch, repeats) {
    const growit = "/utils/single/grow.js"
    const hackit = "/utils/single/hack.js";
    const weakenit = "/utils/single/weak.js";
    if (threads >= 0) { } else { ns.tail(); ns.print("ERROR: threads - ", threads); return; }

    let script = "";

    let ramcost = 0
    switch (type) {
        case "grow":
        case "growy":
            script = growit;
            ramcost = ns.getScriptRam(growit);
            break;
        case "hack":
        case "hacky":
            script = hackit;
            ramcost = ns.getScriptRam(hackit);
            break;
        case "weak":
        case "weaken":
        case "weaken1":
        case "weaken2":
            script = weakenit;
            ramcost = ns.getScriptRam(weakenit);
            break;
        default:
            ns.exit();
    }
    //    ns.print("Running attack: ", type, "   threads: ", threads, "   RAM: ", ns.formatRam((threads + 0.00001) * ramcost))
    //        ns.print(script, ",", source, ",", threads, ",", target, ",", delays, ",", report_port, ",", listen_port, ",", batch, ",", repeats, ",", type);
    //    ns.tprint(script, " ", source, " ", threads, " ", target, " ", delays, " ", report_port, " ", listen_port, " ", batch, " ", repeats);
    ns.exec(script, source, threads, target, delays, report_port, listen_port, batch, repeats, type);
}

function batch_cost(threads, costs) {
    const grow_cost = threads.growy * costs.growy;
    const hack_cost = threads.hacky * costs.hacky;
    const weaken_cost1 = threads.weaken1 * costs.weak;
    const weaken_cost2 = threads.weaken2 * costs.weak;

    const total_cost = grow_cost + hack_cost + weaken_cost1 + weaken_cost2;

    return total_cost;
}

function sort_weights(ns, list) {
    let sortlist = list;
    let best = "";
    let bestweight = 0;
    let weightlist = [];
    let returnlist = [];
    for (let item of list) {
        let tempdata = hackInfo(ns, item);
        weightlist.push(tempdata.weight);
        //    ns.tail();ns.clearLog();ns.print("weightlist:");ns.print(weightlist);blank(1);
    }
    while (true) {
        for (let place in sortlist) {
            if (weightlist[place] > bestweight) {
                bestweight = weightlist[place];
                best = sortlist[place];
            }
        }
        let i = sortlist.indexOf(best);
        returnlist.push(best);
        sortlist.splice(i, 1);
        weightlist.splice(i, 1);
        //            ns.print("Sortlist:");ns.print(sortlist);ns.print("Best: " + best + " with " + bestweight);blank(2);
        bestweight = 0;
        if (sortlist.length == 0) break;
    }
    return returnlist;
}