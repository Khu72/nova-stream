export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) return res.status(401).json({ message: 'Missing Token.' });
    next();
}

export const getUserPermissions = async (req, res) => {
    try {
        const uid = req.user.uid;
        const userDoc = await admin.firestore().collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found.' })
        }

        res.json(userDoc.data());
    } catch (error) {
        res.status(500).json({ message: 'Server Error.', error: error.message });
    }
}