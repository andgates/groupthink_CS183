// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) {
        var k=0;
        return v.map(function(e) {e._idx = k++;});
    };

    self.get_courses = function () {
      self.vue.loading = true;
      // Gets new products in response to a query, or to an initial page load.
      $.getJSON(courses_url, function(data) {
          self.vue.my_courses = data.my_courses;
          //enumerate(self.vue.my_courses);
          self.vue.loading = false;
      });
    };


    self.get_projects = function () {
      self.vue.loading = true;
      self.vue.projects = [];
      // Gets new products in response to a query, or to an initial page load.
      $.getJSON(projects_url, $.param({c_id: self.vue.course_id}), function(data) {
          self.vue.projects = data.projects;
          //enumerate(self.vue.projects);
          self.vue.loading = false;
      });
    };

    self.get_one_project = function (course_id,p_id) {
      self.vue.course_id = course_id;
      self.vue.project_id = p_id;
      self.vue.loading = true;
      self.vue.proj = [];
      self.vue.proj_matches = [];
      // Gets new products in response to a query, or to an initial page load.
      $.getJSON(view_project_url, $.param({c_id: self.vue.course_id, p_id: self.vue.project_id}), function(data) {
          self.vue.proj = data.project;
          self.vue.proj_matches = data.matches;
          //enumerate(self.vue.proj);
          //enumerate(self.vue.proj_matches);
          self.vue.loading = false;
      });
    };

    self.goto = function (page, course_id, p_id) {
        self.vue.page = page;
        self.vue.course_id = course_id;
        self.vue.project_id = p_id;
        if (page == 'project_list') {
          // Get the orders if the current page is order_hist
          self.get_projects();
        };
    };


    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            loading: false,
            my_courses: [],
            projects: [],
            proj_matches: [],
            proj: [],
            course_id: "",
            project_id: "",
            page: 'courses',
        },
        methods: {
            get_courses: self.get_courses,
            get_projects: self.get_projects,
            get_one_project: self.get_one_project,
            goto: self.goto,
        }

    });

    self.get_courses();
    //self.read_cart();
    $("#vue-div").show();


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
