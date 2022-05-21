"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var ProjectList = /** @class */ (function () {
    function ProjectList(type) {
        this.type = type;
        this.templateElement = document.getElementById('project-list');
        this.hostElement = document.getElementById('app');
        this.section = this.importTemplateContent().firstElementChild;
        this.section.id = "".concat(this.type, "-projects");
        this.attachTemplateSection(this.section);
        this.renderContent();
    }
    ProjectList.prototype.renderContent = function () {
        this.section.querySelector('ul').id = "".concat(this.type, "-projects-list");
        this.section.querySelector('h2').textContent = this.type.toUpperCase() + ' Projects';
    };
    ProjectList.prototype.importTemplateContent = function () {
        var importedNode = document.importNode(this.templateElement, true);
        return importedNode.content;
    };
    ProjectList.prototype.attachTemplateSection = function (section) {
        this.hostElement.insertAdjacentElement('beforeend', section);
    };
    return ProjectList;
}());
var ProjectInput = /** @class */ (function () {
    function ProjectInput() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        this.formElement = this.importTemplateContent().firstElementChild;
        this.attachTemplateForm(this.formElement);
        this.titleInput = this.formElement.querySelector('#title');
        this.descriptionInput = this.formElement.querySelector('#description');
        this.peopleInput = this.formElement.querySelector('#people');
        this.configureForm();
    }
    ProjectInput.prototype.importTemplateContent = function () {
        var importedNode = document.importNode(this.templateElement, true);
        return importedNode.content;
    };
    ProjectInput.prototype.attachTemplateForm = function (form) {
        this.hostElement.insertAdjacentElement('afterbegin', form);
    };
    ProjectInput.prototype.configureForm = function () {
        this.formElement.addEventListener("submit", this.sumbitHandler);
    };
    ProjectInput.prototype.sumbitHandler = function (event) {
        event.preventDefault();
        var userData = this.collectFormData();
        if (Array.isArray(userData)) {
            var title = userData[0], desc = userData[1], people = userData[2];
            console.log(title, desc, people);
            this.clearAll();
        }
    };
    ProjectInput.prototype.collectFormData = function () {
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
            min: 2,
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
}());
var projectInput = new ProjectInput();
var activeList = new ProjectList('active');
var finishedList = new ProjectList('finished');
