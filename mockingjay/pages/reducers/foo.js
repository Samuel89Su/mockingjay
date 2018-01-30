const foo = (state = {}, action) => {
    switch (action.type) {
        case 'FOO':
            return {foo: action.payload};
        default:
            return state
    }
};

export default foo