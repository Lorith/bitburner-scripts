/** @param {NS} ns */
export async function main(ns) {
    ns.alert("You shouldn't be calling directly.  Use import {target1, target2} from '/libs/shard/free.js' instead.");
    ns.prompt()
}

// constant defs
export const server_ram_levels = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576];
export const save_money = 10000000; // 10,000,000
export const servers = ["n00dles","foodnstuff","sigma-cosmetics","joesguns","hong-fang-tea","harakiri-sushi","iron-gym","darkweb","zer0","max-hardware","CSEC","nectar-net","omega-net","phantasy","neo-net","silver-helix","computek","crush-fitness","avmnite-02h","the-hub","netlink","johnson-ortho","zb-institute","I.I.I.I","summit-uni","catalyst","rothman-uni","syscore","rho-construction","millenium-fitness","lexo-corp","alpha-ent","aevum-police","galactic-cyber","snap-fitness","aerocorp","global-pharm","unitalife","deltaone","omnia","icarus","univ-energy","defcomm","zeus-med","solaris","infocomm","zb-def","taiyang-digital","nova-med","titan-labs","microdyne","applied-energetics","run4theh111z","fulcrumtech","stormtech","helios","vitalife","4sigma",".","omnitek","kuai-gong","b-and-a","nwo","clarkinc","blade","powerhouse-fitness","The-Cave","ecorp","megacorp","fulcrumassets"]
export const high_money_servers = ["megacorp","ecorp","nwo","blade","kuai-gong","b-and-a","4sigma","clarkinc","omnitek","global-pharm","fulcrumtech","deltaone","zeus-med","stormtech","aerocorp","univ-energy","nova-med","zb-def","zb-institute","unitalife","icarus","defcomm","omnia","powerhouse-fitness","taiyang-digital","titan-labs","galactic-cyber","vitalife","solaris","lexo-corp","infocomm","applied-energetics","microdyne","rho-construction","alpha-ent","helios","syscore","snap-fitness","catalyst","netlink","summit-uni","millenium-fitness","rothman-uni","computek","aevum-police","the-hub","johnson-ortho","omega-net","crush-fitness","silver-helix","phantasy","iron-gym","max-hardware","zer0","neo-net","harakiri-sushi","hong-fang-tea","nectar-net","joesguns","sigma-cosmetics","foodnstuff","fulcrumassets","n00dles"]


/**
 * function defs
 * safePrompt(ns,text,options) - exit if clicked out of
 * get_max_threads(size, use_ram) - Find most usable threads for given size and ram.
 * cap_threads_ram(threads,ram,thread_cost) - Gives either the threadcount you gave it, or the most you can do below that.
 * server_weight(hackinfo) - Depreciated, put into server object instead.
 * get_log_size(ns, width,height,line_spacing) - Gets the values for resizeTail with #chars per line and #lines.
 * pad_string(input_string, total_length, padding_string=" ")  - :ets you center-align things, and potentially put lines in there.
 * pprint(ns, input_string, total_length, padding_string=" ") - Print center-aligned/padded text
 */

export async function safePrompt(ns,text,options){let retval = await ns.prompt(text,options); if (retval === "") ns.exit(); else return retval}
export function get_max_threads(thread_size, ram_to_use) { return Math.floor(Math.max(ram_to_use / thread_size)); }
export function cap_threads_ram(threads, ram, cost_per_thread) { return (Math.min(Math.ceil(ram / cost_per_thread), threads)); }
export function server_weight(ns, hackinfo) {
    let value = 0;
    value -= (hackinfo.prep.weak + (0.8 * hackinfo.prep.growy)) / 100; // penalty to servers that need prepping first
    value += (((hackinfo.max_money + hackinfo.current_money) / 100) / hackinfo.times.hacky); // higher value for more money per time spent on a hack
    value -= hackinfo.max_money / 1000000 / (hackinfo.min_security * 1000); // more penalties for tougher servers, unless they have enough money
    return value;
}
export function get_log_size(ns, width, height) {
    const default_width = 9.722;
    const height_1 = 17.059;
    const line_spacing = ns.ui.getStyles().lineHeight
    return {"width":default_width * width, "height":height_1 * height * line_spacing};
}
export function pad_string(input_string, total_length, padding_string=" "){
    let padding = (total_length - input_string.length)/2;
    if (padding_string != " ") {
        input_string = input_string.padStart((input_string.length + padding),padding_string);
        input_string = input_string.padEnd(total_length,padding_string);
        return input_string;
    }
    return input_string.padStart((input_string.length + padding), padding_string);
}
export function pprint(ns, input_string, total_length, padding_string=" "){
    ns.print(pad_string(input_string,total_length,padding_string));
}

export function array_remove(array, key) {
    return array.splice(array.indexOf(key), 1);
}