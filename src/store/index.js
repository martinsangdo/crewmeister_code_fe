import {createStore} from 'redux';

//common data
const commonState = {
        absences: [],   //list of absences in 1 page
        members: [],    //list of members in 1 page
        total_absences: 0   //total absences
};

const reducerFunction = (state = commonState, action)=>{
    //todo

    return state;
}
const store = createStore(reducerFunction);
export default store;

