export default function(name, msg) {
    if (console && console.log) {
        console.log('%c' + name + ':', 'font-weight:bold', msg)
    }
}