/*
    let hackThreads = Math.ceil(ns.hackAnalyzeThreads(Target, ns.getServerMoneyAvailable(Target) * AmountToHack));
    let growThreads = Math.ceil(ns.growthAnalyze(Target, 1 / (1-AmountToHack) * 1.1));
    let weaken1Threads = Math.ceil(growThreads * 0.004 / 0.05 * 1.1);
    let weaken2Threads = Math.ceil(hackThreads * 0.002 / 0.05 * 1.1);
 */
let run_stocks = false;
const min_rate_sell = 0.55;
const min_rate_buy = 0.59;
const save_cash = 1e8;
const logfile = "/data/stockmanager.txt"

/** @param {NS} ns */
export async function main(ns) {

    //const stocks = ns.stock.getSymbols();formatNumber(1e14));ns.exit();
    const stocks = ["NTLK","JGN","WDS","APHE","CTYS","SYSC","LXO","FLCM","ECP","MGCP","BLD","CLRK","OMTK","FSIG","KGI","STM","DCOMM","HLS","VITA","ICRS","UNV","AERO","OMN","SLRS","GPH","NVMD","RHOC","CTK","OMGA","FNS","SGC","MDYN","TITN"];
    //const stocks = ["NTLK", "JGN", "WDS", "APHE", "CTYS", "SYSC", "LXO", "FLCM"]; // only most volatile
    let owned = [];

    ns.disableLog("ALL");
    ns.clearLog();
    ns.tail();
    updateSettings(ns);
    ns.print("Starting noob stockmanager.\nChecking for existing stocks.");
    for (let x of stocks) {
        if (ns.stock.getPosition(x)[0] > 0) owned.push(x);
    }
    while (true) {
        if (!run_stocks){await ns.sleep(5000);updateSettings(ns);continue;}
        for (let x of stocks) {
            let freecash = ns.getServerMoneyAvailable("home") - save_cash - 1e5;
            //        ns.tprint(ns.formatNumber(freecash));ns.exit();
            let fcast = ns.stock.getForecast(x);
            let shares = ns.stock.getPosition(x)[0];
            if (fcast < min_rate_sell) {
                if (owned.includes(x)) {
                    let num = ns.stock.getPosition(x)[0];
                    let inc = ns.stock.sellStock(x, num);
                    owned.splice(owned.indexOf(x), 1);
                    let message = ("Selling " + ns.formatNumber(num) + " shares of " + x + " for $" + ns.formatNumber(inc) + "." + "\n");
                    ns.print(message);
                    ns.write(logfile, message, "a");
                }
            } else if (freecash > save_cash && fcast > min_rate_buy) {
                let cost = ns.stock.getAskPrice(x);
//                if (cost < 1e2) continue;
                let aval = ns.stock.getMaxShares(x) - shares;
                let num = Math.min((freecash) / cost, aval);
                if (num >= 1e5) {
                    let val = ns.stock.buyStock(x, num);
                    if (!owned.includes(x)) owned.push(x);
                    let message = ("Buying " + ns.formatNumber(num) + " shares of " + x + " for $" + ns.formatNumber(val) + "." + "\n");
                    ns.print(message);
                    ns.write(logfile, message, "a");
                }
            }
        }
        await ns.sleep(9000);
    }
    ns.exit();
/*
    function sort(array,func, savefile) {
        var most = 0;
        var biggest = "";
        var sorted = [];
        while (array.length > 0) {
            for (let x of array) {
                let vol = ns.eval(func);
                if (vol > most) {
                    biggest = x; most = vol;
                }
            }
            sorted.push(biggest);
            array.splice(stocks.indexOf(biggest), 1);
            most = 0;
        }
        var temp = [];
        while (sorted.length > 0) temp.push(sorted.pop());
        while (temp.length > 0) {
            let temp2 = temp.pop();
            ns.write(savefile, ('"' + temp2.toString() + '",'), "a");
        }
    }
*/
}


export function readFromJSON(ns, filename = "/test/jsontest.txt") {
	return JSON.parse(ns.read(filename));
}

function updateSettings(ns) {
    let g_sets = readFromJSON(ns, "/data/g_settings_test.txt");
    run_stocks = g_sets.run_stocks;
}