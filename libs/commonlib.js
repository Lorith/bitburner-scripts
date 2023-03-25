/** @param {NS} ns */
export async function main(ns) {
    //calc_hack(ns, 1);
    ns.alert("You shouldn't be calling directly.  Use import {target1, target2} from '/libs/shard_lib.js' instead.")
}

/** @param {NS} ns */
export function hackInfo(ns, targ) {
    const min_sec = ns.getServerMinSecurityLevel(targ);
    const max_money = ns.getServerMaxMoney(targ);
    const cur_sec = ns.getServerSecurityLevel(targ);
    const cur_money = ns.getServerMoneyAvailable(targ);

    let hack_threads = 0;
    let grow_threads = 0;
    if (max_money > 0) {
        hack_threads = Math.floor(ns.hackAnalyzeThreads(targ, cur_money * 0.5));
        grow_threads = Math.ceil(ns.growthAnalyze(targ, Math.min(1.1*(max_money / (cur_money / 2)), 2)));
    }

    const hack_weaken_needed = Math.ceil(hack_threads * (0.002 / 0.05));
    const grow_weaken_needed = Math.ceil(grow_threads * (0.004 / 0.05));

    const times = { "growy": ns.getGrowTime(targ), "hacky": ns.getHackTime(targ), "weak": ns.getWeakenTime(targ) };
    const delays = { "growy": Math.ceil(times.weak - times.growy), "hacky": Math.ceil(times.weak - times.hacky) };
    const threads = { "hacky": Math.ceil(hack_threads), "weaken1": Math.ceil(hack_weaken_needed * 1.1), "growy": Math.ceil(grow_threads), "weaken2": Math.ceil(1.1*grow_weaken_needed) };
    const prep = { "growy": Math.ceil(ns.growthAnalyze(targ,(Math.max( (1.1*(2 - (cur_money+1) / max_money))), 1.2))), "weak": Math.ceil(Math.max(cur_sec - min_sec * 0.05, 0)) };
    const weight = server_weight(ns, { "prep": prep, "threads": threads, "times": times, "max_money": max_money, "current_money": cur_money, "min_security": min_sec });
    const stats = { "current_money": cur_money, "current_security": cur_sec, "max_money": max_money, "min_security": min_sec, "sec_diff": cur_sec - min_sec, "money_ratio": cur_money / max_money };


    let returnval = { "name": ns.getHostname(targ), "delays": delays, "prep": prep, "stats": stats, "threads": threads, "times": times, "weight": Math.floor(Math.max(weight, 0)) }

    returnval.times.growy = Math.ceil(returnval.times.growy);
    returnval.times.hacky = Math.ceil(returnval.times.hacky);
    returnval.times.weak = Math.ceil(returnval.times.weak);

    return returnval;
}