/** @param {NS} ns */
export async function main(ns) {
    const doc = eval("document")
    const hook0 = eval("document.getElementById('overview-extra-hook-0')")
    const hook1 = eval("document.getElementById('overview-extra-hook-1')")
    ns.clearLog()
    ns.disableLog("ALL")
    let file = "./utils/const/hud_edits.js"
    const contents = ns.read(file)
    while(true){
        try {
            let test = ns.read(file)
            if (test != contents) {
                ns.print("Reloading hud from file change!")
                ns.tprint("Reloading hud from file change!")
                ns.spawn(file)
            }
            const headers = []
            const values = []

            // show home ram usage
            const homerammax = ns.getServerMaxRam("home")
            const homeram = homerammax - ns.getServerUsedRam("home")
            headers.push("H-RAM:")
            values.push(ns.formatRam(homeram) + "/" + ns.formatRam(homerammax))

            // show share power
            const sharepower = ns.getSharePower()
            // headers.push("ShareP")
            // values.push(ns.formatNumber(sharepower))
            //headers.splice(headers.indexOf("ShareP"),1)
            //values.splice(values.indexOf(sharepower),1)

            // show script income
            const income = ns.getTotalScriptIncome()[0]
            headers.push("S-Income")
            values.push("$"+ns.formatNumber(income)+"/s")
            
            hook0.innerText = headers.join(" \n")
            hook1.innerText = values.join("\n")
        } catch(err) {
            ns.print("Error updating hud: ", String(err))
        }
        await ns.sleep(1000)
    }
}