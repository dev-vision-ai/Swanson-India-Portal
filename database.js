import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// Initialize Firebase
const firebaseConfig = {
    // Your Firebase config here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export const dbModule = {
    // Basic CRUD Operations
    async addDocument(collectionName, data) {
        try {
            const collectionRef = collection(db, collectionName);
            const docRef = await addDoc(collectionRef, {
                ...data,
                timestamp: new Date(),
                createdBy: auth.currentUser?.uid || 'system'
            });
            return docRef;
        } catch (error) {
            console.error(`Error adding document to ${collectionName}:`, error);
            throw error;
        }
    },

    async getDocument(collectionName, id) {
        try {
            const docRef = doc(db, collectionName, id);
            const docSnap = await getDoc(docRef);
            return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
        } catch (error) {
            console.error(`Error getting document from ${collectionName}:`, error);
            throw error;
        }
    },

    async updateDocument(collectionName, id, data) {
        try {
            const docRef = doc(db, collectionName, id);
            await updateDoc(docRef, {
                ...data,
                lastUpdated: new Date(),
                updatedBy: auth.currentUser?.uid || 'system'
            });
        } catch (error) {
            console.error(`Error updating document in ${collectionName}:`, error);
            throw error;
        }
    },

    async deleteDocument(collectionName, id) {
        try {
            const docRef = doc(db, collectionName, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error(`Error deleting document from ${collectionName}:`, error);
            throw error;
        }
    },

    // Query Operations
    async queryDocuments(collectionName, conditions = []) {
        try {
            const collectionRef = collection(db, collectionName);
            let queryRef = query(collectionRef);

            conditions.forEach(condition => {
                if (condition[0] === 'orderBy') {
                    queryRef = query(queryRef, orderBy(condition[1], condition[2]));
                } else {
                    queryRef = query(queryRef, where(condition[0], condition[1], condition[2]));
                }
            });

            const querySnapshot = await getDocs(queryRef);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error(`Error querying documents from ${collectionName}:`, error);
            throw error;
        }
    },

    async getAllDocuments(collectionName) {
        try {
            const querySnapshot = await getDocs(collection(db, collectionName));
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error(`Error getting all documents from ${collectionName}:`, error);
            throw error;
        }
    },

    // Real-time Listeners
    subscribeToCollection(collectionName, callback) {
        const collectionRef = collection(db, collectionName);
        return onSnapshot(collectionRef, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(data);
        });
    },

    subscribeToDocument(collectionName, id, callback) {
        const docRef = doc(db, collectionName, id);
        return onSnapshot(docRef, (doc) => {
            callback(doc.exists() ? { id: doc.id, ...doc.data() } : null);
        });
    },

    // Batch Operations
    async batchUpdate(operations) {
        try {
            const batch = writeBatch(db);
            
            operations.forEach(op => {
                const docRef = doc(db, op.collection, op.id);
                switch (op.type) {
                    case 'set':
                        batch.set(docRef, op.data);
                        break;
                    case 'update':
                        batch.update(docRef, op.data);
                        break;
                    case 'delete':
                        batch.delete(docRef);
                        break;
                }
            });

            await batch.commit();
        } catch (error) {
            console.error('Error in batch operation:', error);
            throw error;
        }
    },

    // Cache Management
    cache: new Map(),

    setCached(key, data, ttl = 300000) { // 5 minutes default TTL
        this.cache.set(key, {
            data,
            expires: Date.now() + ttl
        });
    },

    getCached(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        if (Date.now() > cached.expires) {
            this.cache.delete(key);
            return null;
        }
        return cached.data;
    },

    clearCache() {
        this.cache.clear();
    },

    // Error Handling
    handleError(error) {
        console.error('Database operation error:', error);
        
        // Map Firebase errors to user-friendly messages
        const errorMessages = {
            'permission-denied': 'You do not have permission to perform this operation',
            'not-found': 'The requested resource was not found',
            'already-exists': 'This resource already exists'
        };

        return errorMessages[error.code] || 'An unexpected error occurred';
    },

    // Authentication Status
    getCurrentUser() {
        return auth.currentUser;
    },

    onAuthStateChange(callback) {
        return onAuthStateChanged(auth, callback);
    }
};