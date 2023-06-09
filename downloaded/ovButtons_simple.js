/** @param {NS} ns */
/** @param {import('..').NS} ns */
export async function main(ns) {
    const doc = eval("document");
    let textArea = doc.querySelectorAll(".react-draggable:first-of-type")[0]; //find overview

    let g_sets = { //variables to be controlled with buttons
        run_hacks: true,
        run_stocks: true
    };
    if (!ns.fileExists("/data/g_settings_test.txt")) //if file doesn't exist, make it
        await writeToJSON(ns, g_sets, "/data/g_settings_test.txt");
    for (const key of Object.keys(g_sets)) {
        if (!readFromJSON(ns, "/data/g_settings_test.txt").hasOwnProperty(key)) { //if file doesn't have some of the variables, rewrite it
            await writeToJSON(ns, g_sets, "/data/g_settings_test.txt");
            break;
        }
    }
    g_sets = readFromJSON(ns, "/data/g_settings_test.txt");
    ns.tprint(g_sets);
    const buttonsTextStyle = //text beside button
        `color:#090;
		margin:0px auto;
		font-family:'Comic Sans MS';
        font-size:15px;
		text-align:left;
        `;

    let buttonsA = [];

    for (const key of Object.keys(g_sets)) { //make button objects
    /*
        if (key == "var3")
            buttonsA.push(new Control("The thing", "thing: ", key, g_sets[key])); //custom text
        else
    */
            buttonsA.push(new Control(key, "", key, g_sets[key])); //just the variable as text
    }

    for (const butt of buttonsA) makeButton(butt); //put the button objects to overview

    function makeButton(butt) {
        let newButton = //width:40px is good for 'on/off' text
            `<button id=${butt.buttonId} style="
            border: 2px solid transparent;
            border-radius: 7px;
            border-color:#090;
            background-color:#131;
            width:auto; 
            height:fit-content;
            align:center;
            font-family:'Comic Sans MS';
            font-size:10px;
            color:#0c0;
            ">${butt.variable ? butt.buttonText + "ON" : butt.buttonText + "OFF"}</button>`;

        textArea.insertAdjacentHTML('beforeend',
            `<table style="width:90%; border:0px; margin-left:auto; margin-right:auto;">
            <tr>
                <th style="${buttonsTextStyle}">${butt.text}</th>
                <th style="text-align:right">${newButton}</th>
            </tr>
            </table>`); //table is used for buttons and text alignment
        let btn = doc.querySelector("#" + butt.buttonId);
        btn.addEventListener("click", () => {
            butt.variable = !butt.variable;
            btn.innerText =
                butt.variable ? butt.buttonText + "ON" : butt.buttonText + "OFF";
        });
    }

    /**@param {string} text Text beside button
    *@param {string} buttonText Text inside button 
    *@param {string} buttonId Unique id for finding this button 
    *@param {boolean} variable variable this button controls */
    function Control(text, buttonText, buttonId, variable = true) {
        this.text = text;
        this.buttonText = buttonText;
        this.buttonId = buttonId;
        this.variable = variable;
    }

    ns.atExit(() => {
        for (const butt of buttonsA) //remove buttons
            doc.getElementById(butt.buttonId).remove();
        for (let i = 0; i < buttonsA.length; i++) //remove button texts
            textArea.removeChild(textArea.lastChild);
    });

    while (true) {
        await ns.sleep(20);
        await buttonsLoop();
    }

    async function buttonsLoop() {
        for (const butt of buttonsA) {
            let btn = doc.querySelector("#" + butt.buttonId);
            btn.innerText =
                butt.variable ? butt.buttonText + "ON" : butt.buttonText + "OFF";
            btn.style.backgroundColor = butt.variable ? "#030" : "#000";
            g_sets[butt.buttonId] = butt.variable;
        }
        await writeToJSON(ns, g_sets, "/data/g_settings_test.txt");
    }
}

export function readFromJSON(ns, filename = "/test/jsontest.txt") {
	return JSON.parse(ns.read(filename));
}

export async function writeToJSON(ns, jsonObject, filename = "/test/jsontest.txt") {
	await ns.write(filename, JSON.stringify(jsonObject), "w");
}