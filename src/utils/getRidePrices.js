import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';

// A function to simulate the pricing logic that would run on the backend.
const getRidePrices = httpsCallable(functions, 'getRidePrices');

export default getRidePrices;
