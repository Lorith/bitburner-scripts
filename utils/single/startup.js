/** @param {NS} ns */
export async function main(ns) {
    ns.killall("home")
    ns.run("/utils/const/hud_edits.js")
    ns.run("/downloaded/ovButtons_simple.js")
    ns.run("/utils/single/doorcrasher.js")
    await ns.sleep(1000)
    ns.run("/unihack.js", 100000,"--loops", "-1")
    ns.run("/basic-batcher.js")
    ns.run("/contracts.js")
}