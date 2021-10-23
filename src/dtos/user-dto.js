module.exports = class UserDto {
    id;
    email;
    name;
    avatar;
    isConfirmed;
    data;

    constructor(model) {
        this.id = model._id;
        this.email = model.email;
        this.name = model.name;
        this.avatar = model.avatar;
        this.isConfirmed = model.isConfirmed;
        this.data = model.data;
    }
}