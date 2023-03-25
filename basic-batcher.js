import { cap_threads_ram, high_money_servers, safePrompt } from "/libs/shard/free.js"

const keep_home_ram = 1276
const keep_ram_percent = 5 / 100

const debug = false
const debug_full = false
let run_hacks = false
const batch_loops = 10
const batch_delay = 200
let batch = 0
let hack_percentage = 5 / 100


/**
 * TODO:
 * utilize ports instead of list of endtimes?
 */



/** @param {NS} ns */
export async function main(ns) {
    ns.disableLog("ALL")
    ns.clearLog()
    ns.exec("/utils/single/doorcrasher.js", "home")
    if (debug || debug_full) ns.tail()
    await ns.sleep(1000)
    let hosts = []
    let targets = []
    const batched = new Map()

    // sort out flags here, and set these from flags
    const hack_script = "unihack.js"
    const grow_script = "unihack.js"
    const weaken_script = "unihack.js"
    const from_home = true
    const owned_servers = true
    const wild_servers = false
    const port = 20
    
    let servs = high_money_servers
    let fails = 0
    servs.push(...ns.getPurchasedServers())
    servs.push("home")
    if (debug) ns.print(`Before update.`)
    updateSettings(ns)
    if (debug) ns.print(`After update.`)

    let loops = 0
    while (true) {
        hosts = []
        targets = []
        loops++
        if (debug) ns.print(`Loop: ${loops}\n`)
        if (loops > 50) {
            loops = 0
            updateSettings(ns)
            ns.exec("/utils/single/doorcrasher.js", "home")
            servs = high_money_servers
            servs.push(...ns.getPurchasedServers())
            servs.push("home")
        }
        if (!run_hacks) { await ns.sleep(3000); loops += 10; continue }
        await ns.sleep(1000 * fails)
        if (fails > 20) fails = 1
        for (let serv of servs) {
            let data = null
            try{
                data = ns.getServer(serv)
            } catch {
                updateSettings(ns)
                ns.exec("/utils/single/doorcrasher.js", "home")
                servs = high_money_servers
                servs.push(...ns.getPurchasedServers())
                servs.push("home")
            }
            if ((data.hostname == "home" && from_home) || (data.purchasedByPlayer == true && owned_servers && data.hostname != "home") || (data.purchasedByPlayer == false && wild_servers == true) && data.hasAdminRights == true && data.maxRam != 0) {
                hosts.push(serv)
                ns.scp("/libs/shard/free.js", serv, "home")
                install_scripts(ns, grow_script, hack_script, weaken_script, serv)
            }
            if (data.purchasedByPlayer == false && data.hostname != "home" && data.moneyMax > 100 && data.hasAdminRights == true && data.requiredHackingSkill >= (ns.getHackingLevel() / 20) && data.requiredHackingSkill <= (ns.getHackingLevel() / 2) + 1) {
                targets.push(serv)
                ns.scp("/libs/shard/free.js", serv, "home")
            }
        if (debug)ns.print(`Targets: ${targets.length}, Batched: ${batched.size}, End: ${targets.length - batched.size}`)
        }
        if (targets.length - batched.size == 0) {
            targets = high_money_servers
            for (let serv of high_money_servers) {
                ns.scp("/libs/shard/free.js", serv, "home")
                install_scripts(ns, grow_script, hack_script, weaken_script, serv)
                if (!ns.hasRootAccess(serv)) targets.splice(targets.indexOf(serv),1)
            }
        }
        if (debug){ns.print(`Targets: ${targets.length}, Batched: ${batched.size}, End: ${targets.length - batched.size}`);ns.exit()}

        if (debug) ns.print("Hosts: ", hosts)
        if (debug) ns.print("Targets: ", targets)

        for (let target of targets) {
            if (target == "home") continue
            let threads = 0
            let targ = ns.getServer(target)
            let needprep = needs_prep(targ)
            let host = false
            if (debug) ns.print(`\nCurrently considering ${target}.  Does it need prep: ${needprep}.`)
            if (debug && debug_full) ns.print(targ)
            let batchdata = get_batch_data(ns, targ, hack_percentage)
            host = find_smallest_host(ns, hosts, batchdata.cost)
            if (host == false) { await ns.sleep(1000); fails++; continue; }
            let hostserv = ns.getServer(host)
            if (needprep == false) {
                if (batched.has(target)){
                    if (ns.getTimeSinceLastAug() > batched.get(target) || typeof(batched.get(target)) != "number") batched.delete(target)
                    else continue
                }
                fails = 0;
                let totalTime = Math.floor(ns.getHackTime() * 4)
                let runningTime = 0
                batch = 0
                while (totalTime > runningTime) {
                    host = find_smallest_host(ns,hosts,batchdata.cost)
                    if (host == false) {await ns.sleep(5000);break}
                    //try {
                    ns.exec(hack_script, host, batchdata.threads.hack, "--type", "hack",
                        "--target", target, "--delay", batchdata.delays.hack, "--loops", batch_loops,
                        "--init_delay", (batch_delay * batch), batch)
                    ns.exec(weaken_script, host, batchdata.threads.weaken1, "--type", "weaken",
                        "--target", target, "--loops", batch_loops, "--init_delay", ((batch_delay * batch) + batch_delay), batch)
                    ns.exec(grow_script, host, batchdata.threads.grow, "--type", "grow",
                        "--target", target, "--delay", batchdata.delays.grow,
                        "--loops", batch_loops, "--init_delay", ((batch_delay * batch) + (batch_delay * 2)), batch)
                    ns.exec(weaken_script, host, batchdata.threads.weaken2, "--type", "weaken",
                        "--target", target, "--loops", batch_loops, "--init_delay", ((batch_delay * batch) + (batch_delay * 3)), batch)
                    //} catch {ns.print(`Error trying to hack ${target} from ${host} with threads: h:${batchdata.threads.hack}, w1:${batchdata.threads.weaken1}, g:${batchdata.threads.grow}, w2:${batchdata.threads.weaken2}`)}
                    batch++
                    runningTime += (batch_delay * 5.5)
                    if (debug) ns.print(`Running: ${runningTime} / ${totalTime}`)
                    await ns.sleep(batch_delay * 4.1)
                }
                let tempval = ns.getTimeSinceLastAug() + (totalTime * batch_loops)
                batched.set(target, tempval)
            } else {
                if (needprep == "weaken") {
                    threads = Math.max(cap_threads_ram(get_weaken_threads(targ, "all"), get_usable_ram(hostserv), 1.75), 1);
                    ns.exec(weaken_script, host, threads, "--type", "weaken", "--target", target);
                    if (debug) ns.print(`Attempting to weaken ${target} with ${threads} threads.`);
                }
                if (needprep == "grow") {
                    if (targ.moneyAvailable > 0) threads = Math.max(cap_threads_ram(get_grow_threads(ns, targ, "all"), get_usable_ram(hostserv), 1.75), 1);
                    else threads = 1000;
                    ns.exec(grow_script, host, threads, "--type", "grow", "--target", target);
                    if (debug) ns.print(`Attempting to grow ${target} with ${threads} threads.`);
                }
            }
            if (debug) ns.print(`Ram cost for operation: ${ns.formatRam(threads * 1.75)}.`);
            await ns.sleep(200);
        }
        await ns.sleep(200);
        if (debug) ns.print("Looping.");
    }

    ns.exit(); // just to make sure it doesn't get to the functions that need access to our vars
    ns.exec(); // just here to get the ram cost shown
}


function get_usable_ram(serv) {
    if (serv.hostname == "home") return Math.floor(serv.maxRam - serv.ramUsed - keep_home_ram);
    else return Math.floor((serv.maxRam * (1 - keep_ram_percent)) - serv.ramUsed);
}

function get_batch_data(ns, serv, percent) {
    const ram_cost = 1.75;
    const serv_id = serv.hostname;
    const hack_to_grow_mult = 3.2;
    const hack_to_weaken_mult = 4;
    const security_per_hack = 0.002;
    const security_per_grow = 0.004;
    const security_loss_per_weaken = 0.05;

    const hacktime = Math.ceil(ns.getHackTime(serv_id));
    const times = {
        "hack": hacktime,
        "grow": Math.ceil(hacktime * hack_to_grow_mult),
        "weaken": Math.ceil(hacktime * hack_to_weaken_mult)
    };
    let threads = {
        "hack": Math.floor(get_hack_threads(ns, serv, percent)),
        "grow": Math.floor(get_grow_threads(ns, serv, percent)),
        "weaken1": 0,
        "weaken2": 0
    };

    threads.weaken1 = Math.ceil(1.05 * (threads.hack * security_per_hack) / security_loss_per_weaken);
    threads.weaken2 = Math.ceil(1.05 * (threads.grow * security_per_grow) / security_loss_per_weaken);

    const total_ram = (threads.hack + threads.grow + threads.weaken1 + threads.weaken2) * ram_cost;

    const retval = {
        "cost": total_ram,
        "delays": {
            "hack": times.weaken - times.hack,
            "grow": times.weaken - times.grow,
        },
        "threads": threads
    };
    return retval;
}

function find_smallest_host(ns, serv_list, cost) {
    let smallest = false;
    let min = 1e40; // if you have servers with more than this... Good job?  Supposed to cap at 2e20 IIRC.
    let usable = 0;
    let data = null;
    if (debug_full) ns.print(`find_smallest_host cost = ${cost}`)
    for (let serv of serv_list) {
        data = ns.getServer(serv);
        usable = get_usable_ram(data);
        if (debug_full) ns.print(`find_smallest_host serv = ${serv}, usable = ${usable}`);
        if ((usable >= cost) && (usable < min)) { min = usable; smallest = serv; }
        if (debug_full) ns.print(`find_smallest_host smallest = ${smallest} at ${ns.formatRam(min)}`);
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
    if ((serv.hackDifficulty - serv.minDifficulty) > 0) return "weaken";
    if ((serv.moneyAvailable / serv.moneyMax) < 1) return "grow";
    return false;
}

function get_grow_threads(ns, serv, percent) {
    let threads = 0;
    if (serv.moneyAvailable == 0) return 1000
    if (percent == "all" || percent == "full") percent = 1.05 * (serv.moneyMax / serv.moneyAvailable);
    else percent = 1.01 * (serv.moneyMax / (serv.moneyMax - (serv.moneyMax * percent)));
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
    const security_loss_per_weaken = 0.05
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