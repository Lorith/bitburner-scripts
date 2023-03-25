import {get_log_size, pprint} from "./libs/shard/free.js"

export function autocomplete(data,args){
    const cmds = ["--target ", "--type ", "--loops -1 ", "--stocks true ", "--delay ", "--help", "--init_delay "];
    return [...data.servers, ...cmds];
}

export async function main(ns) {
    const myflags = ns.flags([
        ["type", "weaken"], // defaults to weaken, but can be set to grow or hack as well.
        ["target", "foodnstuff"], // set default target
        ["loops", 1], // lets use -1 as infinite loops
        ["stocks", false], // do we want to have an effect on stocks?
        ["delay", 0],
        ["init_delay", 0],
        ["help", false]
    ])
    let retval = 0;
    if (ns.args.length == 0 || myflags.help != false) await help(ns);
    else {
        await ns.sleep(myflags.init_delay);
        let loops = myflags.loops;
        while (loops != 0) {
            loops--
            if (myflags.delay > 0) await ns.sleep(myflags.delay);
            retval += await eval(`ns.${myflags.type}("${myflags.target}", {'stocks':${myflags.stocks}})`);
        }
    }

    // Doing this allows running grow, hack, and weaken all with a single script for 'free', only costing what one would cost.
    // Will not work unless it has the 0.15GB of ram added somewhere, such as by having the grow called after the return.

    return retval;
ns.grow();
}

async function help(ns) {
    const logsize = { "width": 60, "height": 17.25 };
    ns.clearLog();
    ns.disableLog("ALL");
    ns.tail();
    const sizes = get_log_size(ns, logsize.width, logsize.height); // returns size based on the char + line count
    pprint(ns, "Shard's Unihack", logsize.width);
    pprint(ns, "Help info", logsize.width, "=");
    ns.print("\n");
    pprint(ns, "This script uses flags rather than args.", logsize.width);
    pprint(ns, "To use flags, place -- before the name.", logsize.width);
    pprint(ns, "Example: unihack.js --type hack --target n00dles", logsize.width);
    ns.print("\n");
    pprint(ns, "Flags for this script and their defaults:", logsize.width);
    ns.print("--help < you are here!");
    ns.print("--type default of weaken, can also be grow or hack.");
    ns.print("--target default foodnstuff");
    ns.print("--loops default 1, number of loops to repeat, <= 0 is inf");
    ns.print("--delay default 0, how many ms to wait before running command");
    ns.print("--init_delay default 0, how many ms to wait once at startup");
    ns.print("--stocks default false, if you want g/w to impact stocks");
    await ns.sleep(100); // for some reason, can't set immediately, so gotta wait.
    ns.resizeTail(sizes.width, sizes.height);
    await ns.sleep(120000);
    ns.closeTail();
    ns.exit();
}

/*
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
*/