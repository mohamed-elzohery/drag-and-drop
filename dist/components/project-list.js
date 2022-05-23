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
import { projectState } from "../state/project.js";
import { ProjectItem } from "./project-item.js";
import { ProjectStatus } from "../models/project.js";
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
        projectState.moveProject(projectID, this.type === 'active' ? ProjectStatus.ACTIVE : ProjectStatus.FINISHED);
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
            new ProjectItem(projectsList.id, project);
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
    __decorate([
        autoBind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        autoBind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        autoBind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    return ProjectList;
}(Component));
export { ProjectList };
