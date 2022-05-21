"use strict";
// Types
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["ACTIVE"] = 0] = "ACTIVE";
    ProjectStatus[ProjectStatus["FINISHED"] = 1] = "FINISHED";
})(ProjectStatus || (ProjectStatus = {}));
;
var Project = /** @class */ (function () {
    function Project(title, description, people, status) {
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
        this.id = (Math.random() + Date.now()).toString();
    }
    return Project;
}());
function validateValue(validator) {
    var isValid = true;
    if (validator.required) {
        isValid = isValid && validator.value.toString().length !== 0;
    }
    if ('maxLength' in validator && validator.maxLength !== undefined) {
        isValid = isValid && validator.value.toString().length < validator.maxLength;
    }
    if ('minLength' in validator && validator.minLength !== undefined) {
        isValid = isValid && validator.value.toString().length > validator.minLength;
    }
    if ('max' in validator && validator.max !== undefined) {
        isValid = isValid && validator.value < validator.max;
    }
    if ('min' in validator && validator.min !== undefined) {
        isValid = isValid && validator.value > validator.min;
    }
    return isValid;
}
function autoBind(_, _2, descriptor) {
    var originalMethod = descriptor.value;
    var adjustedDescriptor = {
        configurable: true,
        get: function () {
            var fn = originalMethod.bind(this);
            return fn;
        }
    };
    return adjustedDescriptor;
}
var State = /** @class */ (function () {
    function State() {
        this.listeners = [];
    }
    State.prototype.addListener = function (listener) {
        this.listeners.push(listener);
    };
    return State;
}());
var ProjectState = /** @class */ (function (_super) {
    __extends(ProjectState, _super);
    function ProjectState() {
        var _this = _super.call(this) || this;
        _this.projects = [];
        return _this;
    }
    ProjectState.getInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    };
    ProjectState.prototype.addProject = function (title, desc, people) {
        var newProject = new Project(title, desc, people, ProjectStatus.ACTIVE);
        this.projects.push(newProject);
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listener = _a[_i];
            listener(this.projects.slice());
        }
    };
    return ProjectState;
}(State));
var projectState = ProjectState.getInstance();
var Component = /** @class */ (function () {
    function Component(tempId, hostId, isAfterStart, elementId) {
        this.templateElement = document.getElementById(tempId);
        this.hostElement = document.getElementById(hostId);
        this.element = this.importTemplateContent().firstElementChild;
        this.attachTemplateElement(isAfterStart);
    }
    Component.prototype.importTemplateContent = function () {
        var importedNode = document.importNode(this.templateElement, true);
        return importedNode.content;
    };
    Component.prototype.attachTemplateElement = function (isAfterStart) {
        this.hostElement.insertAdjacentElement(isAfterStart ? 'afterbegin' : 'beforeend', this.element);
    };
    return Component;
}());
var ProjectItem = /** @class */ (function (_super) {
    __extends(ProjectItem, _super);
    function ProjectItem(hostId, project) {
        var _this = _super.call(this, 'single-project', hostId, false, project.id) || this;
        _this.project = project;
        console.log(_this.element);
        _this.configure();
        _this.renderContent();
        return _this;
    }
    Object.defineProperty(ProjectItem.prototype, "persons", {
        get: function () {
            if (this.project.people === 1)
                return '1 person';
            return "".concat(this.project.people, " persons");
        },
        enumerable: false,
        configurable: true
    });
    ProjectItem.prototype.renderContent = function () {
        this.element.querySelector('h2').textContent = this.project.title;
        this.element.querySelector('h3').textContent = this.persons + ' assgined';
        this.element.querySelector('p').textContent = this.project.description;
    };
    ProjectItem.prototype.configure = function () { };
    ;
    return ProjectItem;
}(Component));
var ProjectList = /** @class */ (function (_super) {
    __extends(ProjectList, _super);
    function ProjectList(type) {
        var _this = _super.call(this, 'project-list', 'app', false, "".concat(type, "-projects")) || this;
        _this.type = type;
        _this.assignedProjects = [];
        _this.element.id = "".concat(_this.type, "-projects");
        _this.configure();
        _this.renderContent();
        return _this;
    }
    ProjectList.prototype.renderProjects = function () {
        var projectsList = this.element.querySelector("#".concat(this.type, "-projects-list"));
        console.log(projectsList);
        projectsList.innerHTML = '';
        for (var _i = 0, _a = this.assignedProjects; _i < _a.length; _i++) {
            var project = _a[_i];
            console.log(projectsList.id);
            new ProjectItem(projectsList.id, project);
        }
    };
    ProjectList.prototype.renderContent = function () {
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' Projects';
    };
    ProjectList.prototype.configure = function () {
        var _this = this;
        this.element.querySelector('ul').id = "".concat(this.type, "-projects-list");
        projectState.addListener(function (projects) {
            var filteredProjects = projects.filter(function (project) {
                if (_this.type === 'active') {
                    return project.status === ProjectStatus.ACTIVE;
                }
                return project.status === ProjectStatus.FINISHED;
            });
            _this.assignedProjects = filteredProjects;
            _this.renderProjects();
        });
    };
    return ProjectList;
}(Component));
var ProjectInput = /** @class */ (function (_super) {
    __extends(ProjectInput, _super);
    function ProjectInput() {
        var _this = _super.call(this, 'project-input', 'app', true) || this;
        _this.titleInput = _this.element.querySelector('#title');
        _this.descriptionInput = _this.element.querySelector('#description');
        _this.peopleInput = _this.element.querySelector('#people');
        _this.configure();
        return _this;
    }
    ProjectInput.prototype.configure = function () {
        this.element.addEventListener("submit", this.sumbitHandler);
    };
    ProjectInput.prototype.sumbitHandler = function (event) {
        event.preventDefault();
        var userData = this.validateFormData();
        if (Array.isArray(userData)) {
            var title = userData[0], desc = userData[1], people = userData[2];
            projectState.addProject(title, desc, people);
            this.clearAll();
        }
    };
    ProjectInput.prototype.renderContent = function () { };
    ProjectInput.prototype.validateFormData = function () {
        var enteredTitle = this.titleInput.value.trim();
        var enteredDescription = this.descriptionInput.value.trim();
        var enteredPeople = +this.peopleInput.value;
        var titleValidator = {
            required: true,
            value: enteredTitle,
            minLength: 3,
            maxLength: 50
        };
        var descValidator = {
            required: true,
            value: enteredDescription,
            minLength: 10,
            maxLength: 100
        };
        var peopleValidator = {
            required: true,
            value: enteredPeople,
            max: 6
        };
        if (this.isFormValid([titleValidator, descValidator, peopleValidator])) {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
        alert("Form not valid");
    };
    ProjectInput.prototype.isFormValid = function (input) {
        return input.every(function (validator) { return validateValue(validator); });
    };
    ProjectInput.prototype.clearAll = function () {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    };
    __decorate([
        autoBind
    ], ProjectInput.prototype, "sumbitHandler", null);
    return ProjectInput;
}(Component));
var projectInput = new ProjectInput();
var activeList = new ProjectList('active');
var finishedList = new ProjectList('finished');
