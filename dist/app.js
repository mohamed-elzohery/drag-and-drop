"use strict";
var ProjectInput = /** @class */ (function () {
    function ProjectInput() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        this.attachTemplateForm();
    }
    ProjectInput.prototype.importTemplateContent = function () {
        var importedNode = document.importNode(this.templateElement, true);
        return importedNode.content;
    };
    ProjectInput.prototype.attachTemplateForm = function () {
        var templateForm = this.importTemplateContent().firstElementChild;
        this.hostElement.insertAdjacentElement('afterbegin', templateForm);
    };
    return ProjectInput;
}());
var iiii = new ProjectInput();
