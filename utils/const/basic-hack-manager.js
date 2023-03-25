import { cap_threads_ram, get_max_threads, servers } from "/libs/shard/free"
const security_per_hack = 0.002;
const security_loss_per_weaken = 0.05

const debug = false;
const debug_full = false;
let run_hacks = false;

/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL");
    ns.exec("/utils/single/doorcrasher.js", "home");
    ns.tail();
    await ns.sleep(1000);
    let hosts = [];
    let targets = [];
    //let ongoing = {};

    // sort out flags here, and set these from flags
    const keep_home_ram = 128;
    const keep_ram_percent = 5 / 100;
    const hack_script = "unihack.js";
    const grow_script = "unihack.js";
    const weaken_script = "unihack.js";
    const from_home = true;
    const owned_servers = false;
    const wild_servers = false;
    const port = 20;

    //const servs = ["n00dles", "joesguns", "foodnstuff"];
    if (debug) ns.print(`Before update.`)
    const servs = servers;
    //    let sorted_max = sort_max_ram(ns, servers);
    //    let sorted_free = sort_free_ram(ns, servers);
    updateSettings(ns);
    if (debug) ns.print(`After update.`)

    let loops = 0
    while (true) {
        if (debug) ns.print("Looping.  Targets: ", targets)
        hosts = []
        targets = []
        loops++
        if (debug) ns.print(`Loop: ${loops}\n`);
        if (loops > 50) { loops = 0;updateSettings(ns); ns.exec("/utils/single/doorcrasher.js", "home"); }

        if (!run_hacks) {await ns.sleep(3000);loops+=10;continue;}
        await ns.sleep(1000);
        for (let serv of servs) {
            let data = ns.getServer(serv);
            if ((data.hostname == "home" && from_home) || (data.purchasedByPlayer == true && owned_servers && data.hostname != "home") || (data.purchasedByPlayer == false && wild_servers == true)) {
                hosts.push(serv);
                install_scripts(ns, grow_script, hack_script, weaken_script, serv);
            }
            if (data.moneyMax > 100 && data.hasAdminRights && data.minDifficulty <= ns.getHackingLevel()) targets.push(serv)//(ns.getHackingLevel() / 2)+1) targets.push(serv);
        }
        for (let target of targets) {
            let threads = 0;
            let targ = ns.getServer(target);
            let hostserv = ns.getServer("home");
            let needprep = needs_prep(targ);
            if (debug) ns.print(`\nCurrently considering ${target}.  Does it need prep: ${needprep}.`);
            if (debug && debug_full) ns.print(targ);
            //temp, fix later
            const host = "home";
//            const free_ram = ns.getServerMaxRam(host) - ns.getServerUsedRam(host) - (ns.getHostname == "home" ? keep_home_ram : keep_ram_percent * ns.getServerMaxRam(host));
            if (needprep == false) {
                threads = cap_threads_ram(get_hack_threads(ns, targ, 0.5, "current"),get_usable_ram(hostserv), 1.75);
                if (threads > 0) ns.exec(hack_script, host, threads, "--type", "hack", "--target", targ.hostname);
                if (debug) ns.print(`Attempting to hack ${target} with ${threads} threads.`)
            } else if (needprep == "weaken") {
                threads = cap_threads_ram(get_weaken_threads(targ, "all"),get_usable_ram(hostserv), 1.75);
                if (threads > 0) ns.exec(weaken_script, host, threads, "--type", "weaken", "--target", targ.hostname);
                if (debug) ns.print(`Attempting to weaken ${target} with ${threads} threads.`)
            } else if (needprep == "grow") {
                threads = cap_threads_ram(get_grow_threads(ns, targ, "all"),get_usable_ram(hostserv), 1.75);
                if (threads > 0) ns.exec(grow_script, host, threads, "--type", "grow", "--target", targ.hostname, "--stocks", "false");
                if (debug) ns.print(`Attempting to grow ${target} with ${threads} threads.`)
                //grow here                
            } else {
                ns.print(`For some reason it isn't targeting properly at all.`);
            }
            if (debug) ns.print(`Ram cost for operation: ${ns.formatRam(threads * 1.75)}.`);
            await ns.sleep(500);
        }
    }


    ns.exit(); // just to make sure it doesn't get to the functions that need access to our vars
    ns.exec(); // just here to get the ram cost shown
    function get_usable_ram(serv) {
        if (serv.hostname == "home") return Math.floor(serv.maxRam - serv.ramUsed - keep_home_ram);
        else return Math.floor((serv.maxRam * (1 - keep_ram_percent)) - serv.ramUsed);
    }
}


function find_smallest_host(ns, serv_list, threads, thread_cost) {
    const min_ram = threads * thread_cost;
    let smallest = "";
    let min = 1e40; // if you have servers with more than this... Good job?
    let usable = 0;
    let data = null;
    for (let serv of serv_list) {
        data = ns.getServer(serv);
        usable = get_usable_ram(data);
        if ((usable >= min_ram) && (usable < min)) { min = usable; smallest = serv; }
    }
    return smallest;
}


function install_scripts(ns, g, h, w, serv) {
    if (serv == "home") return;
    if (g == h == w) ns.scp(h, serv, "home");
    else ns.scp([g, h, w], serv, "home");
}
/*
function sort_free_ram(ns, input_array) {
    let in_best = "";
    let in_score = 0;
    let sorted = [];
    while (input_array.length > 0) {
        for (let x of input_array) {
            let free_ram = ns.getServerMaxRam(x) - ns.getServerUsedRam(x);
            if (free_ram > in_score) {
                in_best = x;
                in_score = free_ram;
            }
        }
        sorted.push(in_best);
        input_array.splice(input_array.indexOf(in_best), 1);
        in_score = 0;
    }
    return sorted;
}


function sort_max_ram(ns, input_array) {
    let in_best = "";
    let in_score = 0;
    let sorted = [];
    while (input_array.length > 0) {
        for (let x of input_array) {
            let max = ns.getServerMaxRam(x);
            if (max > in_score) {
                in_best = x;
                in_score = max;
            }
        }
        sorted.push(in_best);
        input_array.splice(input_array.indexOf(in_best), 1);
        in_score = 0;
    }
    return sorted;
}
*/
function needs_prep(serv) {
    if ((serv.hackDifficulty - serv.minDifficulty) > 30) return "weaken";
    if ((serv.moneyAvailable / serv.moneyMax) < 0.95) return "grow";
    return false;
}

function get_grow_threads(ns, serv, percent) {
    let threads = 0;
    if (percent == "all" || percent == "full") percent = 1.05 * (serv.moneyMax / serv.moneyAvailable);
    threads = ns.growthAnalyze(serv.hostname, percent);
    return Math.ceil(threads);
}

function get_hack_threads(ns, serv, percent, type = "current") {
    let threads = 0;
    if (percent == "all" || percent == "full") percent = 1;
    if (type == "current") threads = ns.hackAnalyzeThreads(serv.hostname, serv.moneyAvailable * percent);
    else threads = ns.hackAnalyzeThreads(serv.hostname, serv.moneyMax * percent);
    return Math.floor(threads);
}

function get_weaken_threads(serv, amount) {
    if (amount == "all" || amount == "full") amount = serv.hackDifficulty - serv.minDifficulty;
    return Math.ceil(amount / security_loss_per_weaken);
}



export function readFromJSON(ns, filename = "/test/jsontest.txt") {
	return JSON.parse(ns.read(filename));
}

function updateSettings(ns) {
    let g_sets = readFromJSON(ns, "/data/g_settings_test.txt");
    run_hacks = g_sets.run_hacks;
}