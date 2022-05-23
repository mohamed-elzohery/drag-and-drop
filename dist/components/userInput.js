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
import { Component } from "./base.js";
import { autoBind } from "../decorators/autobind.js";
import { validateValue } from "../utils/validation.js";
import { projectState } from "../state/project.js";
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
export { ProjectInput };
