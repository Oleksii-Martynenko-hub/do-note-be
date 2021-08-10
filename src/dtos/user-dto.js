module.exports = class UserDto {
    id;
    email;
    name;
    avatar;
    isConfirmed;

    constructor(model) {
        this.id = model._id;
        this.email = model.email;
        this.name = model.name;
        this.avatar = model.avatar;
        this.isConfirmed = model.isConfirmed;
    }
}