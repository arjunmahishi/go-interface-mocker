const code = `
type test interface {
    sample1(i int, a string) (r1, r2)
    sample2() error
}
`.trim()

const parseInterface = (intCode) => {
    let interfaceData = {}    
    interfaceData.name = intCode.split("type")[1].split("interface")[0].trim()

    interfaceData.methods = []
    let methodSigs = code.split("{")[1].split("}")[0].trim().split("\n").map(f => f.trim())
    methodSigs.forEach(sig => {
        console.log(sig)
        interfaceData.methods.push({
            name: sig.split("(")[0].trim(),
            argsString: sig.split("(")[1].split(")")[0].trim(),
        })
    })
    return interfaceData
}

console.log(parseInterface(code))

const mockInterface = (interfaceObj) => {
    let mockName = `mock${interfaceObj.name}`
    let mockMembers = ""
    let mockMethods = ""
    
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
    
    return `type ${mockName} struct {\n${mockMembers}}${mockMethods}`
}

const returnArray = (st) =>  st.replace("(", "").replace(")", "").split(",").map(s => s.trim())

let lines = mockInterface({
    name: "Sample", 
    methods: [
        {
            name: "test", 
            argsString: "i int, j int, s string", 
            returnString: "error"
        },
        {
            name: "test1", 
            argsString: "i int, j int, s_3 string", 
            returnString: "(string, error)"
        }
    ]
})

var inputEditor = CodeMirror(document.querySelector("#input-editor"), {
    mode: "go",
    theme: "material-darker",
    value: code,
    lineNumbers: true
});
var outputEditor = CodeMirror(document.querySelector("#output-editor"), {
    mode: "go",
    theme: "material-darker",
    value: lines,
    lineNumbers: true
});