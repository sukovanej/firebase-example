import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';

admin.initializeApp();

export const storeDeletedThings = functions.firestore
  .document('things/{thing}')
  .onDelete(async (snapshot) => { 
    await admin.firestore().collection("deletedThings").add(snapshot.data());
  });
