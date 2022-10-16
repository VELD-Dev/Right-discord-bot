String.prototype.format = function(this: string, ...args: any[]): string {
    let value = this;
    for(let i = 0; i < args.length; i++) {
        let regexp = new RegExp('\\{' + i + '\\}', 'gi');
        value = value.replace(regexp, args[i])
    }
    return value;
}