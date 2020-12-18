import { Machine, interpret, assign, spawn, sendParent, AnyEventObject } from "xstate";
import {IUser, IGlobalContext} from './machine';
import {auth }from '../../../components/App';


const loginUser = (context:IGlobalContext, event:AnyEventObject)=>{
    //the view layer handles the login flow, and then sends the logged in user to this machine
    context.user = event.user;
}
const logout =(context:any, event: any)=>{
    auth().signOut();
    context.user = null;
}
function donate (){
    window.open('https://www.patreon.com/sheldonfrith_web');
}
function handleError(){
    //TODO 
    // VIEW.ErrorPage(error)
}
function contactAuthor(){
    window.open('https://sheldonfrith.com');
}
function viewSourceCode(){
    window.open("https://github.com/Sheldonfrith/theplaceforme-frontend");
}
function viewMethodology(){
    window.open("https://github.com/Sheldonfrith/theplaceforme-backend/wiki/Methodology");
}
const getCurrentUser = (context: IGlobalContext)=>{
    const user =  auth().currentUser;
    context.user = user;
}
const actions  = {
    login: loginUser,
    logout: logout,
    getCurrentUser: getCurrentUser,
    donate: donate,
    handleError: handleError,
    contactAuthor: contactAuthor,
    viewSourceCode: viewSourceCode,
    viewMethodology: viewMethodology,
}
export default actions;
