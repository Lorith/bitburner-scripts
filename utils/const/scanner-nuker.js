/** @param {NS} ns */
export async function main(ns) {
    const home = "home";
    const knownfile = "/data/known_servers.txt";
    const todofile = "/data/todo_servers.txt";
    const revisitfile = "/data/todo_servers.txt";
    const excludefile = "/data/todo_servers.txt";
    const ownedfile = "/data/my_servers.txt";

    var init = true;
    var owned = [];
    var excludes = [];
    var known = [home, "darkweb"];
    var todo = [];
    var revisit = [];
    var exclude = ["darkweb"];
    var count = 0

    setup();

    const controlport = 20;
    const resetcommand = "autoscan reset";

    
    while(true){
        if (todo.length != 0) {
            const serv = todo[0];
            scanit(serv);
        }
        
        if (todo.length < 1 || count > 5) {
            done();
            if (revisit.length != 0){
                todo = revisit;
                revisit = [];
            }
            else {
            await ns.sleep(300000);
            }
            count = 0;
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
        init = true;
        owned = [];
        excludes = [];
        known = [home, "darkweb"];
        todo = [];
        revisit = [];
        exclude = ["darkweb"];
        count = 0
        if (ns.fileExists(knownfile)) {
            known.push(ns.read(knownfile).split(","));
        }
        if (ns.fileExists(todofile)) {
            todo = ns.read(todofile).split(",");
        }
        if (ns.fileExists(revisitfile)) {
            revisit = ns.read(revisitfile).split(",");
        }
        if (ns.fileExists(excludefile)) {
            excludes = ns.read(excludefile).split(",");
        }
        for (let serv of excludes) {
            if (exclude.includes(serv) == false) {
                exclude.push(serv);
            }
        }
        if (ns.fileExists(ownedfile)) {
            owned = ns.read(ownedfile).split(",");
        }
        for (let serv of owned) {
            exclude.push(serv);
        }
        scanit(home);
    }

    function done() {
        var files = [knownfile]
        known.splice(known.indexOf("home"), 1);
        known.splice(known.indexOf("darknet"), 1);
        ns.write(knownfile, String(known + ","));
        if (todo.length != 0) {
            ns.write(todofile, String(todo + ","));
            files.push(todofile);
        }
        if (revisit.length != 0) {
            ns.write(revisitfile, String(revisit + ","));
            files.push(revisitfile);
        }
        if (exclude.length != 0) {
            ns.write(excludefile, String(todo + ","));
            files.push(excludefile);
        }
    }

    function scanit(scanhost) {
        var scanned = ns.scan(scanhost);
        for (let serv of scanned) {
            if (exclude.includes(serv) || revisit.includes(serv)) {
            }
            else {
                known.push(serv);
                todo.push(serv);
                if (ns.hasRootAccess(serv) == false) {
                    if (crackit(serv)) {
                        todo.splice(todo.indexOf(serv), 1);
                    }
                    else {
                        revisit.push(todo.pop());
                    }
                }
                else {
                    todo.pop();
                }
            }
        }
    }

    function crackit(targ) {
        const hacklevel = ns.getHackingLevel();
        if (ns.getServerRequiredHackingLevel(targ) <= ns.getHackingLevel()){
            ns.brutessh(targ);
            ns.ftpcrack(targ);
            ns.relaysmtp(targ);
            ns.httpworm(targ);
            ns.sqlinject(targ);
            ns.nuke(targ);
        }
        return ns.hasRootAccess(targ);
    }
}