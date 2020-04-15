export const state = () => ({
    list: []
})
  
export const mutations = {
    add (state, text) {
        let id = 0;
        state.list.push({
            text: text,
            done: false,
            id: id++
        })
    },
    remove (state, { todo }) {
        state.list.splice(state.list.indexOf(todo), 1)
    },
    toggle (state, todo) {
        todo.done = !todo.done
    }
}