/** @param {NS} ns */
export async function main(ns) {
    if (ns.args.length != 3) {
        ns.tprint("Error: only use three arguments, the target server, the hacking target, and how many threads.");
    }
    else {
        const serv = ns.args[0];
        const loc = null;
        const script = "/utils/const/autohack.js";
        const targ = ns.args[1];
        const threads = ns.args[2];
        const max_mon = ns.getServerMaxMoney(targ);
        const targ_sec = ns.getServerMinSecurityLevel(targ) + 3;
        var copy = null;

        if (loc != null) {
            copy = loc + script;
        }
        else {
            copy = script;
        }
        ns.scp(copy, serv, "home");
        ns.exec(script, serv, threads, targ, max_mon, targ_sec);
    }
}