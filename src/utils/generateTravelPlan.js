import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

// This function will simulate a call to a generative AI service to create a travel plan.
const generateTravelPlan = httpsCallable(functions, 'generateTravelPlan');

export default generateTravelPlan;
