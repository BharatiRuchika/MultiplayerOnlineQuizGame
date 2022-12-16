const initialState = {
    quiz: {},
    nickname: '',
    selectedPin: 0,
    quizToEdit: {},
    userId:'',
    hostPinsArray:[]
}

const SELECTED_QUIZ = 'SELECTED_QUIZ'
const NEW_NICKNAME = 'NICKNAME'
const SELECTED_PIN = 'SELECTED_PIN'
const QUIZ_TO_EDIT = 'QUIZ_TO_EDIT'
const HOST_PIN = "HOST_PIN"
const USER_ID = "USER_ID"
const EDIT_HOST_PIN = "EDIT_HOST_PIN"
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SELECTED_QUIZ:
            return Object.assign({}, state, { quiz: action.payload })
        case NEW_NICKNAME:
            return Object.assign({}, state, { nickname: action.payload })
        case SELECTED_PIN:
            return Object.assign({}, state, { selectedPin: action.payload })
        case QUIZ_TO_EDIT:
            return Object.assign({}, state, { quizToEdit: action.payload })
        case USER_ID:
            return Object.assign({}, state, { userId: action.payload })
        // case HOST_PIN:
        //    return Object.assign({}, state, { hostPinsArray: pins})
        case EDIT_HOST_PIN:
            console.log(action.payload);
            let pins = state.hostPinsArray;
            pins.push(action.payload)
            return Object.assign({}, state, { hostPinsArray: pins})
        default:
            return state
        
    }
}


export function selectedQuiz(quiz) {
    return {
        type: SELECTED_QUIZ,
        payload: quiz
    }
}
export function handleNickname(nickname) {
    return {
        type: NEW_NICKNAME,
        payload: nickname
    }
}
export function handleUser(userId){
     return {
         type:USER_ID,
         payload:userId
     }
}
export function selectedPin(pin) {
    return {
        type: SELECTED_PIN,
        payload: pin
    }
}
export function editingQuiz(quiz) {
    console.log("quiz",quiz);
    return {
        type: QUIZ_TO_EDIT,
        payload: quiz
    }
}
// export function hostPins(pin){
//     console.log("host pin called");
//     return {
//         type: HOST_PIN,
//         payload: pin
//     }
// }
export function editHostPins(pin){
    console.log("im in edit host");
    return {
        type: EDIT_HOST_PIN,
        payload: pin
    }
}