/** @param {NS} ns */
export async function main(ns) {
    
    if (ns.args.length > 0) {
        const target = ns.args[0];
        await weak(ns, target);
    } else {
        const target = "joesguns"; // await ns.prompt("Enter a target.", {type: "text"});
        await weak(ns, target);
    }

    async function weak(ns, target) {
        while(true){
            await ns.weaken(target,{"stock":true});
        }
    }
}