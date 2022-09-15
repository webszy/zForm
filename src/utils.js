export const getEmitName = actions => {
    if (Array.isArray(actions)) {
        const name = actions.map(fn => {
            return 'on' + fn.split('')[0].toUpperCase() + fn.split('').slice(1).join('')
        })
        return name
    }
    if (typeof actions === 'string') {
        return ['on' + actions.split('')[0].toUpperCase() + actions.split('').slice(1).join('')]
    }
}
