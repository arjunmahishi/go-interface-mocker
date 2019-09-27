# Refer this to avoid breaking the JS code

### The contract for `mockInterface()` (`parseCode()` should return this):

```
{
    name: "interface-name", 
    methods: [
        {
            name: "method-1-name", 
            argsString: "i int, j int, s string", 
            returnString: "error"
        },
        {
            name: "method-2-name", 
            argsString: "i int, j int, s_3 string", 
            returnString: "(string, error)"
        }
    ]
}
```