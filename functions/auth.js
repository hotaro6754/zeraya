const functions = require("firebase-functions");
const admin = require("firebase-admin");

/**
 * Sets the default role of 'user' for a new user.
 */
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  await admin.auth().setCustomUserClaims(user.uid, { role: 'user' });
  return;
});

/**
 * Callable function to grant a user the 'admin' role.
 * This function should be protected by security rules to ensure only admins can call it.
 */
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // Check if the user calling the function is an admin.
  if (context.auth.token.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can set other users as admins.');
  }

  // Get the user by email and set their custom claim to 'admin'.
  try {
    const user = await admin.auth().getUserByEmail(data.email);
    await admin.auth().setCustomUserClaims(user.uid, { role: 'admin' });
    return { message: `Success! ${data.email} has been made an admin.` };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
