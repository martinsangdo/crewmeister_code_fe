import {createStore} from 'redux';
import {ACTION_TYPE} from '../constant';

//common data
const commonState = {
        total_absences: 0   //total absences
};

//define format of action
type ActionType = {
    type: string,
    total_absences: 0
}

const reducerFunction = (state = commonState, action: ActionType)=>{
    if (action.type === ACTION_TYPE.GET_TOTAL_ABSENCES){
        //response data in current page
        return {
            total_absences: state.total_absences
        }
    }
    if (action.type === ACTION_TYPE.SET_TOTAL_ABSENCES){
        //response data in current page
        return {
            total_absences: action.total_absences
        }
    }
    return state;
}
const store = createStore(reducerFunction, commonState);
export default store;

