"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function autoBind(_, _2, descriptor) {
    console.log(descriptor.value);
    var originalMethod = descriptor.value;
    var adjustedDescriptor = {
        configurable: true,
        get: function () {
            var fn = originalMethod.bind(this);
            return fn;
        }
    };
    console.log(adjustedDescriptor);
    return adjustedDescriptor;
}
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
        console.log(this.titleInput.value);
    };
    __decorate([
        autoBind
    ], ProjectInput.prototype, "sumbitHandler", null);
    return ProjectInput;
}());
var projectInput = new ProjectInput();
