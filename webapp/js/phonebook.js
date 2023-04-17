function Contact(firstName, lastName, phone) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.checked = false;
    this.shown = true;
}

new Vue({
    el: "#app",
    data: {
        validation: false,
        serverValidation: false,
        firstName: "",
        lastName: "",
        phone: "",
        rows: [],
        serverError: "",
        deletedContactId: null,
        isChecked: false
    },

    methods: {
        contactToString: function (contact) {
            var note = "(";
            note += contact.firstName + ", ";
            note += contact.lastName + ", ";
            note += contact.phone;
            note += ")";
            return note;
        },

        convertContactList: function (contactListFromServer) {
            return contactListFromServer.map(function (contact, i) {
                return {
                    id: contact.id,
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    phone: contact.phone,
                    checked: false,
                    shown: true,
                    number: i + 1
                };
            });
        },

        addContact: function () {
            if (this.hasError) {
                this.validation = true;
                this.serverValidation = false;
                return;
            }

            var self = this;

            var contact = new Contact(this.firstName, this.lastName, this.phone);
            $.ajax({
                type: "POST",
                url: "/phonebook/add",
                data: JSON.stringify(contact)
            }).done(function () {
                self.serverValidation = false;
            }).fail(function (ajaxRequest) {
                var contactValidation = JSON.parse(ajaxRequest.responseText);
                self.serverError = contactValidation.error;
                self.serverValidation = true;
            }).always(function () {
                self.loadData();
            });

            self.firstName = "";
            self.lastName = "";
            self.phone = "";
            self.validation = false;
        },

        loadData: function () {
            var self = this;

            $.get("/phonebook/get/all").done(function (response) {
                var contactListFormServer = JSON.parse(response);
                self.rows = self.convertContactList(contactListFormServer);
            });
        },

        deleteContact: function () {
            var self = this;
            $.ajax({
                type: "POST",
                url: "/phonebook/delete",
                contentType: "application/json",
                data: JSON.stringify(this.deletedContactId),
            }).fail(function () {
                alert("Ошибка при удалении контакта");
            }).always(function () {
                self.loadData();
            });
        },

        showDeleteButtonConfirmDialog(id) {
            this.deletedContactId = id;

            new bootstrap.Modal(this.$refs.deleteButtonConfirmDialog).show();
        },

        deleteChecked: function () {
            var checkedContactsIds = this.rows
                .filter(function (row) {
                    return row.isChecked === true;
                })
                .map(function (contact) {
                    return contact.id;
                });
            console.log(checkedContactsIds);
            var self = this;

            $.ajax({
                type: "POST",
                url: "/phonebook/deletechecked",
                contentType: "application/json",
                data: JSON.stringify(checkedContactsIds)
            }).fail(function () {
                alert("Ошибка при удалении выбранных контактов");
            }).always(function () {
                self.loadData();
            });
        },

        showDeleteCheckboxConfirmDialog() {
            new bootstrap.Modal(this.$refs.deleteCheckboxConfirmDialog).show();
        },

        test: function () {
            alert("hello");
        }
    },

    computed: {
        firstNameError: function () {
            if (this.firstName) {
                return {
                    message: "",
                    error: false
                };
            }

            return {
                message: "Клиент: поле Имя должно быть заполнено.",
                error: true
            };
        },

        lastNameError: function () {
            if (!this.lastName) {
                return {
                    message: "Клиент: поле Фамилия должно быть заполнено.",
                    error: true
                };
            }

            return {
                message: "",
                error: false
            };
        },

        phoneError: function () {
            if (!this.phone) {
                return {
                    message: "Клиент: поле Телефон должно быть заполнено.",
                    error: true
                };
            }

            var self = this;

            var sameContact = this.rows.some(function (c) {
                return c.phone === self.phone;
            });

            if (sameContact) {
                return {
                    message: "Клиент: номер телефона не должен дублировать другие номера в телефонной книге.",
                    error: true
                };
            }

            return {
                message: "",
                error: false
            };
        },

        hasError: function () {
            return this.lastNameError.error || this.firstNameError.error || this.phoneError.error;
        }
    },

    created: function () {
        this.loadData();
    }
});

