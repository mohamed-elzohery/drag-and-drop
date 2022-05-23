"use strict";
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
var App;
(function (App) {
    // Types
    var ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["ACTIVE"] = 0] = "ACTIVE";
        ProjectStatus[ProjectStatus["FINISHED"] = 1] = "FINISHED";
    })(ProjectStatus = App.ProjectStatus || (App.ProjectStatus = {}));
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
    App.Project = Project;
})(App || (App = {}));
var App;
(function (App) {
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
    App.autoBind = autoBind;
})(App || (App = {}));
var App;
(function (App) {
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
    App.validateValue = validateValue;
})(App || (App = {}));
var App;
(function (App) {
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
            var newProject = new App.Project(title, desc, people, App.ProjectStatus.ACTIVE);
            this.projects.push(newProject);
            this.updateListeners();
        };
        ProjectState.prototype.updateListeners = function () {
            for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
                var listener = _a[_i];
                listener(this.projects.slice());
            }
        };
        ProjectState.prototype.moveProject = function (projectID, newStatus) {
            var project = this.projects.filter(function (proj) { return proj.id === projectID; })[0];
            if (project && project.status !== newStatus) {
                project.status = newStatus;
                this.updateListeners();
            }
        };
        return ProjectState;
    }(State));
    App.projectState = ProjectState.getInstance();
})(App || (App = {}));
var App;
(function (App) {
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
    App.Component = Component;
})(App || (App = {}));
/// <reference path="base.ts" />
var App;
(function (App) {
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
                App.projectState.addProject(title, desc, people);
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
            return input.every(function (validator) { return App.validateValue(validator); });
        };
        ProjectInput.prototype.clearAll = function () {
            this.titleInput.value = '';
            this.descriptionInput.value = '';
            this.peopleInput.value = '';
        };
        __decorate([
            App.autoBind
        ], ProjectInput.prototype, "sumbitHandler", null);
        return ProjectInput;
    }(App.Component));
    App.ProjectInput = ProjectInput;
})(App || (App = {}));
var App;
(function (App) {
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
        ProjectList.prototype.dragOverHandler = function (event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                console.log(event.dataTransfer.getData('text/plain'));
                event.preventDefault();
                var list = this.element.querySelector('ul');
                list.classList.add('droppable');
            }
        };
        ProjectList.prototype.dropHandler = function (event) {
            var projectID = event.dataTransfer.getData('text/plain');
            App.projectState.moveProject(projectID, this.type === 'active' ? App.ProjectStatus.ACTIVE : App.ProjectStatus.FINISHED);
        };
        ProjectList.prototype.dragLeaveHandler = function (event) {
            var list = this.element.querySelector('ul');
            list.classList.remove('droppable');
        };
        ProjectList.prototype.renderProjects = function () {
            var projectsList = this.element.querySelector("#".concat(this.type, "-projects-list"));
            projectsList.innerHTML = '';
            for (var _i = 0, _a = this.assignedProjects; _i < _a.length; _i++) {
                var project = _a[_i];
                new App.ProjectItem(projectsList.id, project);
            }
        };
        ProjectList.prototype.renderContent = function () {
            this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' Projects';
        };
        ProjectList.prototype.configure = function () {
            var _this = this;
            this.element.querySelector('ul').id = "".concat(this.type, "-projects-list");
            this.element.addEventListener('dragover', this.dragOverHandler);
            this.element.addEventListener('drop', this.dropHandler);
            this.element.addEventListener('dragleave', this.dragLeaveHandler);
            App.projectState.addListener(function (projects) {
                var filteredProjects = projects.filter(function (project) {
                    if (_this.type === 'active') {
                        return project.status === App.ProjectStatus.ACTIVE;
                    }
                    return project.status === App.ProjectStatus.FINISHED;
                });
                _this.assignedProjects = filteredProjects;
                _this.renderProjects();
            });
        };
        __decorate([
            App.autoBind
        ], ProjectList.prototype, "dragOverHandler", null);
        __decorate([
            App.autoBind
        ], ProjectList.prototype, "dropHandler", null);
        __decorate([
            App.autoBind
        ], ProjectList.prototype, "dragLeaveHandler", null);
        return ProjectList;
    }(App.Component));
    App.ProjectList = ProjectList;
})(App || (App = {}));
/// <reference path="models/drag-drop.ts" />
/// <reference path="models/project.ts" />
/// <reference path="decorators/autobind.ts" />
/// <reference path="utils/validation.ts" />
/// <reference path="state/project.ts" />
/// <reference path="components/userInput.ts" />
/// <reference path="components/project-list.ts" />
var App;
(function (App) {
    new App.ProjectInput();
    new App.ProjectList('active');
    new App.ProjectList('finished');
})(App || (App = {}));
var App;
(function (App) {
    var ProjectItem = /** @class */ (function (_super) {
        __extends(ProjectItem, _super);
        function ProjectItem(hostId, project) {
            var _this = _super.call(this, 'single-project', hostId, false, project.id) || this;
            _this.project = project;
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
        ProjectItem.prototype.dragStartHandler = function (event) {
            event.dataTransfer.setData('text/plain', this.project.id);
            event.dataTransfer.effectAllowed = "move";
        };
        ProjectItem.prototype.dragEndHandler = function (event) {
        };
        ProjectItem.prototype.renderContent = function () {
            this.element.querySelector('h2').textContent = this.project.title;
            this.element.querySelector('h3').textContent = this.persons + ' assgined';
            this.element.querySelector('p').textContent = this.project.description;
        };
        ProjectItem.prototype.configure = function () {
            this.element.addEventListener('dragstart', this.dragStartHandler);
            this.element.addEventListener('dragend', this.dragEndHandler);
        };
        ;
        __decorate([
            App.autoBind
        ], ProjectItem.prototype, "dragStartHandler", null);
        __decorate([
            App.autoBind
        ], ProjectItem.prototype, "dragEndHandler", null);
        return ProjectItem;
    }(App.Component));
    App.ProjectItem = ProjectItem;
})(App || (App = {}));
