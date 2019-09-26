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
        mockMethods += `\nfunc (m ${mockName}) ${func.name}(${func.argsString}) ${func.returnString} {\n\treturn m\n}`
    });

        return `type ${mockName} struct {\n${mockMembers}}${mockMethods}`
}