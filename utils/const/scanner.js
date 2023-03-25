/** @param {NS} ns */
export async function main(ns) {
    const home = "home";
    const knownfile = "/data/known_servers.txt";
    const ownedfile = "/data/my_servers.txt";

    var init = true;
    var owned = [];
    var known = [];
    var check = [];

    setup();

    const controlport = 20;
    const resetcommand = "autoscan reset";

    
    while(true){
        if (check.length != 0) {
            const serv = check[0];
            scanit(serv);
        }
        else {
            await ns.sleep(30000);
            done();
        }
        const orderport = ns.getPortHandle(controlport);
        if (orderport.peek() == resetcommand) {
            orderport.read();
            reset();
        }
        await ns.sleep(1000);
    }

    function reset() {
        done();
        setup();
    }

    function setup() {
        init = false;
        owned = [];
        known = [home, "darkweb"];
        check = known;
        if (ns.fileExists(knownfile)) {
            known.push(ns.read(knownfile).split(","));
            check.push(ns.read(knownfile).split(","));
        }
        if (ns.fileExists(ownedfile)) {
            owned = ns.read(ownedfile).split(",");
        }
        scanit(home);
    }

    function done() {
        known.splice(known.indexOf("home"), 1);
        known.splice(known.indexOf("darknet"), 1);
        ns.write(knownfile, String(known + ","));
    }

    function scanit(scanhost) {
        var scanned = ns.scan(scanhost);
        for (let serv of scanned) {
            if (known.includes(serv) || owned.includes(serv)) {
            }
            else {
                known.push(serv);
                check.push(serv);
            }
        }
        check.splice(check.indexOf(scanhost), 1);
    }
}