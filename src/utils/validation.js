const validateEditProfileData = (req) => {
    const allowedEditableFields = [
        "firstName",
        "lastName",
        "photoURL",
        "gender",
        "age",
        "about",
        "skills",
    ];

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditableFields.includes(field))

    return isEditAllowed;
}

module.exports = {
    validateEditProfileData
}