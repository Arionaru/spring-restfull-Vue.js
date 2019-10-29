function getIndex(list, id) {
    for (var i = 0; i < list.length; i++ ) {
        if (list[i].id === id) {
            return i;
        }
    }

    return -1;
}


var userApi = Vue.resource('/user{/id}');

Vue.component('user-form', {
    props: ['users', 'userAttr'],
    data: function() {
        return {
            id: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            address: ''

        }
    },
    watch: {
        userAttr: function(newVal, oldVal) {
            this.id = newVal.id;
            this.firstName = newVal.firstName;
            this.lastName = newVal.lastName;
            this.dateOfBirth = newVal.dateOfBirth;
            this.address = newVal.address;

        }
    },
    template:
        '<div class="container">' +
        '<input class="mb-2" type="text" placeholder="First name" v-model="firstName" />' +
        '<input class="mb-2" type="text" placeholder="Last name" v-model="lastName" />' +
        '<input class="mb-2" type="date" placeholder="Date of birth" v-model="dateOfBirth" />' +
        '<input class="mb-2" type="text" placeholder="Address" v-model="address" />' +
        '<input class="btn btn-primary" type="button" value="Save" @click="save" />' +
        '</div>',
    methods: {
        save: function() {
            var user = {
                firstName: this.firstName,
                lastName: this.lastName,
                dateOfBirth: this.dateOfBirth,
                address: this.address
            };

            if (this.id) {
                userApi.update({id: this.id}, user).then(result =>
                result.json().then(data => {
                    var index = getIndex(this.users, data.id);
                this.users.splice(index, 1, data);
                this.id = '';
                this.firstName = '';
                this.lastName = '';
                this.dateOfBirth = '';
                this.address = '';
            })
            )
            } else {
                userApi.save({}, user).then(result =>
                result.json().then(data => {
                    this.users.push(data);
                this.firstName = '';
                this.lastName = '';
                this.dateOfBirth = '';
                this.address = '';
            })
            )
            }
        }
    }
});

Vue.component('user-row', {
    props: ['user', 'editMethod', 'users'],
    template:
        '<tr><td>{{ user.id }}</td><td>{{ user.firstName }}</td><td>{{user.lastName}}</td><td>{{user.dateOfBirth}}</td><td>{{user.address}}</td>'+
        '<td><input type="button" class="btn btn-secondary" value="Edit" @click="edit" /></td>'+
        '<td><input type="button" class="btn btn-secondary" value="X" @click="del" /></td></tr>',
    methods: {
        edit: function() {
            this.editMethod(this.user);
        },
        del: function() {
            userApi.remove({id: this.user.id}).then(result => {
                if (result.ok) {
                this.users.splice(this.users.indexOf(this.user), 1)
            }
        })
        }
    }
});

Vue.component('users-list', {
    props: ['users'],
    data: function() {
        return {
            user: null
        }
    },
    template:
        '<div style="position: relative; width: 300px;">' +
        '<user-form :users="users" :userAttr="user" />' +
        '<table class="table table-hover">' +
        '<tr><th>Id</th><th>Имя</th><th>Фамилия</th><th>Дата рождения</th><th>Адрес</th><th></th><th></th></tr>' +
            '<user-row v-for="user in users" :key="user.id" :user="user" :editMethod="editMethod" :users="users" />' +
        '</table>' +
        '</div>',
    created: function() {
        userApi.get().then(result =>
        result.json().then(data =>
        data.forEach(user => this.users.push(user))
    )
    )
    },
    methods: {
        editMethod: function(user) {
            this.user = user;
        }
    }
});

var app = new Vue({
    el: '#app',
    template: '<users-list :users="users" />',
    data: {
        users: []
    }
});