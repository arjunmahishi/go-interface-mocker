/*

    * parseCode(): parses the code in creates an object that is easy to consume
    * mockInterface(): takes the object and generates the mockCode

*/

const PARSE_ERROR = "// Sorry couldn't parse the code. \n// Make sure the interface is properly defined"
const EMPTY_EDITOR_RESPONSE = "// Paste the interface you want to mock on the other editor"

const parseCode = (code) => {
    if (code.trim() == "") {
        return EMPTY_EDITOR_RESPONSE
    }

    let interfaceData = {}    
    try {
        interfaceData.name = code.split("type")[1].split("interface")[0].trim()
        interfaceData.methods = []
        let methodSigs = code.trim().split("{")[1].split("}")[0].trim().split("\n").map(f => f.trim()).filter(ele => ele != "")
        methodSigs.forEach(sig => {
            interfaceData.methods.push({
                name: sig.split("(")[0].trim(),
                argsString: sig.split("(")[1].split(")")[0].trim(),
                returnString: sig.slice(sig.search(/\)/g)+1).trim()
            })
        })
    } catch(err) {
        return PARSE_ERROR
    }
    return interfaceData
}

const mockInterface = (interfaceObj) => {
    if  (interfaceObj == PARSE_ERROR) {
        return PARSE_ERROR
    } 
    if (interfaceObj == EMPTY_EDITOR_RESPONSE) {
        return EMPTY_EDITOR_RESPONSE
    }

    let mockName = `mock${interfaceObj.name}`
    let mockMembers = ""
    let mockMethods = ""
    
    try {
        interfaceObj.methods.forEach(r => {
            r.returnString.replace("(", "").replace(")", "").split(",").forEach(t => {
                t = t.trim()
                mockMembers += `\t${r.name}_${t}ToReturn ${t}\n`
            })
        })
        
        interfaceObj.methods.forEach(func => {
            var returnSt = "" 
            returnArray(func.returnString).forEach(s => {
                returnSt += `${func.name}_${s}ToReturn, `
            })
            mockMethods += `\n\nfunc (m ${mockName}) ${func.name}(${func.argsString}) ${func.returnString} {\n\treturn ${returnSt.replace(/(^,)|(, $)/g, "")}\n}`
        });
    } catch(err) {
        return PARSE_ERROR
    }
    return `type ${mockName} struct {\n${mockMembers}}${mockMethods}`
}

const returnArray = (st) =>  
    st.replace("(", "")
    .replace(")", "")
    .split(",")
    .map(s => s.trim())
    .filter(ele => ele != "")

const refreshOutput = (inputEditor, outputEditor) => {
    outputEditor.setValue("// the mock code comes here (if everything goes well")
    let mockCode = mockInterface(
        parseCode(
            inputEditor.getValue()
        )
    )
    outputEditor.setValue(mockCode)
}

var inputEditor = CodeMirror(document.querySelector("#input-editor"), {
    mode: "go",
    theme: "material-darker",
    // value: code,
    lineNumbers: true
});

var outputEditor = CodeMirror(document.querySelector("#output-editor"), {
    mode: "go",
    theme: "material-darker",
    // value: lines,
    lineNumbers: true,
    readOnly: "nocursor"
});

inputEditor.on("change", () => {
    refreshOutput(inputEditor, outputEditor)
})
refreshOutput(inputEditor, outputEditor)
