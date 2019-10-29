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
            firstName: '',
            id: ''
        }
    },
    watch: {
        userAttr: function(newVal, oldVal) {
            this.firstName = newVal.firstName;
            this.id = newVal.id;
        }
    },
    template:
        '<div>' +
        '<input type="text" placeholder="Write something" v-model="firstName" />' +
        '<input type="button" value="Save" @click="save" />' +
        '</div>',
    methods: {
        save: function() {
            var user = { firstName: this.firstName };

            if (this.id) {
                userApi.update({id: this.id}, user).then(result =>
                result.json().then(data => {
                    var index = getIndex(this.users, data.id);
                this.users.splice(index, 1, data);
                this.firstName = ''
                this.id = ''
            })
            )
            } else {
                userApi.save({}, user).then(result =>
                result.json().then(data => {
                    this.users.push(data);
                this.firstName = ''
            })
            )
            }
        }
    }
});

Vue.component('user-row', {
    props: ['user', 'editMethod', 'users'],
    template: '<div>' +
        '<i>({{ user.id }})</i> {{ user.firstName }}' +
        '<span style="position: absolute; right: 0">' +
        '<input type="button" value="Edit" @click="edit" />' +
        '<input type="button" value="X" @click="del" />' +
        '</span>' +
        '</div>',
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
        '<user-row v-for="user in users" :key="user.id" :user="user" ' +
        ':editMethod="editMethod" :users="users" />' +
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